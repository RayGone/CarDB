import { useState, useEffect, useMemo } from "react";
import _ from "lodash";
import Layout from "./Layout";
import EnhancedTable from "./Table";
import { fetchCars, init_data } from "../fetch";
import { setFilterToStorage, getFilterFromStorage, sortObj, setSort } from "../util";
import { pageSizeOptions } from "../model";

export default function MUIPage(){
    const [data, setData] = useState(init_data);
    const [filterModel, setFilterModel] = useState(getFilterFromStorage());

    function updateFilter(f){
        setFilterToStorage(f);
        setFilterModel(f);
    }

    const debouncedSetFilter = useMemo(()=>_.debounce(updateFilter, 100), []); //Limit Search and Page change;

    useEffect(() => {
        fetchCars(filterModel, (batch) => {
            setData(prev=>batch);

            if(batch.total > 0 && batch.cars.length === 0){
                updateFilter({
                    ...filterModel,
                    page:0
                });
            }
        })
    },[filterModel])

    const search = filterModel.search
    const page = filterModel.page;
    const size = filterModel.limit;
    const cars = data.cars;
    const total = data.total;
    const conditions = filterModel.filter;
    const orderBy = filterModel.orderBy;
    const order = filterModel.order;

    return <Layout search={search}>
            <EnhancedTable 
                data={cars}
                total={total}
                order={order} 
                orderBy={orderBy}
                page={page}
                pageSize={size}
                pageSizeOptions={pageSizeOptions} 
                
                onSort={(orderBy) => {
                    const f = setSort(orderBy);
                    const sorted = sortObj(cars, f.orderBy, f.order);
                    setData((prev)=>{
                        prev.cars = sorted;
                        prev.total = sorted.length;
                        return prev;
                    });
                    updateFilter(f);
                }}/>

            <p>Hello World!!</p>
        </Layout>;
}