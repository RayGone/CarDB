# CarDB-API

This is an express.js project.

## How to run the code

Run "npm start" to run the server.

## How the initial dataset was loaded to database?
- Firstly data is downloaded from [kaggle](https://www.kaggle.com/datasets/tawfikelmetwally/automobile-dataset) and CSV file is copied to the root folder.
- Then, the [convert.py](./convert.py) is run. The python file converts the CSV file to JSON and stores it inside the **src** directory.
- Finally, on the server run, if there is no data on the database the JSON file is read and the data is inserted to the database.
- The code that stores the data to database is in [db-init.js](./src/db-init.js) -> initData() function.