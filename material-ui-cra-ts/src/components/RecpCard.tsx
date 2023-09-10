import React, { useState } from "react";

import {
  Button,
  CardActions,
  Card,
  CardContent,
  Slider,
  Typography,
  CardMedia,
  Rating,
  Box,
  Grid,
  CircularProgress,
  Container,
} from "@mui/material";
import { Slide } from "react-awesome-reveal";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";
import { backend } from "../port";
export default function RecpCard(props) {
  let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [carbs, setCarbs] = useState(props.carbs);
  const [cals, setCals] = useState(props.cals);
  const [protein, setProtein] = useState(props.protein);
  const [fat, setFat] = useState(props.fat);
  const [loading, setLoading] = useState(false)

  const btnPress = () => {
    setOpen(!open);
  };
  const calculateMeal = () => {
    
    
    var formData = new FormData();
    formData.append("Carbohydrates", carbs);
    formData.append("Calories", cals);
    formData.append("Protein", protein);
    formData.append("Fat", fat);
    formData.append("Name", props.name);
    setLoading(true);
    axios({
      method: "post",
      url: backend +  "/createmeal",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log(response);
        navigate("/final");
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  };
  if(loading){
    return    <Box sx={{ display: 'flex' }}> <CircularProgress/> </Box>
  } else {
    return (
    <div>
      <Card
        sx={{
          maxHeight: open ? "2000px" : "100%",
          transition: "max-height 0.5s",
          minWidth: 275,
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <Grid xs={20} container spacing={2}>
          <Grid item xs={5}>
            <CardMedia
              height="100%"
              component="img"
              image={props.image}
              alt="Live from space album cover"
            />
          </Grid>
          <Grid item xs={6}>
            <div style={{ margin: "10px 1px" }}>
              <Typography variant="h4">{props.name}</Typography>
            </div>
            <Rating
              style={{ left: "-5px", bottom: "-32px" }}
              name="read-only"
              precision={0.5}
              value={props.stars}
              readOnly
            />
            <br />

            <Button
              onClick={btnPress}
              style={{ right: "-140px" }}
              variant="text"
            >
              Customize
            </Button>

            {/* <Typography variant="body">props.caption</Typography> */}
          </Grid>
        </Grid>
        <Container style={{ display: open ? "block" : "none" }}>
          <br />
          <Typography
            style={{ marginBottom: "-7px" }}
            id="input-slider"
            gutterBottom
          >
            Carbs: {carbs}g
          </Typography>
          <Slider
            defaultValue={carbs}
            onChange={(e, v) => {
              setCarbs(v);
            }}
            min={0}
            max={200}
            aria-label="Default"
            valueLabelDisplay="auto"
          />
          <Typography
            style={{ marginBottom: "-7px" }}
            id="input-slider"
            gutterBottom
          >
            Protein: {protein}g
          </Typography>
          <Slider
            defaultValue={protein}
            onChange={(e, v) => {
              setProtein(v);
            }}
            min={0}
            max={200}
            aria-label="Default"
            valueLabelDisplay="auto"
          />
          <Typography
            style={{ marginBottom: "-7px" }}
            id="input-slider"
            gutterBottom
          >
            Calories: {cals} cals
          </Typography>
          <Slider
            min={0}
            max={2000}
            onChange={(e, v) => {
              setCals(v);
            }}
            defaultValue={cals}
            aria-label="Default"
            valueLabelDisplay="auto"
          />
          <Typography
            style={{ marginBottom: "-7px" }}
            id="input-slider"
            gutterBottom
          >
            Fat: {fat}g
          </Typography>
          <Slider
            onChange={(e, v) => {
              setFat(v);
            }}
            min={0}
            max={200}
            defaultValue={fat}
            aria-label="Default"
            valueLabelDisplay="auto"
          />
          <Button
            onClick={calculateMeal}
            style={{ margin: "0px 0px", left: "265px" }}
            variant="text"
          >
            Calculate Meal
          </Button>
        </Container>
        {/* <Box>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            {" "}
            Bruh{" "}
          </Typography>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image="/static/images/cards/live-from-space.jpg"
          alt="Live from space album cover"
        />
        */}
      </Card>
    </div>
  );
  }
}
