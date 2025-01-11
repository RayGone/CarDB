<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpFoundation\StreamedJsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\DBAL\Connection;
// use Exception;
// use DateTime;

use App\Dto;
use RuntimeException;

#[Route('/api/cars', name: 'Cars API - ')]
class CarsController extends AbstractController
{
    #[Route('', name: 'Get Cars')]
    public function get(Request $request, Connection $db, SerializerInterface $serializer): Response{
        $param = new Dto\QueryFilterDto($request->query->all());
        // $json = $serializer->serialize($param,'json');
        // return JsonResponse::fromJsonString($json);

        $result = $this->runFetchQuery($db, $param);
        return new JsonResponse($result);
    }

    #[Route('/filterSearch', name: 'Get Cars By Post', methods:["POST"], stateless:true)]
    public function filteredSearch(Request $request, Connection $db, SerializerInterface $serializer): Response{
        $param = new Dto\QueryFilterDto(json_decode($request->getContent(), true));

        $result = $this->runFetchQuery($db, $param);
        return new JsonResponse($result);
    }

    #[Route('/add', name: "Add Car", methods:['POST'], stateless:true)]
    public function addCar(Request $request, Connection $db): Response{
        $post = json_decode($request->getContent(), true);
        try{
            $car = new Dto\CarsDto($post);
            $attributes = $car->carAttributes($exclude=["id"]);

            $keys = implode(",", $attributes);
            $bindings = implode(",",
                            array_map(function($k){
                                return ":$k";
                            }, $attributes)
                        );
            $sql = "INSERT INTO cars ({$keys}) VALUES ({$bindings})";
            $stmt = $db->prepare($sql);
            $bindParams = $car->toArray();

            foreach($attributes as $attr){
                $stmt->bindValue(":$attr", $bindParams[$attr]);
            }
            $exec = $stmt->executeQuery();

            if($exec)
                return $this->json($bindParams);
            else
                throw new RuntimeException("Unable to Add Car! Query Excecution Unsuccessful!");
        }
        catch(RuntimeException $e){
            return $this->json([
                "message" => $e->getMessage(),
                "input" => $post
            ], status: 500);
        } 
    }

    #[Route('/edit/{id}', name: "Edit Car", methods:['PATCH'], stateless:true)]
    public function editCar(Request $request, Connection $db, int $id): Response{
        $patch = json_decode($request->getContent(), true);
  
        try{      
            if(!isset($patch['id']) || $patch['id']!=$id){
                throw new RuntimeException("Car can't be found");
            }
            $car = new Dto\CarsDto($patch);

            $attributes = $car->carAttributes($exclude=["id"]);
            $bindings = implode(",",
                            array_map(function($k){
                                return "$k=:$k";
                            }, $attributes)
                        );

            $sql = "UPDATE cars SET {$bindings} WHERE id=:id";
            $stmt = $db->prepare($sql);
            
            $bindParams = $car->toArray();
            foreach($attributes as $attr){
                $stmt->bindValue(":$attr", $bindParams[$attr]);
            }
            $stmt->bindValue(":id", $id);

            $exec = $stmt->executeQuery();
            if($exec)
                return $this->json($bindParams);
            else
                throw new RuntimeException("Unable to Edit Car! Query Excecution Unsuccessful!");

            return $this->json($car->toArray());
        }
        catch(RuntimeException $e){
            return $this->json([
                "message" => $e->getMessage(),
                "input" => $patch,
            ], status: 500);
        }
    }

    #[Route('/delete/{id}', name: "Delete Car", methods:['DELETE'], stateless:true)]
    public function deleteCAr(int $id, Connection $db): Response{
        $sql = "DELETE FROM cars WHERE id=:id";
        $stmt = $db->prepare($sql);
        $stmt->bindValue(":id", $id);
        $exec = $stmt->executeQuery();
        if($exec){
            return $this->json(["id"=>$id]);
        }

        return $this->json([
            "message" => "Unable to Delete Car! Query Excecution Unsuccessful",
            "input" => $id,
        ], status: 500);   
    }
    
    #[Route('/download/{type}', name: "Downlaod All Data", methods:['GET'], stateless:true)]
    public function download(string $type, Connection $db, SerializerInterface $serializer): Response{
        $sql = "SELECT * FROM cars";
        $stmt = $db->prepare($sql);
        $exec = $stmt->executeQuery();
        if($exec){
            $result = $exec->fetchAllAssociative();
            if($type=="csv"){        
                $response = new StreamedResponse(function() use($serializer, $result){
                    $csv = $serializer->serialize($result,'csv');
                    $handle = fopen('php://output', 'w+');
                    fwrite($handle, $csv);
                    fclose($handle);
                });        
                $response->headers->set('Content-Type', 'text/csv; charset=utf-8'); 
                $response->headers->set('Content-Disposition', 'attachment; filename="cars.csv"');
                return $response;
            }else{
                $response = new StreamedJsonResponse($result);
                $response->headers->set('Content-Type', 'application/json; charset=utf-8'); 
                $response->headers->set('Content-Disposition', 'attachment; filename="cars.json"');
                return $response;
            }

        }

        return $this->json([
            "message" => "Unable to Download!!",
            "input" => $type,
        ], status: 500);   
    }

    //=====================
    //------Services-----------
    //=============================
    
    public function fetchQueryBuilder(Dto\QueryFilterDto $param): array
    {
        $offset = $param->getLimit() * $param->getPage();
        $conditions = "";
        if($param->isConditions()){
            $conditions = "WHERE ";
            $search = $param->getSearch();
            if(!!strlen($search)){
                $conditions.= "(LOWER(name) LIKE '%$search%' OR "; // somehow mysql didn't handle ILIKE
                $conditions.= "LOWER(origin) LIKE '%$search%') "; 
            }

            $filter = $param->getFilter();
            if(!!count($filter)){
                $conditions.= strlen($conditions)>6 ? "AND " : "";
                $fc = count($filter);
                foreach($filter as $f){
                    if($f instanceof Dto\FilterDto){
                        $conditions.= "{$f->getField()}{$f->getOps()}{$f->getValue()}";
                    }
                    $fc = $fc-1;
                    if($fc) $conditions.= " AND ";
                }
            }
        }

        $sql = "SELECT id,name,origin,model_year,acceleration,horsepower,mpg,weight,cylinders,displacement
                FROM cars {$conditions} ORDER BY {$param->getOrderBy()} {$param->getOrder()} LIMIT {$param->getLimit()} OFFSET {$offset}";
        $count = "SELECT count(*) as total FROM cars $conditions";
        return [$sql, $count];
    }

    public function runFetchQuery(Connection $db, Dto\QueryFilterDto $param): array
    {
        [$fsql, $csql] = $this->fetchQueryBuilder($param);
        // return [$fsql, $csql];
        $stmt = $db->prepare($fsql);
        $exec = $stmt->executeQuery();
        $result = $exec->fetchAllAssociative();

        $stmt = $db->prepare($csql);
        $exec = $stmt->executeQuery();
        $total = $exec->fetchAssociative()['total'];
        return ["cars"=>$result, "total"=>$total];
    }

}