import { useEffect, useState, useMemo } from "react";
import Layout from "./Layout.js";
import Table, {Paginator} from "./Table.js";
import "./styles.css";
import { filterModel, page_sizes } from "../model.js";
import { deleteData, fetchData, init_data } from "./fetch.js";
import _ from "lodash";

export default function Page1(){
    function getFilter(){
        if(!localStorage.getItem("filter")){
            localStorage.setItem("filter", JSON.stringify(filterModel))
        }
        return JSON.parse(localStorage.getItem("filter"));
    }

    let [data, setData] = useState(init_data);
    let [filter, setFilter] = useState(getFilter());

    function updateFilter(f){
        setFilter(f);
        localStorage.setItem("filter", JSON.stringify(f));
    }

    useEffect(() => {
        fetchData(filter, (data) => {
            setData(data);

            if(data.total > 0 && data.cars.length === 0){
                updateFilter({
                    ...filter,
                    page:0
                });
            }
        })
    },[filter, setData])

    const debouncedSetFilter = useMemo(()=>_.debounce(updateFilter, 100), []);

    const search = filter.search
    const page = filter.page;
    const size = filter.limit;
    const cars = data.cars;
    const total = data.total;

    return (
        <>
            <Layout
                search={search}
                onSearchCar={(search)=>{                    
                    const f = {
                        ...filter,
                        search: search
                    }
                    debouncedSetFilter(f);
                }}>
                <section>
                    <Table data={cars} bottomHeader={true} actions={true} onDelete={(id)=>{
                        deleteData(id).then((response)=>{
                            updateFilter(getFilter());
                        })
                    }}/>
                </section>
                <aside>Filter Section</aside>
            </Layout>
            
            <footer>
                <Paginator 
                    total={total} 
                    size={size} 
                    page_sizes={page_sizes} 
                    page={page}  
                    onPageSizeChange={(n) => {                     
                            const f = {
                                ...filter,
                                limit: n
                            }
                            setFilter(f);
                        }}
                    
                    onPageChange={(n) => {
                        if(n<0 || n > (total/size)) return;

                        const f = {
                            ...filter,
                            page: n
                        }
                        debouncedSetFilter(f);
                    }}
                />
            </footer>
        </>
    );
}