import React, { useState, useEffect } from "react";
import {
  Grid,
  List,
  Card,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
  Typography,
  Box,
  TextField,
} from "@material-ui/core";
import { CustomStyles } from "./styles";
import { BASEURL } from "../utils";
import axios from "axios";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const TransferList = () => {
  const classes = CustomStyles();
  const [checked, setChecked] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  useEffect(() => {
    GetAllListItems();
  }, []);

  //   Get All itemlists
  const GetAllListItems = () => {
    axios
      .get(`${BASEURL}/items`)
      .then((response) => {
        if (response.status === 200) {
          var data = response.data;
          setLeft(data.left);
          setRight(data.right);
        }
      })
      .catch((error) => {
        alert("Someting went wrong");
      });
  };

  // Add Item in List
  const AddItem = () => {
    // If field is blank
    if (newItem === "") {
      alert("Field is required");
      return true;
    }

    // Add Items
    axios
      .post(`${BASEURL}/add`, {
        new_item: newItem,
      })
      .then((response) => {
        if (response.status === 200) {
          var data = response.data;
          setLeft(data.left);
          setRight(data.right);
          //   alert("Item added successfully");
        }
      })
      .catch((error) => {
        console.log("error", error.response.status);
        if (error.response.status === 403) {
          alert("Duplicate item not allowed");
        } else {
          alert("Someting went wrong");
        }
      });
    setNewItem("");
  };

  //   Move to item in right list
  const MovetoRight = () => {
    axios
      .post(`${BASEURL}/move_to_right`, {
        item_value: checked[0].left_item_name,
      })
      .then((response) => {
        if (response.status === 200) {
          var data = response.data;
          setLeft(data.left);
          setRight(data.right);
          //alert("Item move to right successfully");
        }
      })
      .catch((error) => {
        alert("Someting went wrong");
      });
  };

  //   Move to item in left list
  const MovetoLeft = () => {
    axios
      .post(`${BASEURL}/move_to_left`, {
        item_value: checked[0].right_item_name,
      })
      .then((response) => {
        if (response.status === 200) {
          var data = response.data;
          setLeft(data.left);
          setRight(data.right);
          // alert("Item move to left successfully");
        }
      })
      .catch((error) => {
        alert("Someting went wrong");
      });
  };

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const list = (listName, items) => (
    <Card>
      <List className={classes.list} dense component="div" role="list">
        {items
          .sort((a, b) => (a.id < b.id ? 1 : -1))
          .map((value) => {
            const labelId =
              listName === "left"
                ? value.left_item_name
                : value.right_item_name;

            return (
              <ListItem
                key={value.id}
                role="listitem"
                button
                onClick={handleToggle(value)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={
                    listName === "left"
                      ? value.left_item_name
                      : value.right_item_name
                  }
                />
              </ListItem>
            );
          })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <>
      <Grid
        container
        spacing={2}
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.heading}>
            Items Management
          </Typography>
          <Box
            component="div"
            display="flex"
            justifyContent="center"
            mb={2}
            mt={2}
          >
            <TextField
              label="Item Name"
              variant="filled"
              placeholder="Enter items name and click add button"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={AddItem}>
              Add
            </Button>
          </Box>
        </Grid>
        <Grid item>{list("left", left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
              onClick={() => MovetoRight()}
            >
              &gt;
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
              onClick={() => MovetoLeft()}
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{list("right", right)}</Grid>
      </Grid>
    </>
  );
};

export default TransferList;
