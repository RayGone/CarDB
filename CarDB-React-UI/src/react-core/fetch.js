export const baseURL = process.env.REACT_APP_API;
export const filterURL = baseURL + "/filterSearch";
export const downloadURL = baseURL + "/download/csv";
export const totalCountURL = baseURL + "/total";
export const deleteURL = baseURL + "/delete";

export const init_data = {
    cars: [{"name":"chevrolet chevelle malibu","mpg":18.0,"cylinders":8,"displacement":307.0,"horsepower":130.0,"weight":3504,"acceleration":12.0,"model_year":70,"origin":"usa","id":1},{"name":"buick skylark 320","mpg":15.0,"cylinders":8,"displacement":350.0,"horsepower":165.0,"weight":3693,"acceleration":11.5,"model_year":70,"origin":"usa","id":2},{"name":"plymouth satellite","mpg":18.0,"cylinders":8,"displacement":318.0,"horsepower":150.0,"weight":3436,"acceleration":11.0,"model_year":70,"origin":"usa","id":3},],
    total: 3
};

export function fetchData(filter, onDataFetched=(data)=>null){
    fetch(filterURL,{
        method: "POST",
        body: JSON.stringify(filter),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => response.json())
    .then((data) => {onDataFetched(data)})
    .catch((err) => console.log("Fetch Data Error", err));       
}