import time
import uvicorn
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import umap
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from typing import List

# Initialize FastAPI application
app = FastAPI(
    title="Dimension Reduction Visualization API",  # Title of the API
    description="API for generating dimension reduction visualizations",  # API description
    version="1.0.0"  # Version of the API
)

# List of allowed origins for CORS
origins = [
    "http://localhost:8000",
    "http://localhost:3000"
]

# Add CORS middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of origins
    allow_credentials=True,  # Allow sending of credentials
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Function to convert a string that looks like a list into a list of floats
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
    data['day'] = data['timestamp'].dt.day

    print(data.head())
    return data

# Function to print information about the input data
def explore(input_data):
    print(f"There are {input_data.groupby('session_id').count().shape[0]} users")
    print(f"{input_data['user_id'].nunique()} users got an ID")
    print(f"There are {input_data['session_id'].nunique()} session ids")
    print(f"There are {input_data.shape[0]} rows in the dataset")

# Function to plot the count of each event type
def event_types_plot(input_data):
    event_counts = input_data['event_type'].value_counts()
    event_types = event_counts.index

    fig = plt.figure()
    ax1 = fig.add_subplot(111)
    ax1.bar(event_types, event_counts, color='b', label="test")

    plt.show()

# Function to process 'checkOut' events and combine 'embeddings' and 'timestamp'
def process_checkouts(data):
    checkouts = data[data['event_type'] == 'checkOut'].copy()
    embeddings_array = np.vstack(checkouts['embeddings'].to_numpy())

    # Convert timestamp to Unix timestamp (seconds from the epoch)
    checkouts.loc[:, 'timestamp'] = checkouts['timestamp'].apply(lambda x: x.timestamp())

    X = np.hstack((embeddings_array, checkouts[['timestamp']].to_numpy()))
    return X

# Function to save data to file
def save_data(data, algo_name, n, folder_name='reduced_data'):
    # Make sure the folder exists, if not, create it
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)

    file_path = os.path.join(folder_name, f'{algo_name}_{n}.npy')
    np.save(file_path, data)

# Function to load data from file
def load_reduction_data(algo_name, n, folder_name='reduced_data'):
    file_path = os.path.join(folder_name, f'{algo_name}_{n}.npy')
    if os.path.isfile(file_path):
        return np.load(file_path)

# Function to perform dimension reduction using PCA, UMAP or t-SNE
def dimension_reduction(input_data, algo_name="pca", n=2):
    if algo_name == "pca":
        pca = PCA(n_components=n)
        pca_result = pca.fit_transform(input_data)
        return pca_result, "pca"
    elif algo_name == 'umap':
        reducer = umap.UMAP(n_components=n)
        umap_result = reducer.fit_transform(input_data)
        return umap_result, "umap"
    elif algo_name == 'tsne':
        reducer = TSNE(n_components=n)
        tsne_result = reducer.fit_transform(input_data)
        return tsne_result, "tsne"

# Function to plot the results of dimension reduction
def plot_results(algo_results, algo_name):
    plt.scatter(algo_results[:, 0], algo_results[:, 1], c='teal', alpha=0.5)
    plt.title(f"{algo_name.upper()} of checkOut events")
    plt.xlabel(f"{algo_name.upper()} Component 1")
    plt.ylabel(f"{algo_name.upper()} Component 2")
    plt.savefig(f"{algo_name}_plot.png")

# FastAPI endpoint to choose dimension reduction algorithm and number of components
@app.get("/visualization/")
async def choose_algo(algo_name: str, n: int):
    # Load data from file if it exists
    reduced_data = load_reduction_data(algo_name, n)
    if reduced_data is not None:
        return reduced_data.tolist()

    # Otherwise, perform dimension reduction
    filename = os.path.join("raw_data/bevmo-embeddings.csv")
    input_data = load_data(filename)

    # Process checkouts
    processed_data = process_checkouts(input_data)

    # Reduce dimensions and plot the results
    reduced_data, algo_name = dimension_reduction(processed_data, algo_name, n)
    #plot_results(reduced_data, algo_name)

    # Save the reduced data to file
    save_data(reduced_data, algo_name, n)

    # Return the reduced data as a list of lists (or a list of tuples)
    return reduced_data.tolist()

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

# FastAPI endpoint to choose dimension reduction algorithm, number of components and time filters
@app.get("/visualization/time/")
async def choose_algo_time(algo_name: str, n: int, hours: List[int] = Query([0, 23]), days: List[int] = Query([0, 29]),
                           weeks: List[int] = Query([0, 51]), months: List[int] = Query([0, 11])):
    # Printing out the parameters received
    print(f"Received parameters - Hours: {hours}, Days: {days}, Weeks: {weeks}, Months: {months}")

    # Load the raw data from the specified CSV file
    filename = os.path.join("raw_data/bevmo-embeddings.csv")
    input_data = load_data(filename)
    # Print unique values in the input data for different time units
    print("Unique values:")
    print(f"Hours: {input_data['hour'].unique()}")
    print(f"Days: {input_data['day'].unique()}")
    print(f"Weeks: {input_data['week'].unique()}")
    print(f"Months: {input_data['month'].unique()}")
    start= time.time()
    # Try to load reduced data from file if it exists
    reduced_data = load_reduction_data(algo_name, n)
    print(time.time() - start)
    if reduced_data is not None:
        # If reduced data is found, generate filter and return data
        return generate_filter_and_return(input_data, reduced_data, hours, days, weeks, months)

    # If pre-computed data doesn't exist, perform dimension reduction
    processed_data = process_checkouts(input_data)
    reduced_data, algo_name = dimension_reduction(processed_data, algo_name, n)

    # Generate filter and return data
    return generate_filter_and_return(input_data, reduced_data, hours, days, weeks, months)

# Default route to confirm the API is up and running
@app.get("/")
def read_root():
    return {"message": "Dimension Reduction Visualization API"}

# Main function to run FastAPI server using uvicorn
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
