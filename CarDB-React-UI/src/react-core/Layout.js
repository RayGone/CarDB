import {downloadURL} from "../fetch";
import { Link } from "react-router-dom";
import { FaPlus, FaDownload } from "react-icons/fa";

export default function Layout({children, search="", onSearchCar=(value)=>value , onAddCar=()=>{}}){
    return(
        <div className="container">
            <header>
                <h1><img className="logo" src="/car.jpg" alt="Logo - a Car" /> &nbsp;&nbsp; <span>CarDB</span></h1>

                <span>Switch to: <Link to="/material">MaterialUI View</Link></span>
                <div className="tab-buttons">
                    <input                  
                        placeholder="Search... [Name, Origin]"
                        className="form-control"
                        value={search}
                        onChange={({target}) => onSearchCar(target.value)} />

                    <button className='btn' onClick={onAddCar}><FaPlus/>&nbsp;&nbsp;Add Car</button>
                    <a className='btn btn-primary' target="_blank" rel="noreferrer" href={downloadURL}>Download &nbsp;&nbsp; <FaDownload /></a>
                </div>
            </header>

            <div  className='body'>
                {children}
            </div>
        </div>
    );
}