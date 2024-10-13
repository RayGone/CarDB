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
        if(!localStorage.getItem("filter") || true){
            localStorage.setItem("filter", JSON.stringify(filterModel))
        }
        return JSON.parse(localStorage.getItem("filter"));
    }

    let [data, setData] = useState(init_data);
    let [currFilterModel, setFilterModel] = useState(getFilter());

    function updateFilter(f){
        setFilterModel(f);
        localStorage.setItem("filter", JSON.stringify(f));
    }
    const debouncedSetFilter = useMemo(()=>_.debounce(updateFilter, 100), []); //Limit Search and Page change;

    useEffect(() => {
        fetchCars(currFilterModel, (data) => {
            setData(data);

            if(data.total > 0 && data.cars.length === 0){
                updateFilter({
                    ...currFilterModel,
                    page:0
                });
            }
        })
    },[currFilterModel, setData])

    const search = currFilterModel.search
    const page = currFilterModel.page;
    const size = currFilterModel.limit;
    const cars = data.cars;
    const total = data.total;
    const conditions = currFilterModel.filter;

    return (
        <>
            <Layout
                search={search}
                onSearchCar={(search)=>{                    
                    const f = {
                        ...currFilterModel,
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
                <aside><Filter filters={conditions} onAddFilter={(f)=> {
                    const nF = {...currFilterModel};
                    nF.filter.push(f);
                    updateFilter(nF);
                }}/></aside>
            </Layout>
            
            <footer>
                <Paginator 
                    total={total} 
                    size={size} 
                    page_sizes={page_sizes} 
                    page={page}  
                    onPageSizeChange={(n) => {                     
                            const f = {
                                ...currFilterModel,
                                limit: n
                            }
                            updateFilter(f);
                        }}
                    
                    onPageChange={(n) => {
                        if(n<0 || n > (total/size)) return;

                        const f = {
                            ...currFilterModel,
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