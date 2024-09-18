export interface Car {
  id: number;
  name: string;
  origin: string;
  model_year: number;
  acceleration: number;
  horsepower: number;
  mpg: number;
  weight: number;
  cylinders: number;
  displacement: number;
}

export const columnDef = [
  {
    key: 'id',
    header: "ID",
    type: "number"
  },
  {
    key: 'name',
    header: "Car Name",
    type: "string"
  },
  {
    key: 'origin',
    header: "Origin",
    type: "string"
  },
  {
    key: 'model_year',
    header: "Model Year",
    type: "number"
  },
  {
    key: 'acceleration',
    header: "Acceleration",
    type: "number"
  },
  {
    key: 'horsepower',
    header: "Horsepower",
    type: "number"
  },
  {
    key: 'mpg',
    header: "MPG",
    type: "number"
  },
  {
    key: 'weight',
    header: "Weight",
    type: "number"
  },
  {
    key: 'cylinders',
    header: "Cylinders",
    type: "number"
  },
  {
    key: 'displacement',
    header: "Displacement",
    type: "number"
  },
]

export interface FilterModel{
  field: string;
  ops: string;
  value: string;
}

export interface DataFilterModel{
  filter: FilterModel[];
  limit: number;
  order: string;
  orderBy: string;
  search: string;
  page: number;
}
