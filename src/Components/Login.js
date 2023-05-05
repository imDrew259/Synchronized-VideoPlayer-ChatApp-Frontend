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
import { login } from "../Api/index";

import useStyles from "./styles";
import Cookies from "js-cookie";

const initialState = { username: "", password: "" };

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [alert, setAlert] = useState(null);
  const [showPassword, setshowPassword] = useState(false);
  const [formData, setformData] = useState(initialState);
  const [processing, setprocessing] = useState(false);

  const handleShowPassword = () => setshowPassword((e) => !e);

  const user = Cookies.get()?.username;

  if(user)
  history.push({
    pathname: '/',
    state: { message: 'You are already logged in.'}
  });

  const handleSubmit = (e) => {

    e.preventDefault();
    setprocessing(true);
    login(formData)
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
  const [passlen, setpasslen] = useState(false);

  const handleChange = (e) => {
    if (e.target.value.length > 2 && e.target.value.length < 9 && e.target.name ==="username") {
      setuserlen(false); 
      setformData({ ...formData, [e.target.name]: e.target.value.toLowerCase().replace(' ','') });
    }
    else if(e.target.name === "password" && e.target.value.length > 7  ){
      setpasslen(false);
      setformData({ ...formData, [e.target.name]: e.target.value.replace(' ','') });
    }
     else {
      e.target.name === "password" ? setpasslen(true) : setuserlen(true);
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
          <Typography variant="h5">Login</Typography>
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
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                handleShowPassword={handleShowPassword}
                handleChange={handleChange}
                required
                error={passlen}
                value={formData.password}
              />
            </Grid>
            <Box marginTop={3}>
              <LoadingButton
                type="submit"
                color="primary"
                className={classes.submit}
                loading={processing}
                variant="contained"
                fullWidth
                disabled={userlen || passlen}
              >
                Login
              </LoadingButton>
            </Box>
            <Grid container justifyContent="center">
              <Grid item>
                <Button color="secondary">
                  <Link to="/signup">Don't have an account? Sign Up</Link>
                </Button>
              </Grid>
              <Grid item>
                <Button color="secondary">
                  <Link to="/forgotpassword">Forgot Password</Link>
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
