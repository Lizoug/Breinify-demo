import os
import pandas as pd
import numpy as np
import time

def convert_string_to_list(_string_liste):
    liste = list()
    _string_liste = _string_liste.replace('[', '').replace(']', '')
    for item in _string_liste.split(','):
        liste.append(float(item))
    return liste

# Function to load data from a CSV file and convert string lists to actual lists
def load_data(filename):
    data = pd.read_csv(filename, encoding='utf8')
    data["embeddings"] = data["embeddings"].apply(convert_string_to_list)

    # Convert timestamp column to datetime
    data['timestamp'] = pd.to_datetime(data['timestamp'], unit='s')

    # Extract year, month, week, and hour
    data['year'] = data['timestamp'].dt.year
    data['month'] = data['timestamp'].dt.month
    data['week'] = data['timestamp'].dt.isocalendar().week
    data['hour'] = data['timestamp'].dt.hour
    data['day'] = data['timestamp'].dt.weekday

    print(data.head())
    return data


# Function to load data from file
def load_reduction_data(algo_name, n, folder_name='reduced_data'):
    file_path = os.path.join(folder_name, f'{algo_name}_{n}.npy')
    if os.path.isfile(file_path):
        return np.load(file_path)

# Function to process 'checkOut' events and combine 'embeddings' and 'timestamp'
def process_checkouts(data):
    checkouts = data[data['event_type'] == 'checkOut'].copy()
    embeddings_array = np.vstack(checkouts['embeddings'].to_numpy())

    # Convert timestamp to Unix timestamp (seconds from the epoch)
    checkouts.loc[:, 'timestamp'] = checkouts['timestamp'].apply(lambda x: x.timestamp())

    X = np.hstack((embeddings_array, checkouts[['timestamp']].to_numpy()))
    return X



# Function to generate filter and return results
def generate_filter_and_return(input_data, reduced_data, hours, days, weeks, months):
    # Convert the reduced data to a DataFrame
    reduced_df = pd.DataFrame(reduced_data, columns=[f'Component{i + 1}' for i in range(reduced_data.shape[1])])
    start = time.time()

    # Apply the filter and create a new column 'filter'
    reduced_df['filter'] = ((input_data['hour'].between(*hours)) &
                            (input_data['day'].between(*days)) &
                            (input_data['week'].between(*weeks)) &
                            (input_data['month'].between(*months))).astype(int)
    print(time.time() - start)
    return reduced_df.values.tolist()