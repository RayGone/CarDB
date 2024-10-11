export default function Layout({children}){
    return(
        <div className="container">
            <header>
                <h1><img className="logo" src="/car.jpg" alt="Logo - a Car" /> &nbsp;&nbsp; <span>CarDB</span></h1>
                <div className="tab-buttons">
                    <input                  
                        placeholder="Search... [Name, Origin]"
                        className="form-control" />

                    <button className='btn'>Add Car</button>
                    <a className='btn btn-primary' target="_blank" rel="noreferrer" href={process.env.REACT_APP_API + "/download"}>Download</a>
                </div>
            </header>

            <div  className='body'>
                {children}
            </div>
        </div>

    )
}