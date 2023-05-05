import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Dialogs = ({ open, setOpen, setflag, setflag1, msg }) => {
  const handleDisagree = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    msg === "Close" ? setflag(true) : setflag1(true);
  };
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDisagree}
      >
        <DialogTitle>{msg} Room</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            color="primary"
          >
            Do You Really Want To {msg === "Close" ? "Close" : "Delete"} The
            Room
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree} color="success" variant="contained">
            Disagree
          </Button>
          <Button onClick={handleAgree} color="error" variant="contained">
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
