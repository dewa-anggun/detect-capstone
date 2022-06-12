from fastapi import FastAPI, Path, HTTPException, exceptions
from typing import Optional
from fastapi.param_functions import Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import os
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import ImageDataGenerator, array_to_img
from keras.preprocessing import image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Dir(BaseModel):
    Dor: str

@app.post("/Detect")
def Kirim(path: Dir):
    try:
        model_load = tf.keras.models.load_model('Model/40')
        imej = image.load_img(path.Dor, target_size=(160,160))
        x = image.img_to_array(imej)
        x = np.expand_dims(x, axis=0)
        x = x/255

        classes = model_load.predict(x)
        if classes < 0:
            classes = 'covid'
            print(classes)
        else:
            classes = 'non-covid'
            print(classes)
            
            
    except Exception as e: print(e)

    return True