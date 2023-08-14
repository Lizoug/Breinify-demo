from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import umap
import numpy as np

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