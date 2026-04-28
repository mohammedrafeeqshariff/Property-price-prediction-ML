import pandas as pd

def read_file(file_path):
    return pd.read_csv(file_path)

def drop_missing(file_path):
    return pd.dropna(file_path)