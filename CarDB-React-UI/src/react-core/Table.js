import { columnDef } from "../model";
import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";
import { MdDelete, MdEdit  } from "react-icons/md";

export function TableHeader({columnDef, sort, order, actions=false, onSort=(key)=>key}){
    const action_col = <th>Actions</th>;
    const sort_el = order === "asc" ? <>&nbsp;&nbsp;<FaArrowCircleUp /></> : <>&nbsp;&nbsp;<FaArrowCircleDown /></>;
    return (
        <thead>
            <tr>
            {
                columnDef.map((col) => <th className="header" key={col.key} onClick={()=>onSort(col.key)}>
                    <span style={{display:"flex", flexDirection:"row", justifyContent:"flex-start",alignItems:"center"}}>{col.header}{ col.key===sort ? sort_el : "" } </span>
                </th>)
            }
                {actions && action_col}
            </tr>
        </thead>
    );
}

export function TableRow({row, actions=false, onDelete=(id)=>{}, onEdit=(row)=>{}}){
    const action_col = <td style={{display: "flex"}}><span className='btn btn-action' onClick={()=>onEdit(row)}><MdEdit size={20} /></span> <span className="btn btn-action" onClick={()=>onDelete(row.id)}><MdDelete size={20} /></span></td>;
    return (
        <tr>
            {
                columnDef.map((col, index) => <td key={index}>{(row[col.key]+"").toUpperCase()}</td>)
            }
            {actions && action_col}
        </tr>
    );
}

export function Paginator({total=0, size=0, page_sizes=[], page=0, onPageChange = ()=>null, onPageSizeChange=()=>null}){
    if(size === 0 && page_sizes.length > 0) size = page_sizes[0];
    const pStart = (page*size) + 1;
    const pEnd = (page+1) * size > total ? total : (page+1) * size;
    const max_n_page = Math.floor(total/size);

    const curr_page = page;
    return(
        <div className="flexRow flexAlignCenter" style={{margin: "10px 5px", justifyContent:"flex-end"}}>
            <span className="page-info-text">Items Per Page:</span>
            <select onChange={(e)=> onPageSizeChange(parseInt(e.target.value))} value={size}>
                {page_sizes.map((s) => <option value={s} key={s}>{s}</option>)}
            </select>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div>
                <button className="page-nav-btn" disabled={page === 0} onClick={()=> onPageChange(page-1)}>{"<"}</button> 
                <input className="page-nav-page-input input-number" type="number"  max={max_n_page} min={1} value={curr_page} onChange={(e) => onPageChange(parseInt(e.target.value))}/>
                <button className="page-nav-btn" disabled={page === max_n_page} onClick={()=> onPageChange(page+1)}>{">"}</button>
            </div>

            &nbsp;&nbsp;| <span className="page-info-text">Showing {pStart} to {pEnd} of {total}</span>
        </div>
    )
}

export default function Table({data, sort, order, actions=true, onDelete=(id)=>{}, onEdit=(row)=>{}, onSort=(key)=>key}){
    return (
        <table>
            <TableHeader sort={sort} order={order} columnDef={columnDef} actions={actions} onSort={onSort}></TableHeader>
            <tbody>
                {
                    data.map((entry) => { return <TableRow key={entry.id} row={entry} actions={actions} onDelete={onDelete} onEdit={onEdit}/>})
                }
            </tbody>
        </table>
    )
}