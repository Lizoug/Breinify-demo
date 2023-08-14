import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import time

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

# Function to plot the results of dimension reduction
def plot_results(algo_results, algo_name):
    plt.scatter(algo_results[:, 0], algo_results[:, 1], c='teal', alpha=0.5)
    plt.title(f"{algo_name.upper()} of checkOut events")
    plt.xlabel(f"{algo_name.upper()} Component 1")
    plt.ylabel(f"{algo_name.upper()} Component 2")
    plt.savefig(f"{algo_name}_plot.png")