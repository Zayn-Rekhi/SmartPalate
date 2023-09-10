import typing
from typing import *
from bayes_opt import BayesianOptimization
import json
import requests


class FoodPartNutrition:#amount of nutrition in 1 serving
    def __init__(self, nutrition):
        self.nutrition = nutrition#Dict[Nutrient_name(str), number(float)]

    def __str__(self):
        return str(self.nutrition)

class FoodInfo:
    def __init__(self):
        self.api_key = "adc3eb72488b46e5bed92bb1a32b0228"
        self.headers = {"x-api-key": self.api_key}

    def get_id(self, food_name):
        link = "https://api.spoonacular.com/food/ingredients/search?query={}&number=1".format(food_name)
        response = json.loads(requests.get(link, headers = self.headers).text)
        try:
            return response["results"][0]["id"]
        except(Exception):
            return -1

    def get_info(self, food_name, food_unit, food_quantity):

        id = self.get_id(food_name)
        if(id == -1):
            return None
        link = "https://api.spoonacular.com/food/ingredients/{0}/information?amount={1}&unit={2}".format(str(id), str(food_quantity), str(food_unit))
        response = json.loads(requests.get(link, headers = self.headers).text)
        return response

    def get_food_nutrient_info(self, food_info, nutrients_to_extract):
        to_ret = {}
        for nutrient in food_info["nutrition"]["nutrients"]:
            if nutrient["name"] in nutrients_to_extract:
                to_ret[nutrient["name"]] = (nutrient["amount"], nutrient["unit"])

        return to_ret
    

class OptimizationClass:
    def __init__(self):
        self.goals = {}#Dict[Nutrient_name, (number, allow_over, allow_under)]
        self.food_part_info = {}
    def compare(self, **args):
        total = 1
        food_total_nutrition = {} #stores the necessary nutrients(ones that are in the goal) that are in the meal
        
        for nutrient in self.goals:
            food_total_nutrition[nutrient] = 0
        for food_part_name in args:#parses all the food parts in the arguments and places their relevant info into foodtotalnutrition
            serving_quantity = float(args[food_part_name])
            for nutrient in self.food_part_info[food_part_name].nutrition:
                if(nutrient in self.goals):
                    food_total_nutrition[nutrient] += self.food_part_info[food_part_name].nutrition[nutrient]*serving_quantity
        for nutrient in self.goals:
            difference = (food_total_nutrition[nutrient]-self.goals[nutrient][0])/(self.goals[nutrient][0])
            if((difference > 0 and not(self.goals[nutrient][1])) or (difference < 0 and not(self.goals[nutrient][2]))):
                total -= abs(difference)

        distance_from_perfect = 0
        sum_of_parts = 0
        for food_part_name in args:
            sum_of_parts += args[food_part_name]
        for food_part_name in args:
            if(sum_of_parts == 0):
                break
            distance_from_perfect += abs(0.25 - args[food_part_name]/sum_of_parts)
        
        total -= distance_from_perfect
        return total
    
    def optimize(self, goals, food_parts, max_serving_sizes, n_iter = 50):
        pbounds = {}
        self.goals = goals
        self.food_part_info = food_parts

        
        for part in food_parts:
            pbounds[part] = (0.5, max_serving_sizes)
        
        optimizer = BayesianOptimization(
            f = self.compare,
            pbounds = pbounds,
            random_state = 1,
            allow_duplicate_points= True
        )
        optimizer.maximize(init_points = int(n_iter/2), n_iter = n_iter)
        return optimizer.max





def parse_food_parts(input_dict, nutrient_list):#dict into FoodPartNutrition
    f = FoodInfo()
    to_ret = {}
    for part in input_dict:
        nutrition = {}
        for nutrient in nutrient_list:
            nutrition[nutrient] = 0
        to_ret[part] = FoodPartNutrition(nutrition = nutrition)
        
        for ingredient in input_dict[part]:
            ingredient_name = ingredient
            try:
                ingredient_qty = float(input_dict[part][ingredient])
            except:
                continue
            ingredient_units = "g"
            info = f.get_info(ingredient_name, ingredient_units, ingredient_qty)
            if(info is not None):
                nutrient_info = f.get_food_nutrient_info(info, nutrient_list)
            else:
                nutrient_info = {}
            for nutrient in nutrient_info:
                to_ret[part].nutrition[nutrient] += nutrient_info[nutrient][0]
    return to_ret


# actual code running below:
def run_optimization(chatgpt_input_dict, goals = {"Protein": (20, True, False), "Calories": (300, False,True)},
        max_serving_sizes = 10, n_iter = 50):

    optimizer = OptimizationClass()
    x = parse_food_parts(chatgpt_input_dict, goals.keys())
    y = optimizer.optimize(goals = {"Protein":(50,True, False), "Calories":(800, False, True), "Fat":(10, False, True)}, food_parts = x, max_serving_sizes = max_serving_sizes, n_iter = n_iter)

    y = y["params"]
    for food_part in chatgpt_input_dict:#return new nutrition facts too
        for ingredient in chatgpt_input_dict[food_part]:
            chatgpt_input_dict[food_part][ingredient]*=y[food_part]#adjust quantities to new values
    all_tracking = {"Protein": 0, "Fat": 0, "Calories": 0, "Carbohydrates": 0}
    x = parse_food_parts(chatgpt_input_dict, all_tracking.keys())
    for part in x:
        food_nutrition = x[part]
        for nutrient in food_nutrition.nutrition:
            all_tracking[nutrient] += food_nutrition.nutrition[nutrient]

    return y, all_tracking, chatgpt_input_dict


if __name__ == "__main__":
    recipe_per_serving = { #input from ChatGPT
        "Meats": {
            "Ground beef": 28.0  # Approximately 1-2 ounces (28-56 grams)
        },
        "Veggies": {
            "Lettuce": 15.0,  # Approximately 1/4 cup of shredded lettuce
            "Tomato": 30.0,  # Approximately 1-2 slices or cherry tomato halves
            "Spinach": 15.0  # Approximately a small handful
        },
        "Sauces": {
            "Mustard": 5.0  # An approximate amount for seasoning and spreading on buns
        },
        "Carbs": {
            "Buns": 60.0,  # The weight of one small burger bun
            "Small pieces of bread": 15.0  # An approximate amount for assembling the burgers
        }
    }

    print(run_optimization(chatgpt_input_dict=recipe_per_serving, n_iter = 50))
