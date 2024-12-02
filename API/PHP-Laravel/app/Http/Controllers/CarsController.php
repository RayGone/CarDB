<?php

namespace App\Http\Controllers;

use App\Dto\FilterDto;
use Illuminate\Http\Request;
use App\Models\Cars;
use App\Dto\QueryFilterDto;

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
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = new QueryFilterDto($request->all());
        $data = $this->queryData($filter);
        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
