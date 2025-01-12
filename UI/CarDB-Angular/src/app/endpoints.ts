import { environment } from "../environments/environment";

export const carEndPoints = {
  get: `${environment.apiUrl}/cars/filterSearch`,
  add: `${environment.apiUrl}/cars/add`,
  edit: `${environment.apiUrl}/cars/edit/{id}`,
  delete: `${environment.apiUrl}/cars/delete/{id}`,
  download: `${environment.apiUrl}/cars/download/{type}`,
  total: `${environment.apiUrl}/cars/total`,
};
