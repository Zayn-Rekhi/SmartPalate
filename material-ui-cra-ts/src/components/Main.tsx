import { Typography, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
export default function Main() {
  return (
    <div
      style={{
        backgroundImage: "url(/kitchen.png)",
        height: "100vh",
        backgroundSize: "70vh",
        margin: "-50px -20px",
        // opacity: ".2",
        zIndex: "-2",
      }}
    >
      <br></br>

      <br />
      <div style={{ margin: "70px 40px", opacity: "100%" }}>
        <Typography variant="h5">welcome to</Typography>

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
          smartpalate
        </Typography>

        <Typography>
          <i>recipes from the future</i>
        </Typography>
        <br></br>
        <br></br>
        <Button
          style={{
            fontSize: "20px",
            width: "350px",
            backgroundColor: "#2196f3",
          }}
          disableElevation
          href="/upload"
          variant="contained"
        >
          get started
        </Button>
      </div>
    </div>
  );
}
