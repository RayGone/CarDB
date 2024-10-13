export const columnDef = [
  {
    key: 'id',
    header: "ID",
    type: "number",
    required: false
  },
  {
    key: 'name',
    header: "Car Name",
    type: "string",
    required: true
  },
  {
    key: 'origin',
    header: "Origin",
    type: "string",
    required: true
  },
  {
    key: 'model_year',
    header: "Model Year",
    type: "number",
    required: true
  },
  {
    key: 'acceleration',
    header: "Acceleration",
    type: "number",
    required: false
  },
  {
    key: 'horsepower',
    header: "Horsepower",
    type: "number",
    required: false
  },
  {
    key: 'mpg',
    header: "MPG",
    type: "number",
    required: false
  },
  {
    key: 'weight',
    header: "Weight",
    type: "number",
    required: false
  },
  {
    key: 'cylinders',
    header: "Cylinders",
    type: "number",
    required: false
  },
  {
    key: 'displacement',
    header: "Displacement",
    type: "number",
    required: false
  },
]

export const filterAttributes = columnDef.filter((col) => col.key !== 'id').filter( col => col.key !== 'name').filter(col=> col.key !== 'origin');
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

export const page_sizes = [20, 50, 100]
export const filterModel = {
    filter: [],
    limit: 20,
    order: "asc",
    orderBy: "id",
    search: '',
    page: 0
  };

export const filter1 = {
  field: "",
  ops: "",
  value: ""
}