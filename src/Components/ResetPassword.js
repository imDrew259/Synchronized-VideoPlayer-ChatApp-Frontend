import React, { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link, useHistory } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Input from "./Input";
import { Forgetpassword} from "../Api/index";
import FormHelperText from '@mui/material/FormHelperText';

import useStyles from "./styles";
import Cookies from "js-cookie";

const initialState = { username: "", email: "" };

const ResetPassword = () => {
  const classes = useStyles();
  const history = useHistory();
  const [alert, setAlert] = useState(null);
  const [formData, setformData] = useState(initialState);
  const [processing, setprocessing] = useState(false);

  const user = Cookies.get()?.username;

  if(user)
  history.push({
    pathname: '/',
    state: { message: 'You are already logged in.'}
  });

  const handleSubmit = (e) => {

    e.preventDefault();
    setprocessing(true);
    Forgetpassword(formData)
      .then((data) => {
        if (data.err) {
          setAlert(data.err.message);
          const timeId = setTimeout(() => {
            setAlert(null);
          }, 3500);

          setformData(initialState);

          setprocessing(false);

          return () => {
            clearTimeout(timeId);
          };
          
        } else {
          history.push({
            pathname: "/",
            state: { message: data.message },
          });
        }
      })
      .catch((error) => setAlert(error.message));
  };
  const [userlen, setuserlen] = useState(false);

  const handleChange = (e) => {
    if ( e.target.name ==="username" && e.target.value.length > 2 && e.target.value.length < 9) {
      setuserlen(false); 
      setformData({ ...formData, [e.target.name]: e.target.value.toLowerCase().replace(' ','') });
    }
    else if(e.target.name ==="username"){
        setuserlen(true); 
        setformData({ ...formData, [e.target.name]: e.target.value });
    }
     else{
      setformData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          "margin-top": "30px",
          position: "fixed",
          marginLeft: '43%',
          zIndex: '10000'
        }}
      >
        {alert && (
          <div
            style={{
              display: "flex",
              margin: "auto",
              "justify-content": "center",
              "align-items": "center",
              position: "absolute",
            }}
          >
            <Alert
              variant="filled"
              severity="error"
              sx={{ width: "300px" }}
              onClose={() => setAlert(null)}
            >
              {alert}
            </Alert>
          </div>
        )}
      </div>
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">Enter Details</Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Input
                name="username"
                label="UserName"
                type="text"
                handleChange={handleChange}
                required
                error={userlen}
                value={formData.username}
                autoFocus
              />
              <Input
                name="email"
                label="Email"
                type="email"
                handleChange={handleChange}
                required
                value={formData.email}
              />
            </Grid>
              <FormHelperText id="component-error-text">Reset password link will be sent to email</FormHelperText>
            <Box marginTop={3}>
              <LoadingButton
                type="submit"
                color="primary"
                className={classes.submit}
                loading={processing}
                variant="contained"
                fullWidth
                disabled={userlen}
              >
                Submit
              </LoadingButton>
            </Box>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default ResetPassword;
