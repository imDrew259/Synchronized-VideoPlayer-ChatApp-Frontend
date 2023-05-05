import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import { IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Share = ({ op, setOp }) => {
  const handleDisagree = () => {
    setOp(false);
  };
const msg=window.location;
  return (
    <div>
      <Dialog
        open={op}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDisagree}
      >
        <DialogTitle> Share Link </DialogTitle>
        <DialogActions>
          <IconButton href={`whatsapp://send?text=Join this Watch Party Room ${msg}`} data-action="share/whatsapp/share" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"/>
          </IconButton>
          <IconButton href={`mailto:?subject=Invitation for Watch Party&body=${msg}`} target="_blank">
          <img src="https://img.icons8.com/fluency/48/000000/gmail-new.png"/>
          </IconButton>
          <IconButton href="https://www.instagram.com/" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/instagram-new--v2.png"/>
          </IconButton>
          <IconButton href="https://www.facebook.com/" target="_blank">
          <img src="https://img.icons8.com/fluency/48/000000/facebook-new.png"/>
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};
