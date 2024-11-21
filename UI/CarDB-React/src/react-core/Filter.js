import { FaTrash, FaPlus, FaCheck  } from "react-icons/fa";
import { filterAttributes, filterOps, filter1, columnDef} from "../model";
import { useState } from "react";

export default function Filter({filters=[], onAddFilter=(f)=>{}, onRemoveFilter=(i)=>{}}){
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
        openAddFilter(false);
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
                        <div className="flexCol flexAlignCenter"  
                            style={{border: "1px solid #ccc", width: "80%",
                                    padding:"10px", margin:"10px",
                                    borderRadius: "5px", boxShadow:"2px 2px 3px #ccc, -1px -1px 1px #8885"}}
                        >
                            <select className="select" defaultValue={filterAttr} onChange={(e) => {setFilterAttr(e.target.value)}}>
                                <option value="-1">Select Attribute</option>
                                {filterAttributes.map((attr) => <option value={attr.key} key={attr.key}>{attr.header}</option>)}
                            </select>
                            
                            <select className="select" defaultValue={filterOp} onChange={(e) => {setFilterOps(e.target.value)}}>
                                <option value="-1">Select Condition</option>
                                {filterOps.map((attr) => <option value={attr.key} key={attr.key}>{attr.value}</option>)}
                            </select>
                            
                            <input className="input-number form-control input" type="number" defaultValue={filterValue} onChange={(e) => {setFilterValue(parseInt(e.target.value))}} />
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
                    const col = columnDef.filter((col)=> col.key===filter.field);
                    const attrKey = col[0].header;
                    const opsModel = filterOps.filter((ops)=> ops.key===filter.ops);
                    const opValue = opsModel[0].value;
                    return (
                        <div className="flexRow flexAlignCenter" style={{justifyContent:"space-between", lineHeight:"1.5"}} key={index}>
                            <div className="filter-desc">
                                <strong style={{fontSize: "1.3em"}}>{attrKey}</strong><br />
                                <span>{opValue}</span><br />
                                <small><b>{filter.value}</b></small>
                            </div>
                            <span style={{margin:"10px", color: "red"}} onClick={()=>onRemoveFilter(index)}><FaTrash /></span>
                        </div>
                    );
                })
            }
            </div>
        </>
    );
}
                