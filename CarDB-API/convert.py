import pandas as pd

data = pd.read_csv('Automobile.csv')
data['id'] = data.index + 1

data = data.astype({'model_year': 'int32', 
                    'acceleration': 'float64', 
                    'horsepower': 'float64', 
                    'mpg': 'float64', 
                    'weight': 'float64', 
                    'cylinders': 'int32', 
                    'displacement': 'float64',})

data.to_json('src/data.json', orient='records', index=False)