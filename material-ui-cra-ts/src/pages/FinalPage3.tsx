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
    // let IN = 
    const [info, updateInfo] = useState({image_link: "", description: "",stars: 5, title:"", time: 10, credit: "", nutrition: {Protein: 3, Carbohydrates: 3, Calories:3 , Fat: 3}, ingredients: [""], instructions: [""]});
    const [loading, setLoading] = useState(true);
    const [time, setTime] = useState(Date.now());
  
    useEffect(() => {
  
      const interval = setInterval(() => setTime(Date.now()), 1000);
      return () => {
        clearInterval(interval);
      };
    }, []);
    useEffect(() => {
      // GET request using fetch inside useEffect React hook
      fetch(backend + "/getmeal")
        .then((response) => response.json())
        .then((data) => {
          console.table(data.items);
          updateInfo(JSON.parse(JSON.stringify(data.items)))
          console.warn(JSON.parse(JSON.stringify(data.items)))
          setLoading(false);
        });
      // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);
  
  
  
    if(loading){
      return <CircularProgress/>
    }
    return (
        <div style={{ margin: "10px 20px" }}>
          <br />
    
          <Typography variant="h2"> {info.title} </Typography>
          <Stack direction="row" spacing={1}>
            {/* <Rating
              // style={{ left: "-5px", bottom: "-32px" }}
              name="read-only"
              precision={0.25}
              value={info.stars}
              readOnly
            />
            <Typography style={{ marginRight: "-200px" }}>
              {" "}
              {"     "} {info.stars}/5.0 Stars
            </Typography> */}
          </Stack>
          <Typography>
            <b>Cook Time: </b> {info.time}
          </Typography>
          <br />
          <Typography>
            {info.description}
          </Typography>
          <br />
          <img
            width="100%"
            height="180"
            style={{ objectFit: "cover" }}
            src={info.image_link}
          />
          <br />
          <hr />
          <br />
          <Paper>
            {" "}
            <Container>
              <Typography style={{ marginTop: "15px" }} variant="h4">
                Ingredients
              </Typography>
    
              <List style={{ marginLeft: "-10px" }}>
    
              {/* { ingredients.map((e) => 
                  <ListItem>{e}</ListItem>
                )}  */}
              
              </List>
            </Container>
          </Paper>
          <br />
    
          <br />
          <Container>
            <Typography style={{ marginTop: "15px" }} variant="h4">
              Instructions
            </Typography>
            { 'instructions' in info ?
                <Instructions inst={ info.instructions} />
             : <></> }
          
          </Container>
        </div>
    );
    
    
  }
  