import { filterModel } from "./model";
import _ from "lodash";

export function getFilterFromStorage(){
    if(!localStorage.getItem("filter")){
        localStorage.setItem("filter", JSON.stringify(filterModel))
    }
    return JSON.parse(localStorage.getItem("filter"));
}

export function setFilterToStorage(f){
    localStorage.setItem("filter", JSON.stringify(f));
}

export function setSort(key){
    const filter = getFilterFromStorage();
    filter.order = filter.orderBy === key ? (filter.order==="asc" ? "desc" : "asc") : "asc";
    filter.orderBy = key;
    setFilterToStorage(filter);
    return filter;
}

export function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}
  
export function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function sortObj(arr, by, order){
    let sorted = _.sortBy(arr,[by])
    return order === 'asc' ? sorted : sorted.reverse();
}