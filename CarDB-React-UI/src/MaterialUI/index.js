import { useState, useEffect, useMemo } from "react";
import _ from "lodash";
import MUILayout from "./Layout";
import EnhancedTable from "./Table";
import MUIFilter from "./Filter";
import { fetchCars, init_data, deleteCar, editCar, addCar } from "../fetch";
import { setFilterToStorage, getFilterFromStorage, sortObj, setSort } from "../util";
import { pageSizeOptions } from "../model";
import { Snackbar } from "@mui/material";
import FormDialog from "./Forms";

export default function MUIPage(){
    const [data, setData] = useState(init_data);
    const [filterModel, setFilterModel] = useState(getFilterFromStorage());
    const [toDelete, setToDelete] = useState(null);
    const [openAddForm, setOpenAddForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [editCarData, setEditCarData] = useState(null);

    function updateFilter(f){
        setFilterModel(f);
        setFilterToStorage(f);
    }

    const debouncedSetFilter = useMemo(()=>_.debounce(updateFilter, 50), []); //Limit Search and Page change;

    useEffect(() => {
        fetchCars(filterModel, (batch) => {
            setData(batch);

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

    return <MUILayout search={search}
            onAdd={()=>{setOpenAddForm(true)}}
            onSearch={(s)=>{
                const f = {
                    ...filterModel,
                    search: s
                }
                debouncedSetFilter(f);
            }}>
            <EnhancedTable 
                data={cars}
                total={total}
                order={order} 
                orderBy={orderBy}
                page={page}
                pageSize={size}
                pageSizeOptions={pageSizeOptions} 

                onPageChange={(p) => {
                    const f = {
                        ...filterModel,
                        page: p
                    }
                    updateFilter(f);
                }}

                onPageSizeChange={(s) => {
                    const f = {
                        ...filterModel,
                        limit: s
                    }
                    updateFilter(f);
                }}
                
                onSort={(orderBy) => {
                    const f = setSort(orderBy);
                    const sorted = sortObj(cars, f.orderBy, f.order);
                    setData((prev)=>{
                        prev.cars = sorted;
                        prev.total = sorted.length;
                        return prev;
                    });
                    updateFilter(f);
                }}
                
                onDelete={
                    (id) => {
                        const car = data.cars.filter((c)=> c.id===id)[0];
                        if(window.confirm("Do you really want to delete this car: "+car.name.toUpperCase())){
                            setToDelete(car)
                            deleteCar(id).then((response)=>{
                                updateFilter(getFilterFromStorage());
                                setToDelete(null);
                            });
                        }
                    }
                }
                
                onEdit={(id) => {
                    const car = data.cars.filter((c)=> c.id===id);
                    if(car.length){
                        setEditCarData(car[0]);
                        setOpenEditForm(true);
                    }
                }}/>

            <MUIFilter 
                filters={conditions} onAdd={(c)=>{
                    const cl = [...filterModel.filter, c]
                    const f = {...filterModel, filter: cl}
                    updateFilter(f);
                }}
                onDelete={(index)=>{
                    const cl = conditions.filter((c,i)=> i!==index && c);
                    const f = {...filterModel, filter: cl};
                    updateFilter(f);
                }}/>

            <Snackbar 
                key="DeleteSnackBar"
                open={toDelete}
                anchorOrigin={{vertical:"top",horizontal:"right"}}
                autoHideDuration={8000}
                message={<>Deleting car <b>{toDelete && toDelete.name.toUpperCase()}</b></>}
            />

            <FormDialog key="AddCar" 
                open={openAddForm} 
                onClose={()=>setOpenAddForm(false)}
                onSubmit={(car) => {
                    addCar(car).then((res) => {
                        setOpenAddForm(false);
                    })
                }}/>
            {(openEditForm && editCarData) &&
                <FormDialog 
                    key="EditCar" 
                    init={editCarData} 
                    open={openEditForm} 
                    onClose={()=>setOpenEditForm(false)} 
                    onSubmit={(car) => {
                            editCar(car).then((res)=>{
                                setOpenEditForm(false);
                                setEditCarData(null);
                                setFilterModel(getFilterFromStorage());
                            });
                        }
                    } />}
        </MUILayout>;
}