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

export interface CarResponse {
  cars: Car[];
  total: number;
}

export const baseUrl = "http://localhost:3000/api";

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

export const filterAttributes = columnDef.filter((col) => col.key != 'id').filter( col => col.key != 'name').filter(col=> col.key != 'origin');
export const filterOps = [
  {
    key: '==',
    value: 'Equals'
  },
  {
    key: '!=',
    value: 'Not Equals'
  },
  {
    key: '>',
    value: 'Greater Than'
  },
  {
    key: '<',
    value: 'Less Than'
  },
  {
    key: '>=',
    value: 'Greater Than or Equals'
  },
  {
    key: '<=',
    value: 'Less Than or Equals'
  },
];

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
