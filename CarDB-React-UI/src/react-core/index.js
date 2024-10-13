import { useEffect, useState, useMemo } from "react";
import Layout from "./Layout";
import Table, {Paginator} from "./Table";
import "./styles.css";
import { filterModel, page_sizes } from "../model";
import { fetchCars, init_data, deleteCar, addCar, editCar } from "../fetch";
import _ from "lodash";
import { AddFormModal, EditFormModal } from "./Modal";
import Filter from "./Filter";

export default function Page1(){
    const [addCarFlag, openAddCarDialog] = useState(false);
    const [editCarRow, openEditCarDialog] = useState(null);

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
    const debouncedSetFilter = useMemo(()=>_.debounce(updateFilter, 100), []); //Limit Search and Page change;

    useEffect(() => {
        fetchCars(filter, (data) => {
            setData(data);

            if(data.total > 0 && data.cars.length === 0){
                updateFilter({
                    ...filter,
                    page:0
                });
            }
        })
    },[filter, setData])

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
                }}
                onAddCar={()=> { openAddCarDialog(active => !active)} }>
                <section>
                    <Table data={cars} 
                        bottomHeader={true} actions={true} 
                        onDelete={(id)=>{
                            deleteCar(id).then((response)=>{
                                updateFilter(getFilter());
                            });
                        }}
                        onEdit={(row) => openEditCarDialog(row)}
                    />
                </section>
                <aside><Filter onAddFilter={updateFilter}/></aside>
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
                            updateFilter(f);
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
            {
                addCarFlag 
                    && 
                <AddFormModal 
                    onOk={(row)=>{addCar(row).then((res) =>{
                            updateFilter(getFilter());
                            openAddCarDialog(false);
                        })}} 
                    onClose={()=>{openAddCarDialog(false)}}/>
            }
            {
                editCarRow
                    && 
                <EditFormModal
                    data={editCarRow}
                    onOk={(row) => {
                        let noChange = true;
                        for(let key in row){
                            if(row[key] !== editCarRow[key]){
                                noChange = false;
                                break;
                            }
                        }

                        if(row.id !== editCarRow.id || noChange){
                            openEditCarDialog(null);
                            return;
                        }
                        editCar(row).then((res) => {
                            updateFilter(getFilter());
                            openEditCarDialog(null);
                        }).catch((e) => alert("Network Error!! Please Try Again"));
                    }}
                    onClose={()=>{openEditCarDialog(null)}}/>
            }
        </>
    );
}