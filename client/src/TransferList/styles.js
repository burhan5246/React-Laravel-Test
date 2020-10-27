import React from "react";
import { makeStyles } from "@material-ui/core/styles";

export const CustomStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    backgroundColor: "#f7f7f7c4",
    width: "700px",
    padding: "25px",
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 200,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  heading: {
    textAlign: "center",
  },
}));
