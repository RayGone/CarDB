import { useEffect, useState } from "react";
import Layout from "./Layout.js";
import Table, {Paginator} from "./Table.js";
import "./styles.css";
import { filterModel, page_sizes } from "../model.js";
import { fetchData, init_data } from "./fetch.js";

export default function Page1(){
    let [data, setData] = useState(init_data);
    let [filter, setFilter] = useState(filterModel);

    useEffect(() => {
        fetchData(filter, (data) => {
            console.log({filter, data})
            setData(cars => data);
        })
    },[filter, setData])

    const page = filter.page;
    const size = filter.limit;
    const cars = data.cars;
    const total = data.total;

    return (
        <>
            <Layout>
                <section>
                    <Table data={cars} bottomHeader={true} actions={true}/>
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
                        setFilter(f);
                    }}
                />
            </footer>
        </>
    );
}