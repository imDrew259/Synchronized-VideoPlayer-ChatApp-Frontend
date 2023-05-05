import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import ReactPlayer from "react-player/lazy";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import { getRoom, ytSearch } from "../../Api/index.js";

import { useParams, useHistory, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { baseUrl } from "../../Constants/baseUrl";
import Alert from "@mui/material/Alert";
import {
  CardContent,
  CardMedia,
  CircularProgress,
  Fade,
  InputAdornment,
  Modal,
  Typography,
} from "@mui/material";
import Card from '@mui/material/Card';
import RoomPassword from "../RoomPassword.js";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import ClearIcon from "@mui/icons-material/Clear";
import Cookies from "js-cookie";
import Loader from '../Loader';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Chat = lazy(() => import("./Chat"));
const People = lazy(() => import("./People"));
const Setting = lazy(() => import("./Setting"));

const Room = () => {
  const token = Cookies.get()?.token;
  const socket = io(baseUrl, {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>{socket !== null ? <Mainpage socket={socket} /> : <CircularProgress />}</>
  );
};

const drawerWidth = "360";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    height: "85vh",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginRight: `${parseInt(drawerWidth) + 10}px`,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const Mainpage = ({ socket }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const { roomId } = useParams();
  const [url, seturl] = useState("");
  const [val, setval] = useState("");
  const [open, setopen] = useState(false);
  const [room, setRoom] = useState({});
  const [members, setmembers] = useState([]);
  const [message, setMessage] = useState([]);
  const [load, setload] = useState(false);
  const [load2, setload2] = useState(false);
  const [anchorEl, setanchorEl] = useState(null);
  const [mic, setmic] = useState(false);
  const [mediaRecorder, setmediaRecorder] = useState(null);
  const open3 = Boolean(anchorEl);
  const [videolist, setvideolist] = useState([]);
  const [sync, setsync] = useState([]);
  const history = useHistory();

  const [playing, setplaying] = useState(false);
  const player = useRef(null);

  const user = Cookies.get();

  if (!user?.token)
    history.push({
      pathname: '/',
      state: { message: 'You are not logged in.', error: true },
    });

  const [currentuser, setcurrentuser] = useState(null);
  const [open2, setOpen2] = useState(false);
  const handleOpen = () => setOpen2(!open2);

  const location = useLocation();

  const style = {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '325px',
    boxShadow: 24,
    p: 4,
  };

  const textfield = useRef(null);

  const chooseVideo = (vid) => {
    setval(vid.url);
    setanchorEl(null);
  };

  const handleSearch = () => {
    if (currentuser.isAdmin) {
      if (val != "") {
        setload2(true);
        ytSearch({ word: val }).then((data) => {
          setanchorEl(textfield.current);
          setvideolist(() => [...data?.videoList]);
          setload2(false);
        });
      }
    } else handleCheckAdmin("Admin");
  };

  const onchange = (e) => {
    if (currentuser.isAdmin) {
      setval(e.target.value);
    } else handleCheckAdmin("Admin");
  };

  useEffect(() => {
    setval(transcript);
  }, [transcript]);

  const toggleSidebar = () => {
    setopen(!open);
  };

  const reqSync = () => {
    let socketId = null;
    let isAdmin = false;
    let isHost = false;

    members.forEach((ele) => {
      if (ele._id != currentuser._id) {
        if (!isAdmin && !isHost) socketId = ele.socketId;

        if (ele.isAdmin && !isAdmin && !isHost) {
          isAdmin = true;
          socketId = ele.socketId;
        }

        if (ele.isHost && !isHost) {
          isHost = true;
          socketId = ele.socketId;
        }
      }
    });

    if (socketId) socket.emit("request-sync", socketId);
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [alert, setAlert] = useState(null);
  const [alerterror, setError] = useState(null);

  useEffect(async () => {
    await getRoom(roomId).then((res) => {
      setRoom(res);
      if (res.open || user._id == res.host)
        socket.emit("new-member", roomId, "");
      else setOpen2(true);
    });
  }, []);

  useEffect(() => {
    socket.on("message", (mess) => {
      setMessage((prev) => [...prev, mess]);
      var x = document.getElementById("myAudio");
      x.play();
    });

    socket.on("member-connected", (member) => {
      setcurrentuser(member.find((mem) => mem._id === user._id));
      setmembers(() => [...member]);
    });

    socket.on("error", ({ message }) => {
      location.state = "redirected";
      history.push({
        pathname: "/",
        state: { message, error: true },
      });
    });

    socket.on("room-update", (data) => {
      setRoom(data);
    });

    socket.on("url", (incurl) => {
      seturl(incurl);
      setval(incurl);
      setload(false);
    });

    socket.on("play-pause", (playin) => {
      setplaying(playin);
    });

    socket.on("request-sync", () => {
      setsync((prev) => [...prev, 1]);
    });

    socket.on("alert", (msg) => {
      setAlert(msg);
      const timeId = setTimeout(() => {
        setAlert(null);
        setError(null);
      }, 3500);
      return () => {
        clearTimeout(timeId);
      };
    });

    socket.on("seek", (data) => {
      if (data.pause) {
        player.current.seekTo(data.seek, "seconds");
        setplaying(false);
      } else setplaying(true);
    });

    socket.on("voice", (blob) => {
      var newvoice = new Blob([blob], { type: "audio/ogg; codecs=opus" });
      var audio = document.createElement("audio");
      audio.src = window.URL.createObjectURL(newvoice);
      audio.play();
    });

    socket.on("disconnect", () => {
      if (location.state != "redirected")
        history.push({
          pathname: "/",
          state: { message: "Room disconnected", error: true },
        });
    });

  }, [socket]);

  useEffect(async () => {
    sendUrl();

    setTimeout(() => {
      var currentTime = player.current.getCurrentTime();
      socket.emit("seek", {
        roomId: roomId,
        seek: currentTime,
        pause: true,
      });
    }, 3000);

    setTimeout(() => {
      playpause();
    }, 4000);
  }, [sync.length, members.length]);

  const sendUrl = () => {
    if (currentuser.isAdmin) {
      setload(true);
      socket.emit("url", { roomId, val });
    }
  };

  const pause = () => {
    if (currentuser.isAdmin) {
      var currentTime = player.current.getCurrentTime();
      socket.emit("seek", {
        roomId: roomId,
        seek: currentTime,
        pause: true,
      });
    }
  };

  const play = () => {
    if (currentuser.isAdmin) {
      socket.emit("seek", {
        roomId: roomId,
        pause: false,
      });
    }
  };

  const playpause = () => {
    socket.emit("play-pause", { playing, roomId });
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        var recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (e) => {
          socket.emit("voice", { roomId, blob: e.data });
        };

        setmediaRecorder(recorder);
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      setmediaRecorder(null);
    };
  }, []);

  useEffect(() => {
    if (mic) mediaRecorder?.start();
    else {
      if (mediaRecorder?.state != "inactive") mediaRecorder?.stop();
      setmic(false);
    }
  }, [mic]);

  function handleCheckAdmin(field) {
    setError(`You are not ${field}`);
  }

  return (
    <>
      {
        currentuser || open2 ? (
          <>
            <div className="App">
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
                      severity="info"
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
            </div>
            <Modal open={open2} closeAfterTransition>
              <Fade in={open2}>
                <Box sx={style}>
                  <RoomPassword
                    roomId={roomId}
                    socket={socket}
                    handleOpen={handleOpen}
                  />
                </Box>
              </Fade>
            </Modal>
            <Box style={{ minHeight: "100vh", minWidth: "100vw" }}>
              <Box style={{ display: "flex" }}>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  sx={{ margin: "10px 4px" }}
                >
                  {room.name}
                </Button>
                <TextField
                  placeholder={
                    currentuser?.isAdmin
                      ? "Search or Paste Video Url"
                      : "You can't change the url, contact admin if you want to"
                  }
                  size="small"
                  sx={{
                    width: "72vw",
                    margin: "10px 0px",
                    backgroundColor: "rgba(20,20,35,0.4)",
                  }}
                  variant="outlined"
                  onChange={onchange}
                  value={val}
                  aria-haspopup="true"
                  id="textfield"
                  ref={textfield}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Clear">
                          <IconButton>
                            <ClearIcon onClick={() => setval("")} />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
                <Menu
                  id="basic-menu"
                  open={open3}
                  onClose={() => setanchorEl(null)}
                  anchorEl={anchorEl}
                  MenuListProps={{
                    "aria-labelledby": "textfield",
                  }}
                  sx={{ width: "60vw", minWidth: '400px', maxWidth: "800px", maxHeight: "600px" }}
                >
                  {videolist?.map((vid) => (
                    <MenuItem key={vid.id.videoId} onClick={() => chooseVideo(vid)}>
                      <Card
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={vid.snippet.thumbnails.url}
                          alt="not found"
                          sx={{ height: "100px", width: "156px" }}
                        />
                        <CardContent>
                          <Typography variant="body2">{vid.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {vid.duration_raw}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Views: {vid.views}
                          </Typography>
                        </CardContent>
                      </Card>
                      <Divider />
                    </MenuItem>
                  ))}
                </Menu>
                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  {browserSupportsSpeechRecognition ? <Button onClick={SpeechRecognition.startListening} >
                    {listening ? (
                      <MicIcon color="primary" />
                    ) : (
                      <MicOffIcon color="disabled" />
                    )}
                  </Button> : console.log("This browser doesn't support Speech Recognition")
                  }
                  {/* <Tooltip title="YouTube Search">
                    <LoadingButton
                      sx={{ width: "5vw", margin: "10px 4px" }}
                      variant="contained"
                      color="error"
                      loading={load2}
                      aria-controls={open3 ? "basic-menu" : undefined}
                      aria-expanded={open3 ? "true" : undefined}
                      onClick={handleSearch}
                    >
                      <YouTubeIcon />
                    </LoadingButton>
                  </Tooltip> */}
                  <Tooltip title="Send URL">
                    <LoadingButton
                      onClick={sendUrl}
                      loading={load}
                      variant="contained"
                      sx={{ width: "17vw", margin: "10px 4px" }}
                    >
                      Send
                    </LoadingButton>
                  </Tooltip>

                  <Button>
                    <IconButton color="inherit" onClick={toggleSidebar}>
                      <MenuIcon />
                    </IconButton>
                  </Button>
                </Box>
              </Box>
              <Box sx={{ width: '100vw', display: { xs: 'flex', sm: 'none' }, justifyContent: 'flex-end' }} >
                {browserSupportsSpeechRecognition ? <Button onClick={SpeechRecognition.startListening} >
                  {listening ? (
                    <MicIcon color="primary" />
                  ) : (
                    <MicOffIcon color="disabled" />
                  )}
                </Button> : console.log("This browser doesn't support Speech Recognition")
                }
                {/* <Tooltip title="YouTube Search">
                  <LoadingButton
                    sx={{ width: "5vw", margin: "10px 4px" }}
                    variant="contained"
                    color="error"
                    loading={load2}
                    aria-controls={open3 ? "basic-menu" : undefined}
                    aria-expanded={open3 ? "true" : undefined}
                    onClick={handleSearch}
                  >
                    <YouTubeIcon />
                  </LoadingButton>
                </Tooltip> */}
                <Tooltip title="Send URL">
                  <LoadingButton
                    onClick={sendUrl}
                    loading={load}
                    variant="contained"
                    sx={{ width: "17vw", margin: "10px 4px" }}
                  >
                    Send
                  </LoadingButton>
                </Tooltip>

                <Button>
                  <IconButton color="inherit" onClick={toggleSidebar}>
                    <MenuIcon />
                  </IconButton>
                </Button>
              </Box>
              <Box spacing={1}>
                <Main open={open}>
                  <ReactPlayer
                    url={url}
                    height={"100%"}
                    width={"100%"}
                    playing={playing}
                    controls={true}
                    ref={player}
                    onPause={pause}
                    onPlay={play}
                    onClick={(e) => console.log("clicked", e)}
                    onStart={(e) => console.log("started", e)}
                  />
                </Main>
                <Drawer
                  sx={{
                    width: `${drawerWidth}px`,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                      overflowX: "hidden",
                      width: `${drawerWidth}px`,
                    },
                  }}
                  variant="persistent"
                  anchor="right"
                  open={open}
                >
                  <Button onClick={() => setopen(false)}>
                    <IconButton>
                      <ChevronRightIcon />
                    </IconButton>
                  </Button>
                  <div
                    style={{
                      width: "95%",
                      margin: "10px",
                      backgroundColor: "white",
                      color: "black",
                      padding: "4px",
                      fontFamily: "'Baloo Tammudu 2', cursive",
                      fontSize: "1.3em",
                      fontWeight: 1000,
                    }}
                  >
                    {user.username}
                    <Button onClick={() => setmic(!mic)}>
                      {mic ? (
                        <MicIcon color="primary" />
                      ) : (
                        <MicOffIcon color="disabled" />
                      )}
                    </Button>
                  </div>
                  <Divider />
                  <Tabs value={value} onChange={handleChange}>
                    <Tab value="1" sx={{ width: "33%" }} label="CHAT" />
                    <Tab
                      value="2"
                      sx={{ width: "33%" }}
                      label={`PEOPLE (${members.length})`}
                    />
                    <Tab value="3" sx={{ width: "33%" }} label="SETTINGS" />
                  </Tabs>
                  <Suspense fallback={<div><Loader margin /></div>}>
                    {value === "1" ? (
                      <Chat message={message} setMessage={setMessage} socket={socket} />
                    ) : value === "2" ? (
                      <People
                        members={members}
                        currentuser={currentuser}
                        socket={socket}
                      />
                    ) : (
                      <Setting
                        room={room}
                        currentuser={currentuser}
                        socket={socket}
                        reqSync={reqSync}
                        handleCheckAdmin={handleCheckAdmin}
                      />
                    )}
                  </Suspense>
                </Drawer>
              </Box>
            </Box>
            {/* <audio src={"/tone.mp3"} style={{ display: "none" }} id="myAudio"></audio> */}
          </>
        ) : <Loader margin />
      }

    </>
  );
};

export default Room;
