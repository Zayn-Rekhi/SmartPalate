import torch
import base64
from PIL import Image
from io import BytesIO

names = ['apple', 'banana', 'beef', 'blueberries', 'bread', 'butter', 'carrot', 'cheese', 'chicken', 'chicken_breast', 'chocolate', 'corn', 'eggs', 'flour', 'goat_cheese', 'green_beans', 'ground_beef', 'ham', 'heavy_cream', 'lime', 'milk', 'mushrooms', 'onion', 'potato', 'shrimp', 'spinach', 'strawberries', 'sugar', 'sweet_potato', 'tomato']
model = torch.hub.load('ultralytics/yolov5', 'custom', path="best.pt", force_reload=True)


def run_model(image):
    imgs = [image]
    results = model(imgs)

    results.ims  # array of original images (as np array) passed to model for inference
    results.render()  # updates results.ims with boxes and labels

    out, ingredients = [], []
    for im in results.ims:
        buffered = BytesIO()
        im_base64 = Image.fromarray(im)
        im_base64.save(buffered, format="JPEG")
        im_base64.show()
        out.append(base64.b64encode(buffered.getvalue()).decode('utf-8'))  # base64 encoded image with results

        res = results.pandas().xyxy[0].to_json(orient='records')
        img_ing = [names[int(ingredient['class'])] for ingredient in eval(res)]
        ingredients.append(img_ing)

    return ingredients