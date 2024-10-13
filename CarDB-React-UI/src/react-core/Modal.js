import { useRef, useState } from "react";
import "./modal.css";
import { columnDef } from "../model";
import "./form.css";

export default function Modal({children, title, active=true, activeBtn=true, onClose=()=>{}, onOk=()=>{}, okText="Ok"}){
    const [modalActive, setModalActive] = useState(active);
    const [btnActive, disableBtn] = useState(activeBtn);
    
    const modalClass = modalActive ? "modal" : "modal inactive";
    return (
        <div className={modalClass} onClick={() => {
                setModalActive(!modalActive);
                onClose();
            }}>
            <div className="modal-content" onClick={(e)=> {e.stopPropagation();}}>
                { title ? <div className="modal-title">{title}</div> : ""}
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={()=>{                        
                        setModalActive(!modalActive);
                        onClose();
                    }}>Close</button>
                    <button disabled={!btnActive} className="btn btn-primary"  
                        onClick={()=>{                      
                            onOk();
                            disableBtn(!btnActive)
                        }}
                    >{okText}</button>
                </div>
            </div>
        </div>
    )
}

export function AddFormModal({active=true, onOk=(row)=>row, onClose=()=>{}, okText="Submit"}){
    const formRef = useRef(null);

    function onFormSubmit(){
        const formEl = formRef.current;
        const form = new FormData(formEl);
        let car = {};

        let validated = true;
        for(let col of columnDef){
            car[col.key] = form.get(col.key);
            if(col.required && !car[col.key]) validated = false;
            if(col.type === "string") car[col.key] = car[col.key].toLowerCase();
            else if(col.type === "number") car[col.key] = parseInt(car[col.key]);
        }
        console.log({car});

        if(!validated) alert("Car Name, Origin & Model Year are required field");
        else onOk(car);
    }

    return (
        <Modal title="Add Car" active={true} onClose={onClose} onOk={onFormSubmit} okText={okText}>
            <form className="form" ref={formRef}>
                {
                    columnDef.map((col)=> {
                        if(col.key === "id") return "";
                        return (
                            <input type={col.type} className={"input"+(col.type==="number"?" input-number":"")} key={col.key} placeholder={col.header + (col.required ? " **" : "")} name={col.key} required={col.required} />                            
                        );
                    })
                }
            </form>
        </Modal>
        
    );
}

export function EditFormModal({data, active=true, onOk=(row)=>row, onClose=()=>{}, okText="Submit"}){
    const formRef = useRef(null);

    function onFormSubmit(){
        const formEl = formRef.current;
        const form = new FormData(formEl);
        let car = {};

        let validated = true;
        for(let col of columnDef){
            car[col.key] = form.get(col.key);
            if(col.required && !car[col.key]) validated = false;
            if(col.type === "string") car[col.key] = car[col.key].toLowerCase();
            else if(col.type === "number") car[col.key] = parseFloat(car[col.key]);
        }
        car['id'] = data.id;

        if(!validated) alert("Car Name, Origin & Model Year are required field");
        else onOk(car);
    }

    return (
        <Modal title={<>Edit Car <i>{data.name.toUpperCase()}</i></>} active={true} onClose={onClose} onOk={onFormSubmit} okText={okText} >
            <form className="form" ref={formRef}>
                {
                    columnDef.map((col)=> {
                        if(col.key === "id") return "";
                        return (
                            <input type={col.type} className={"input"+(col.type==="number"?" input-number":"")} key={col.key} placeholder={col.header} name={col.key} defaultValue={data[col.key]}/>
                        );
                    })
                }
            </form>
        </Modal>
    );
}