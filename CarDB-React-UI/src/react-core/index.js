import { useEffect, useState, useMemo } from "react";
import Layout from "./Layout";
import Table, {Paginator} from "./Table";
import "./styles.css";
import { filterModel, pageSizeOptions } from "../model";
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
    let [currFilterModel, setFilterModel] = useState(getFilter());

    function updateFilter(f){
        setFilterModel(f);
        localStorage.setItem("filter", JSON.stringify(f));
    }
    const debouncedSetFilter = useMemo(()=>_.debounce(updateFilter, 100), []); //Limit Search and Page change;

    useEffect(() => {
        fetchCars(currFilterModel, (batch) => {
            setData(prev=>batch);

            if(batch.total > 0 && batch.cars.length === 0){
                updateFilter({
                    ...currFilterModel,
                    page:0
                });
            }
        })
    },[currFilterModel])

    const search = currFilterModel.search
    const page = currFilterModel.page;
    const size = currFilterModel.limit;
    const cars = data.cars;
    const total = data.total;
    const conditions = currFilterModel.filter;
    const sort = currFilterModel.orderBy;
    const order = currFilterModel.order;

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
                        sort={sort}
                        order={order}
                        onSort={(key)=>{
                            const changedOrder = sort !== key ? "asc" : (order === "asc" ? "desc" : "asc");
                            const f = {
                                ...currFilterModel,
                                orderBy: key,
                                order: changedOrder
                            };                            
                            cars.sort((carA, carB) => {
                                if(carA[f.orderBy] === carB[f.orderBy]) return 0;
                                const cond = f.order === "asc" ? carA[f.orderBy] > carB[f.orderBy] : carA[f.orderBy] < carB[f.orderBy];
                                return cond ? 1 : -1;
                            });
                            const sortedData = {...data, cars: cars};
                            setData(sortedData);

                            updateFilter(f);
                        }}
                        bottomHeader={true} actions={true} 
                        onDelete={(id)=>{
                            deleteCar(id).then((response)=>{
                                updateFilter(getFilter());
                            });
                        }}
                        onEdit={(row) => openEditCarDialog(row)}
                    />
                </section>
                <aside>
                    <Filter filters={conditions} 
                        onAddFilter={(f)=> {
                            const nF = {...currFilterModel};
                            nF.filter.push(f);
                            updateFilter(nF);
                        }}
                        
                        onRemoveFilter={(index) => {
                            let f = [...currFilterModel.filter]
                            f.splice(index,1);
                            const nF = {...currFilterModel, filter:f}
                            updateFilter(nF);
                        }}/>
                </aside>
            </Layout>
            
            <footer>
                <Paginator 
                    total={total} 
                    size={size} 
                    page_sizes={pageSizeOptions} 
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