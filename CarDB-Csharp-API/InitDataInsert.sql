DECLARE @json NVARCHAR(MAX);

-- Load JSON data into the variable
SELECT @json = BulkColumn
FROM OPENROWSET (BULK '.\data.json', SINGLE_CLOB) AS j;

-- Insert data into the table
INSERT INTO [local_apps].CarDB.Cars ( Name, Origin, ModelYear, Acceleration, HorsePower, MPG, Weight, Cylinders, Displacement)
SELECT *
FROM OPENJSON(@json)
WITH (
    Name NVARCHAR(50) '$.name',
	Origin NVARCHAR(25) '$.origin',
    ModelYear INT '$.model_year',
    Acceleration FLOAT '$.acceleration',
    HorsePower FLOAT '$.horsepower',
    MPG FLOAT '$.mpg',
    Weight FLOAT '$.weight',
    Cylinders INT '$.cylinders',
    Displacement FLOAT '$.displacement'
);
