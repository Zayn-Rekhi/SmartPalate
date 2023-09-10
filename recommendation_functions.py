import json, requests

from GPT_pipeline import get_description

def cnn_parse(cnn_input, other_ingredients_to_include):
    
    cnn_input = cnn_input + other_ingredients_to_include
    ingredients = ""
    for i in range(len(cnn_input)):
        if(i == len(cnn_input)-1):
            ingredients += cnn_input[i]
        else:
            ingredients = ingredients + cnn_input[i] + ","

    ingredients = ingredients.replace("_", " ")
    return ingredients, cnn_input


def get_meals(ingredients_str, ingredients_arr, meal_number = 5, **args):#make it a list of stuff as an input
    
    link = "https://api.spoonacular.com/recipes/findByIngredients"
    headers = {'x-api-key': "adc3eb72488b46e5bed92bb1a32b0228"}
    params = {"ranking": 2, "number": meal_number, "ingredients": ingredients_str}
    response = json.loads(requests.get(link, params = params, headers = headers).text)
    #print(response)
    possibleMeals = []
    for thing in response:
        #print(thing["title"])
        if(thing["missedIngredientCount"] == 0):
            possibleMeals.append(thing)

    ingredientsRet = {}
    meal_names_ret = []
    meal_ids_ret = {}
    meal_images_ret = {}
    meal_nutrition_ret = {}
    
    for meal in possibleMeals:
        meal_names_ret.append(meal["title"])
        meal_ids_ret[meal["title"]] = meal["id"]
        ingredientsRet[meal["title"]] = ""
        meal_images_ret[meal["title"]] = meal["image"]
        for ingredient in meal["usedIngredients"]:#goes thru all the ingredients like "bunch of spinach" to see which ingredients we used
            name = ingredient["name"]
            added = False
            #checks which of our inputted ingredients corresponded
            for ingredient_original in ingredients_arr:
                if(ingredient_original in name):
                    ingredientsRet[meal["title"]]+= ingredient_original + ","
                    added = True
                    break

            if(not added): 
                ingredientsRet[meal["title"]]+=name + ","
        link = "https://api.spoonacular.com/recipes/{}/information".format(meal["id"])
        meal_nutrition = json.loads(requests.get(link, headers=headers, params = {"includeNutrition":True}).text)["nutrition"]["nutrients"]

        meal_nutrition_ret[meal["title"]] = {}
        for nutrient in meal_nutrition:
            name = nutrient['name']
            if name == "Calories" or name == 'Fat' or name  == 'Carbohydrates' or name == 'Protein':
                meal_nutrition_ret[meal["title"]][name] = nutrient["amount"]
    
    return meal_names_ret, meal_ids_ret, ingredientsRet, meal_images_ret, meal_nutrition_ret

def toChatGPT(chosen_recipe_id, chosen_recipe_name, ingredients_str):#returns needed prompts
    link = "https://api.spoonacular.com/recipes/{}/information".format(chosen_recipe_id)
    headers = {'x-api-key': "adc3eb72488b46e5bed92bb1a32b0228"}
    response = json.loads(requests.get(link, headers = headers).text)
    #print("response: ")
    #print(response)
    instructions = response["instructions"]
    return ["The name of my recipe is {0}, and my recipe is: {1}. What am I making?".format(chosen_recipe_name, instructions),
            "Can you split {} into just meat, vegetable, sauce, and carb components?".format(chosen_recipe_name),
            "If my ingredients are {0}, how many of each ingredient will be used to make 1 serving of each of the components(meats, veggies, sauces, and carbs) of the {1}".format(ingredients_str, chosen_recipe_name),
            "Can you place this data into a python dictionary that includes the component(meats, veggies, sauces, and carbs), the name of the ingredient, and the exact amount of ingredient, in grams, needed per serving? It should be a dictionary with a string as a key and a dictionary, whose key is a string and whose value is an integer, as a value. Please make sure that the units for the ingredients are in grams and nothing else."]

def getMetaData(ingredients, nutrition, recipe_id):
    link = "https://api.spoonacular.com/recipes/{}/information".format(recipe_id)
    headers = {'x-api-key': "adc3eb72488b46e5bed92bb1a32b0228"}
    response = json.loads(requests.get(link, headers = headers).text)
    ingredients_arr = []
    for _, value in ingredients.items():
        for key, value in value.items():
            ingredients_arr.append(f"{str(int(value))} g "+" of "+key)
    print(ingredients_arr)
    metadata = {
        'title': response['title'],
        'image_link': response['image'],
        'time': response['readyInMinutes'],
        'credit': response['creditsText'],
        'nutrition': nutrition,
        'ingredients': ingredients_arr,
        'description': get_description(response['title'])
    }
    return metadata
