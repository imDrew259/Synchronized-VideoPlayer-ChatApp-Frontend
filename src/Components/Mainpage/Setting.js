import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import { IconButton} from "@mui/material";
import { delRoom } from "../../Api";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Dialogs } from "./Dialogs";
import { Share } from "./Share";
import Tooltip from "@mui/material/Tooltip";

const Setting = ({ room, currentuser, socket, handleCheckAdmin, reqSync }) => {
  const [loading, setloading] = useState(false);
  const [loading1, setloading1] = useState(false);
  const [open, setOpen] = useState(false);
  const [flag, setflag] = useState(false);
  const [flag1, setflag1] = useState(false);
  const [msg, setmsg] = useState("");
  const [op, setOp] = useState("");

  const handleChange = () => {
    if (currentuser.isHost) {
      setloading(true);
      socket.emit("close-room", room._id);
    } else handleCheckAdmin("Host");
  };

  const handleChange1 = () => {
    if (currentuser.isHost) {
      setloading1(true);
      socket.emit("close-room", room._id);
      delRoom(room._id);
    } else handleCheckAdmin("Host");
  };

  function ctc(data) {
    navigator.clipboard.writeText(data);
  }

  const handleChange2 = () => {
    if (currentuser.isHost) socket.emit("lock-room", room._id, !room.lock);
    else handleCheckAdmin("Host");
  };

  const handleChange3 = () => {
    setOpen(true);
    setmsg("Close");
  };

  const handleChange4 = () => {
    setOpen(true);
    setmsg("Delete");
  };
  const handleChange5 = () => {
    setOp(true);
  };
  useEffect(() => {
    if (open) handleChange();
  }, [flag]);

  useEffect(() => {
    if (open) handleChange1();
  }, [flag1]);

  return (
    <Grid container margin={1} spacing={4}>
      <Grid item sx={6}>
        Lock Room
        <Switch checked={room.lock} onClick={handleChange2} />
      </Grid>
      <Grid item sx={6}>
        Copy Link
        <Tooltip title="Copy URL">
          <IconButton onClick={() => ctc(window.location.href)}>
            <ContentCopyIcon color="info" />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item sx={12}>
        <LoadingButton color="primary" variant="contained" onClick={reqSync}>
          Request Sync
        </LoadingButton>
      </Grid>
      <Grid item sx={6}>
        <Tooltip title="Share Link">
          <LoadingButton
            loading={loading1}
            color="success"
            variant="contained"
            onClick={handleChange5}
            sx={{ width: "130px" }}
          >
            Share
          </LoadingButton>
        </Tooltip>
      </Grid>
      {currentuser.isHost ? (
        <>
          <Grid item sx={6}>
            <Tooltip title="Close Room Now">
              <LoadingButton
                loading={loading}
                color="warning"
                variant="contained"
                onClick={handleChange3}
              >
                Close Room
              </LoadingButton>
            </Tooltip>
          </Grid>
          <Grid item sx={6}>
            <Tooltip title="Delete Room Now">
              <LoadingButton
                loading={loading1}
                color="error"
                variant="contained"
                onClick={handleChange4}
              >
                Delete Room
              </LoadingButton>
            </Tooltip>
          </Grid>
        </>
      ) : (
        <> </>
      )}
      {open ? (
        <Dialogs
          open={open}
          setOpen={setOpen}
          setflag={setflag}
          setflag1={setflag1}
          msg={msg}
        />
      ) : (
        <div></div>
      )}
      {op ? <Share op={op} setOp={setOp} /> : <div></div>}
    </Grid>
  );
};

export default Setting;
