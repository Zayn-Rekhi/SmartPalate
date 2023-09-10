import React, { useEffect, useState } from "react";
import RecpCard from "../components/RecpCard";
import { Stack, Typography } from "@mui/material";
import { Slide } from "react-awesome-reveal";
import { backend } from "../port";

export default function RecipePage() {
  const [items, updateItems] = useState([]);

  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch(backend + "/getrecommendations")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.items);
        updateItems(data.items);
      });
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);

  return (
    <div
      style={{
        margin: "-50px -20px",
        height: "110vh",
        background:
          "linear-gradient(197deg, rgba(33,150,243,0.2) 0%, rgba(186,104,200,0.2) 100%)",
      }}
    >
      <div
        style={{
          margin: "50px 20px",
        }}
      >
        <br />
        <br />
        <Typography
          style={{
            lineHeight: "0.54",
            background: "linear-gradient(to left, #ba68c88F, #2196f38F 100%)",
            backgroundPosition: "0 100%",
            backgroundSize: "100% 10px",
            backgroundRepeat: "repeat-x",
            height: "40px",
          }}
          variant="h2"
        >
          {" "}
          recipes for you
        </Typography>
        <br />
        <br />

        <Stack>
          <Slide>
            {items.map((item, i) => (
              <>
                <RecpCard
                  image={item.image}
                  name={item.name}
                  id={item.id}
                  key={i}
                  stars={item.stars}
                  carbs={item.nutrition.Carbohydrates}
                  protein={item.nutrition.Protein}
                  fat={item.nutrition.Fat}
                  cals={item.nutrition.Calories}
                />
                <br />
              </>
            ))}
          </Slide>
        </Stack>
      </div>
    </div>
  );
}
