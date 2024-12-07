<?php

namespace App\Http\Controllers;

use App\Dto\FilterDto;
use Illuminate\Http\Request;
use App\Models\Cars;
use App\Dto\QueryFilterDto;
use App\Dto\CarsDto;
use RuntimeException;

class CarsController extends Controller
{

    private function queryData(QueryFilterDto $filter)
    {
        $query = Cars::orderBy($filter->getOrderBy(), $filter->getOrder());

        if($filter->isConditions()){
            $s = strtolower($filter->getSearch());
            if(strlen($s)>0){
                $query = $query->whereRaw("LOWER(name) LIKE '%{$s}%'")
                                ->orWhereRaw("LOWER(origin) LIKE '%{$s}%'");
            }

            foreach($filter->getFilter() as $f){
                if($f instanceof FilterDto){
                    $query = $query->where($f->getField(), $f->getOps(), $f->getValue());
                }
            }
        }

        $count = $query->count();

        $query = $query->offset($filter->getOffset())->limit($filter->getLimit());
        $cars = $query->get();

        return ["total"=>$count, "cars"=>$cars];
    }

    /**
     * Fetch Data using Get or Post
     */
    public function index(Request $request)
    {
        $filter = new QueryFilterDto($request->all());
        $data = $this->queryData($filter);
        return response()->json($data);
    }

    /**
     * Download File
     */
    public function download(string $type){
        return response()->json([$type]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|numeric',
            'name' => 'required|string|max:255',
            'origin' => 'required|string|max:255',
            'model_year' => 'required|numeric',
            'acceleration' => 'nullable|numeric',
            'horsepower' => 'nullable|numeric',
            'mpg' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'cylinders' => 'nullable|numeric',
            'displacement' => 'nullable|numeric',
        ]);

        $carDto = (new CarsDto($validated))->toArray();
        $car = Cars::where("name",$carDto['name'])->where("origin",$carDto['origin'])->where("model_year",$carDto['model_year'])->get();
        if(count($car))
            return response()->json($car);

        $car = Cars::create($carDto);
        return response()->json($car);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return response()->json(Cars::find($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'id' => 'required|numeric',
            'name' => 'required|string|max:255',
            'origin' => 'required|string|max:255',
            'model_year' => 'required|numeric',
            'acceleration' => 'nullable|numeric',
            'horsepower' => 'nullable|numeric',
            'mpg' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'cylinders' => 'nullable|numeric',
            'displacement' => 'nullable|numeric',
        ]);


        $carDto = (new CarsDto($validated))->toArray();
        $car = Cars::where("id",$id)->first();

        if($id != $carDto['id'] || !$car){
            throw new RuntimeException("Car doesn't Exist.");
        }

        unset($carDto['id']);
        $car->fill($carDto);
        $car->save();
        // or Cars::where("id",$id)->update($carDto);

        return response()->json($car);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $car = Cars::find($id);
        //or Cars::destroy($id);
        $car->delete();
        return response()->json(["deleted"=>$car, "status"=>"success"]);
    }
}
