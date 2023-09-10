import {
    Box,
    Container,
    List,
    ListItem,
    Paper,
    Rating,
    Stack,
    Typography,
    CircularProgress
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import Instructions from "../components/Instructions";
  import { backend } from "../port";
  
  export default function FinalPage() {
    const [ingredient, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imglink, setImg] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [timeto, setTime] = useState(0);
    const [stars, setStars] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [cals, setCals] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    useEffect(() => {
      // GET request using fetch inside useEffect React hook
      fetch(backend + "/getmeal")
        .then((response) => response.json())
        .then((data) => {
          console.table(data.items);
          setIngredients(data.items.ingredients)
          setImg(data.items.image_link);
          setTitle(data.items.title);
          setInstructions(data.items.instructions);
          setDescription(data.items.description);
          setLoading(false)
          setTime(data.items.time)
          setStars(data.items.stars)
          setCarbs(data.items.nutrition.Carbohydrates)
          setCals(data.items.nutrition.Calories);
          setProtein(data.items.nutrition.Protein);
          setFat(data.items.nutrition.Fat);
        });
      // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);
  
    
  
  
    if(loading){
      return <CircularProgress/>
    } else {
      
    return (

         <div style={{ margin: "10px 20px" }}>
            <br />
  
  <Typography variant="h2"> {title} </Typography>
  <Stack direction="row" spacing={1}>
    <Rating
      // style={{ left: "-5px", bottom: "-32px" }}
      name="read-only"
      precision={0.25}
      value={stars}
      readOnly
    />
    <Typography style={{ marginRight: "-200px" }}>
      {" "}
      {"     "} {stars}/5.0 Stars
    </Typography>
  </Stack>
  <Typography>
    <b>Cook Time: </b> {timeto} minutes
  </Typography>
  <br />
  <Typography>
    {description}
  </Typography>
  <br />
              <img
          width="100%"
          height="180"
          style={{ objectFit: "cover" }}
          src={imglink}
        />
        <br />
        <hr />
        <br />
      <Paper>
      <Container>
      <List>
      <Typography style={{ marginTop: "15px" }} variant="h4">
            Ingredients
          </Typography>
      {ingredient.map((user, idx) => (
        <ListItem key={idx}>{user}</ListItem>
      ))}
      </List>
      </Container>
      </Paper>
      <br />
        <Container>
          <Typography style={{ marginTop: "15px" }} variant="h4">
            Instructions
          </Typography>
      <Instructions inst={instructions}/>
           {/* {instructions.map((user, idx) => (
        <ListItem key={idx}>{user}</ListItem>
      ))}  */}
        
        </Container>
        <br/>
        <br/>
        <Paper>
          <br/>
          <Container style={{"margin": "40px 20px"}}>
        <Typography style={{ marginTop: "15px" }} variant="h4">
            Nutrition Facts
          </Typography>
          <Typography style={{ marginTop: "15px" }} variant="h6">
            Calories: {Math.round(cals*100)/100.0} cals
          </Typography>
          <Typography style={{ marginTop: "15px" }} variant="h6">
            Carbohydrates: {Math.round(carbs*100)/100.0}g
          </Typography>
          <Typography style={{ marginTop: "15px" }} variant="h6">
            Fat: {Math.round(fat*100)/100.0}g
          </Typography>
          <Typography style={{ marginTop: "15px" }} variant="h6">
            Protein: {Math.round(protein*100)/100.0}g
          </Typography>
          </Container>
          <br/>
          </Paper>
      </div>
    );
    };
  }
  