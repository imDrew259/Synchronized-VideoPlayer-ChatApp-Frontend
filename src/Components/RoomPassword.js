import React, { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import Input from "./Input";

import useStyles from "./styles";
import { Avatar, Grid, Paper } from "@mui/material";

const RoomPassword = ({ roomId, socket, handleOpen }) => {
  const classes = useStyles();
  const [showPassword, setshowPassword] = useState(false);
  const [password, setpassword] = useState("");
  const [processing, setprocessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setprocessing(true);
    console.log(password);
    socket.emit("new-member", roomId, password);
    return handleOpen();
  };

  const handleChange = (e) => {
      setpassword(e.target.value.replace(' ',''));
  }

  return (
    <Paper className={classes.paper} elevation={3}>
      <Avatar className={classes.avatar}>
        <VideocamIcon />
      </Avatar>
      <form
        className={classes.form}
        onSubmit={handleSubmit}
        style={{ "border-radius": "20px" }}
      >
        <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            name="password"
            label="Enter Room Password"
            type={showPassword ? "text" : "password"}
            handleShowPassword={() => setshowPassword(!showPassword)}
            handleChange={handleChange}
            required
          />
          </Grid>
          <Grid item xs={12}>
          <LoadingButton type="submit" variant='contained' loading={processing} fullWidth>
            JOIN
          </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RoomPassword;
