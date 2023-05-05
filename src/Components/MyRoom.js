import React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { myRoom, delRoom } from "../Api/index.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingButton from '@mui/lab/LoadingButton';
import { io } from "socket.io-client";
import { baseUrl } from "../Constants/baseUrl";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import Tooltip from '@mui/material/Tooltip';


function MyRoom() {
  const [arr, setArr] = useState([]);
  const [loading, setloading] = useState(true);
  const history = useHistory();
  
  const delfun = (id) => {
    const token = Cookies.get()?.token;
    const socket = io(baseUrl, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.emit('close-room', id);
    socket.disconnect();
    delRoom(id).then((data) => {
      console.log(data);
      if (data.err) {
          console.log(data.err);
      } else {
        console.log(data.message);
        history.push({
          pathname: "/",
          state: { message: data.message },
        });
      }
    });
    setArr( arr.filter(data=> data._id !== id));
  }

  function ctc(data) {
    navigator.clipboard.writeText(data);
  }

  useEffect(() => {
    myRoom().then((res) => {
      setArr(res);
      setloading(false);
    });
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <LoadingButton
        loading={loading}
        variant="outlined"
        sx={{width:"100%"}}
      >
        <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        {loading ? "Loading" : "My rooms"}
      </Typography>
      </LoadingButton>
        
      <div
        style={{
          "max-height": "80vh",
          overflowX: "hidden",
          overflowY: "scroll",
          whitespace: "nowrap",
        }}
      >
        {arr.map((room) => {
          return (
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <Typography variant="h6" component="div">
                      {room.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={7} style={{ alignItems: "center" }}>
                    <Link to={`./room/${room._id}`}>
                      <Button size="small" variant="contained">
                        Join
                      </Button>
                    </Link>
                    <Tooltip title="Copy URL">
                    <IconButton onClick={() => ctc(window.location.href+`room/${room._id}`)}>
                        <ContentCopyIcon color='info' />
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Room">
                      <IconButton onClick={() => delfun(room._id)}>
                        <DeleteIcon color="error"/>
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}

export default MyRoom;
