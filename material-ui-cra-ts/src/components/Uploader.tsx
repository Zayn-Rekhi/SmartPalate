import { Button } from "@mui/material";
import axios from "axios";
import { styled } from "@mui/material/styles";
import CameraIcon from "@mui/icons-material/Camera";
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Input = styled("input")({
  display: "none",
});
import React, { Component, useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { backend } from "../port";

export default function Uploader() {
  let navigate = useNavigate();
  const [selectedFile, updateFile] = useState(null);
  let lastSelectedFile = null;
  const makeReq = (byteString) => {
    var formData = new FormData();
    formData.append("bytes", byteString);
    axios({
      method: "post",
      url: backend + "/recommendations",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.warn("Fridge completely processed, code " + response.statusText)
        console.log(response);
        navigate("/Recipes");
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  };

  const getBase64 = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      let S = reader.result.toString();

      S = S.substr(S.indexOf(",") + 1);

      console.warn("S IS OVER HERE!!!!!!");
      console.log(S);
      console.warn("S IS OVER");

       makeReq(S);
    };
  };

  const newFile = (event) => {
    updateFile(event.target.files[0]);
  };
  const onFileUpload = () => {
    getBase64(selectedFile);
  };

  useEffect(() => {
    if (lastSelectedFile != selectedFile) {
      onFileUpload();
    }
  }, [selectedFile]);

  return (
    <Fade>
      <Container style={{ textAlign: "center" }}>
        <label htmlFor="contained-button-file">
          <Input
            accept="image/*"
            id="contained-button-file"
            multiple
            type="file"
            onChange={newFile}
          />
          <Button
            //TODO: make button bigger
            size="large" // onClick={this.onFileUpload}
            variant="outlined"
            startIcon={<CameraIcon />}
            component="span"
          >
            Scan
          </Button>
        </label>
      </Container>
    </Fade>
  );
}

/*
 var formData = new FormData();
    formData.append("bytes", S);
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/upload",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log(response);
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
*/
