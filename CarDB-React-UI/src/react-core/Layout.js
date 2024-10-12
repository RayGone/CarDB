import {downloadURL} from "./fetch";

export default function Layout({children, search="", onSearchCar=(value)=>value , onAddCar=()=>{}}){
    return(
        <div className="container">
            <header>
                <h1><img className="logo" src="/car.jpg" alt="Logo - a Car" /> &nbsp;&nbsp; <span>CarDB</span></h1>
                <div className="tab-buttons">
                    <input                  
                        placeholder="Search... [Name, Origin]"
                        className="form-control"
                        value={search}
                        onChange={({target}) => onSearchCar(target.value)} />

                    <button className='btn' onClick={onAddCar}>Add Car</button>
                    <a className='btn btn-primary' target="_blank" rel="noreferrer" href={downloadURL}>Download</a>
                </div>
            </header>

            <div  className='body'>
                {children}
            </div>
        </div>
    );
}