import { FaTrash, FaPlus, FaCheck  } from "react-icons/fa";
import { filterAttributes, filterOps, filter1} from "../model";
import { useState } from "react";

export default function Filter({filters=[], onAddFilter=(f)=>{}}){
    const [addFilter, openAddFilter] = useState(filters.length===0);
    const [filterAttr, setFilterAttr] = useState("-1");
    const [filterOp, setFilterOps] = useState("-1");
    const [filterValue, setFilterValue] = useState(0);
    
    function handleAddFilter(){
        const f = {...filter1};
        f.field = filterAttr;
        f.ops = filterOp;
        f.value = filterValue;

        if(f.filter === "-1" || f.ops === "-1" || f.value < 0) return;

        onAddFilter(f);
    }
    return (
        <>
            <h2 className="flexRow flexJustifySpaceBetween flexAlignCenter">
                <span>Filters</span>
                <span className='btn btn-action' style={{fontSize:"0.6em"}} onClick={()=>openAddFilter(true)}><FaPlus/>&nbsp;&nbsp;Add</span>
            </h2>
            <hr />
            {
                addFilter && (
                    <div className="flexRow flexAlignCenter">
                        <div className="flexCol flexAlignCenter"  style={{border: "1px solid brown", width: "80%", padding:"10px", margin:"10px", borderRadius: "10px"}}>
                            <select className="select" defaultValue={filterAttr} onChange={(e) => {setFilterAttr(e.target.value)}}>
                                <option value="-1">Select Attribute</option>
                                {filterAttributes.map((attr) => <option value={attr.key} key={attr.key}>{attr.header}</option>)}
                            </select>
                            
                            <select className="select" defaultValue={filterOp} onChange={(e) => {setFilterOps(e.target.value)}}>
                                <option value="-1">Select Condition</option>
                                {filterOps.map((attr) => <option value={attr.key} key={attr.key}>{attr.value}</option>)}
                            </select>
                            
                            <input className="input input-number" style={{width: "60%", padding: "10px 20px"}} type="number" defaultValue={filterValue} onChange={(e) => {setFilterValue(parseInt(e.target.value))}} />
                        </div>
                        <div className="flexCol flexAlignCenter">
                            <span onClick={()=>openAddFilter(!addFilter)}><FaPlus style={{color:"red", transform: "rotate(45deg)", cursor: "pointer"}}/></span>
                            <br />
                            <span style={{marginTop: "20px", cursor: "pointer"}} onClick={handleAddFilter}><FaCheck /></span>
                        </div>
                    </div>
                )
            }

            <div className="filter-body">
            {
                filters.map((filter,index) => {
                    return (
                        <div className="flexRow flexAlignCenter" key={index}>
                            <div class="filter-desc">
                                <strong>{filter.field}</strong><br />
                                <span>{filter.ops}</span><br />
                                <strong>{filter.value}</strong>
                            </div>
                            <span style={{margin:"10px", color: "red"}}><FaTrash /></span>
                        </div>
                    );
                })
            }
            </div>
        </>
    );
}

{/* 
<div class="filter-desc">
                <strong>{{ filter.field | titlecase}}</strong><br>
                {{ filter.ops | opName}}<br>
                <strong>{{ filter.value }}</strong>
                </div>
                <button mat-icon-button color="warn" (click)="deleteFilter(filter)">
                <mat-icon>delete</mat-icon>
                </button> */}
                