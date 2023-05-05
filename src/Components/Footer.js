import React from "react";
import Tooltip from '@mui/material/Tooltip';
import { Grid } from "@mui/material";

const Footer = () => {
  return (
    <div style={{ "background-color": "#17273a" }}>
      <footer style={{
        color: 'white',
        paddingTop: '3rem',
        width: '100vw'
      }}>
        <div>
          <h1
            style={{
              "font-family": "'Baloo Bhaijaan 2', cursive",
              "font-size": "60px",
            }}
          >
            Watch on any Device
          </h1>
        </div>
        <Grid container style={{ "margin-top": "20px", "margin-bottom": "20px", alignItems: 'center', justifyContent: 'space-evenly' }}>
          <Grid item margin={2}>
            <img
              src="mobile.png"
              alt="mobile"
              style={{ height: "140px" }}
            />
            <p>Mobile</p>
          </Grid>
          <Grid item margin={2}>
            <img
              src="tablet.png"
              alt="tablet"
              style={{ height: "140px" }}
            />
            <p>Tablet</p>
          </Grid>
          <Grid item margin={2}>
            <img
              src="laptop.png"
              alt="laptop"
              style={{ height: "140px" }}
            />
            <p>Laptop</p>
          </Grid>
          <Grid item margin={2}>
            <img
              src="tv.png"
              alt="TV"
              style={{ height: "140px" }}
            />
            <p>Television</p>
          </Grid>
        </Grid>
      </footer>
        <div
          style={{ padding: "5px", backgroundColor: "rgba(110, 143, 200,1)", display: 'flex', color: "white", justifyContent: 'center', alignItems: 'center' }}
        >
          &copy; 2022 Watch Party | All Rights Reserved | Terms of Service |
          Privacy | Developers &nbsp;
          <Tooltip title="Manan Kinger">
            <a
              href="https://www.linkedin.com/in/manan-kinger-997262196/"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <img
                src="https://media.licdn.com/dms/image/D4D03AQEWs017two6LA/profile-displayphoto-shrink_800_800/0/1676916848267?e=2147483647&v=beta&t=sXqHL6pa1DZ5PDSMABQzyjMRgaD9bKnitkaFaBwXICI"
                alt="Manan Kinger"
                style={{ height: "40px", borderRadius: "50%" }}
              />
            </a>
          </Tooltip>
          &nbsp;
        </div>
    </div>
  );
};

export default Footer;
