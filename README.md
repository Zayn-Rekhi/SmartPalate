## Inspiration
One day Saaz was sitting at home thinking about his fitness goals. He wanted to eat a meal that had 60 grams of protein while staying under 800 calories. He looked in his fridge and had no idea what to make he realized, what if he could use the leftover ingredients and cook a tasty meal that stayed in his nutrition goals.

## What it does
SmartPalate allows you to scan your fridge and pantry, it then uses AI to detect all the items you have and come up with an ingredient list and recipe based on what you have. The user can then customize the nutrition information such as amount of protein and carbs with a slider which dynamically alters the recipe.

## How we built it
We used Yolov5 to detect different food items in the fridge. We then fed this list of ingredient into a webscrapper that matches the ingredients to feasable recipes. We then used a modified language model to split the ingredients into 4 distinct parts, meats, carbs, flavoring, veggies. Nutrition information can be customized by the user with a slider, behind the scenes a Bayesian optimizer adjusts the quantities of each food group. All this interacts cleanly with a front end built with a react typescript stack through flask.

## Challenges we ran into
One of the biggest challenges was identifying the subgroups in every meal. After trying multiple methods such as clustering we settled on an approach that uses state of the art language model to identify the groups.

## Accomplishments that we're proud of
We are especially proud of the fact that you can scan your fridge with your phone instead of typing in individual items, allowing for a much easier user experience. Additionally we are proud of the fact that the user can adjust different nutrition facts on your recipe which makes your recipe truly custom to your health goals while not compromising taste. 

## What we learned
NLP is hard

## What's next for SmartPalate
We plan to allow users to rate and review different recipes. Additionally we would like to add a social component to SmartPalata that allows people to share their custom recipes.

