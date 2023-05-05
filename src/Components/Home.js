import Navbar from "./Navbar";
import Footer from "./Footer";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./home.css";

function Home() {
  const location = useLocation();
  const [alert, setAlert] = useState(null);
  const [alerterror, setError] = useState(null);

  useEffect(() => {
    if (location?.state?.error)
      setError(location?.state?.message);
    else
      setAlert(location?.state?.message);

    const timeId = setTimeout(() => {
      setAlert(null);
      setError(null);
      location.state = null;
    }, 3500);

    return () => {
      location.state = null;
      clearTimeout(timeId);
    };
  }, [location.state]);

  return (
    <div className="App">
      <Navbar />
        <div
          style={{
            "background-image": "url('back_image-2.jpg')",
            "background-repeat": "no-repeat",
            "background-attachment": "fixed",
            "background-size": "100% 100%",
            userSelect: 'none',
            padding: '3rem 0',
          }}>
          <div
            style={{
              width: "100%",
              "margin-top": "30px",
              position: "fixed",
              zIndex: "10000",
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
                  severity="success"
                  sx={{ width: "300px" }}
                  onClose={() => setAlert(null)}
                >
                  {alert}
                </Alert>
              </div>
            )}
            {alerterror && (
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
                  onClose={() => setError(null)}
                >
                  {alerterror}
                </Alert>
              </div>
            )}
          </div>
          <Grid container
            style={{
              marginTop: '3rem',
              minHeight: '70vh',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Grid item md={7}>
              <h1
                style={{
                  "font-family": "'Baloo Bhaijaan 2', cursive",
                  "font-size": "100px",
                  "color" : "black",
                  lineHeight: '100px'
                }}
                className = "colors"
              >
                Watch Party
              </h1>
              <p
                style={{
                  "font-family": "'Baloo Bhaijaan 2', cursive",
                  "font-size": "28px",
                  "color" : "black",
                }}
              >
                Best place to chill and enjoy with friends.<br /> Watch
                Youtube, Facebook videos with friends.
              </p>
            </Grid>
            <Grid item md={3} style={{
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="posters" style={{
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src="cubicles.jpg" alt="" className="img_card_1" />
                <img src="dindora.jpg" alt="" className="img_card_1" />
                <img src="aspirants.jpg" alt="" className="img_card_1" />
                <img src="kota-factory.jpg" alt="" className="img_card_1" />
              </div>
            </Grid>
          </Grid>
        </div>
      <Footer />
    </div>
  );
}

export default Home;
