import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";

export default function Instructions(props) {
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

    if(props.length <= 1){
        return (<></>)
    } else {
        return (
    <List
      sx={{
        marginLeft: "-14px",
        width: "110%",
        maxWidth: 1000,
        bgcolor: "background.paper",
      }}
    >
      {props.inst.map((value, idx) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={idx} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={handleToggle(value)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                style={{ marginLeft: "-25px" }}
                id={labelId}
                primary={value}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
  }
}
