import {columnDef} from "../model";

export function TableHeader({columnDef}){
    return (
        <thead>
            <tr>
            {
                columnDef.map((col) => <th className="header" key={col.key}>{col.header}</th>)
            }
                <th>Actions</th>
            </tr>
        </thead>
    );
}

export function TableRow({row}){
    return (
        <tr>
            {
                columnDef.map((col, index) => <td key={index}>{row[col.key]}</td>)
            }
            <td style={{display: "flex"}}><span className='btn btn-action'>Edit</span> <span className="btn btn-action">Delete</span></td>
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
            <select onChange={onPageSizeChange} value={size}>
                {page_sizes.map((s) => <option value={s} key={s}>{s}</option>)}
            </select>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div>
                <button className="page-nav-btn" disabled={page === 0} onClick={()=> onPageChange(page-1)}>{"<"}</button> 
                <input className="input-number" type="number"  max={max_n_page} min={1} value={curr_page} onChange={(e) => onPageChange(parseInt(e.target.value))}/>
                <button className="page-nav-btn" disabled={page === max_n_page} onClick={()=> onPageChange(page+1)}>{">"}</button>
            </div>

            &nbsp;&nbsp;| <span className="page-info-text">Showing {pStart} to {pEnd} of {total}</span>
        </div>
    )
}

export default function Table({data, bottomHeader=false}){
    return (
        <table>
            <TableHeader columnDef={columnDef}></TableHeader>
            <tbody>
                {
                    data.map((entry) => { return <TableRow key={entry.id} row={entry} />})
                }
            </tbody>
            {!bottomHeader ?? <TableHeader columnDef={columnDef} />}
        </table>
    )
}