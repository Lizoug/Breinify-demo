import os
import uvicorn
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from utils import load_data, load_reduction_data, generate_filter_and_return, process_checkouts
from dimension_reduction import dimension_reduction
import time
from typing import List

app = FastAPI(
    title="Dimension Reduction Visualization API",
    description="API for generating dimension reduction visualizations",
    version="1.0.0"
)

origins = [
    "http://localhost:8000",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FastAPI endpoint to choose dimension reduction algorithm, number of components and time filters
@app.get("/visualization/time/")
async def choose_algo_time(algo_name: str, n: int, hours: List[int] = Query([0, 23]), days: List[int] = Query([0, 6]),
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

@app.get("/")
def read_root():
    return {"message": "Dimension Reduction Visualization API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

