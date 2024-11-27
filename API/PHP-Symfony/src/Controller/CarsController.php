<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
// use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\DBAL\Connection;
// use Exception;
// use DateTime;

use App\Dto\QueryFilterDto;
use App\Dto\FilterDto;


#[Route('/cars', name: 'Cars API')]
class CarsController extends AbstractController
{
    #[Route('/', name: 'Get Cars', methods:["GET"], stateless:true)]
    public function get(Request $request, Connection $db, SerializerInterface $serializer): Response{
        $param = new QueryFilterDto($request->query->all());
        // $json = $serializer->serialize($param,'json');
        // return JsonResponse::fromJsonString($json);

        $result = $this->runQuery($db, $param);
        return JsonResponse::fromJsonString($serializer->serialize($result,'json'));
    }

    #[Route('/filterSearch', name: 'Get Cars', methods:["POST"], stateless:true)]
    public function filteredSearch(Request $request, Connection $db, SerializerInterface $serializer): Response{
        $param = new QueryFilterDto(json_decode($request->getContent(), true));

        $result = $this->runQuery($db, $param);
        return JsonResponse::fromJsonString($serializer->serialize($result,'json'));
    }

    //=====================
    //------Services-----------
    //=============================
    
    public function fetchQueryBuilder(QueryFilterDto $param): array
    {
        $offset = $param->getLimit() * $param->getPage();
        $conditions = "";
        if($param->isConditions()){
            $conditions = "WHERE ";
            $search = $param->getSearch();
            if(!!strlen($search)){
                $conditions.= "(LOWER(name) ILIKE '%$search%' OR ";
                $conditions.= "LOWER(origin) ILIKE '%$search%') ";
            }

            $filter = $param->getFilter();
            if(!!count($filter)){
                $conditions.= strlen($conditions)>6 ? "AND " : "";
                $fc = count($filter);
                foreach($filter as $f){
                    if($f instanceof FilterDto){
                        $conditions.= "{$f->getField()}{$f->getOps()}{$f->getValue()}";
                    }
                    $fc = $fc-1;
                    if($fc) $conditions.= " AND ";
                }
            }
        }

        $sql = "SELECT id,name,origin,model_year,acceleration,horsepower,mpg,weight,cylinders,displacement
                FROM public.cars {$conditions} ORDER BY {$param->getOrderBy()} {$param->getOrder()} LIMIT {$param->getLimit()} OFFSET {$offset}";
        $count = "SELECT count(*) as total FROM public.cars $conditions";
        return [$sql, $count];
    }

    public function runQuery(Connection $db, QueryFilterDto $param): array
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