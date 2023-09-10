import React from "react";
import Uploader from "../components/Uploader";
import { Typography, Button, Container } from "@mui/material";
import CameraIcon from "@mui/icons-material/Camera";
import { Fade } from "react-awesome-reveal";

export default function UploadPage() {
  return (
    <Fade cascade>
      <div
        style={{
          margin: "-50px -20px",
          height: "110vh",
          background:
            "linear-gradient(197deg, rgba(33,150,243,0.5) 0%, rgba(186,104,200,0.5) 100%)",
        }}
      >
        <div style={{ margin: "40px" }}>
          <br /> <br />
          <br /> <br />
          <br /> <br />
          <br /> <br />
          <br /> <br />
          <br />
          <Typography variant="h2"> what's in your fridge? </Typography>
          <br />
          <br /> <br />
          <br />
          <br /> <br />
          <br />
          <br /> <br />
          <br />
          <br /> <br />
          <br />
          {/* <Container style={{ width: "100%", textAlign: "center" }}></Container> */}
          <Uploader />
        </div>
      </div>
    </Fade>
  );
}
