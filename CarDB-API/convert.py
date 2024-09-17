import pandas as pd

data = pd.read_csv('Automobile.csv')
data['id'] = data.index + 1

data.to_json('src/data.json', orient='records', index=False)