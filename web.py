from flask import Flask, request, jsonify

import base64
from PIL import Image
from io import BytesIO
from flask_cors import CORS

from classifier import run_model

from optimization import run_optimization
from recommendation_functions import cnn_parse, get_meals, toChatGPT, getMetaData
from GPT_pipeline import get_data

app = Flask(__name__)
cors = CORS(app)

ids = None
ingredients_dict = None
names = None
images_dict = None
meal_data = None
nutritions_dict = None

@app.route('/test')
def testRet():
    return 'hooray!'

@app.route("/recommendations", methods=["GET", "POST"])
def process_recommendations():
    sauce = request.form['bytes']
    image_data = bytes(sauce, encoding='ascii')
    img = Image.open(BytesIO(base64.b64decode(image_data))).convert('RGB')
    ingredients = run_model(img)[0]

    other_ingredients = ["spinach", "tomatoes", "hamburger buns", "ground beef", "cheese", "mustard"]
    ingredients_str, ingredients_arr = cnn_parse(cnn_input = ingredients, other_ingredients_to_include=other_ingredients)
    # print(ingredients_str)
    global ids
    global names
    global ingredients_dict
    global images_dict
    global nutritions_dict
    names, ids, ingredients_dict, images_dict, nutritions_dict = get_meals(ingredients_str, ingredients_arr)

    for meal in ingredients_dict:    
        if (not len(ingredients_dict[meal]) == 0): 
            ingredients_dict[meal] = ingredients_dict[meal][:-1]
    print(names)
    return jsonify(status=200)

@app.route("/getrecommendations", methods=["GET"])
def get_recommendations():
    data = []
    for name in names:
        id_, image, ingredients, nutrition = ids[name], images_dict[name], ingredients_dict[name], nutritions_dict[name]
        data.append({
            "name": name, 
            "id": id_,
            "image": image,
            "ingredients": ingredients,
            "nutrition": nutrition,
            "stars": 4.3,
        })
    print("ajsdflajsfljasdf")
    print(data)
    return jsonify(items=data)

@app.route("/createmeal", methods=["GET", "POST"])
def process_meal():
    chosen_name = request.form['Name']
    goals = {}

    goals["Protein"] = (request.form["Protein"], True, False)
    goals["Fat"] = (request.form["Fat"], False, True)
    goals["Carbohydrates"] = (request.form["Carbohydrates"], False, True)
    goals["Calories"] = (request.form["Calories"], False, True)


    chats = toChatGPT(ids[chosen_name], chosen_name, ingredients_dict[chosen_name])
    gpt_output = get_data(chats)

    scale_factors, new_nutrition_facts, new_ingredients = run_optimization(chatgpt_input_dict= gpt_output, goals = goals, n_iter = 150)
    
    global meal_data
    meal_data = getMetaData(new_ingredients,new_nutrition_facts, ids[chosen_name])
    
    return jsonify(status=200)

@app.route("/getmeal", methods=["GET"])
def get_mealdata():
    return jsonify(items=meal_data)

if __name__ == '__main__':
    app.run(port=5001)