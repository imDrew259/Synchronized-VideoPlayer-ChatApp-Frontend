import React, { useState } from 'react';
import { Link } from "react-router-dom";
import CreateRoom from "./CreateRoom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import JoinRoom from "./JoinRoom";
import MyRoom from "./MyRoom";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import Cookies from "js-cookie";
import './navbar.css';

const Navbar = () => {
    const username = Cookies.get()?.username;

    const handleLogout = () => {
        Cookies.remove("_id");
        Cookies.remove("username");
        Cookies.remove("token");
    };

    const handleMenu = (e) => {
        if (!Boolean(anchorEl)) setanchorEl(e.currentTarget);
        else setanchorEl(null);
    };

    const [open1, setOpen1] = useState(false);
    const handleOpen1 = () => setOpen1(!open1);
    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen2(!open2);
    const [open3, setOpen3] = useState(false);
    const handleOpen3 = () => setOpen3(!open3);
    const [anchorEl, setanchorEl] = useState(null);
    const open4 = Boolean(anchorEl);
    const [nav, setnav] = useState(false);

    const style = {
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: '325px',
        boxShadow: 24,
        p: 4,
    };

    const style1 = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: '35vw',
        minWidth: '300px',
        maxWidth: '400px',
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
    };

    const navstyle = () => {
        if (nav) {
            if (username) {
                return {
                    height: '300px',
                    transition: 'all 0.5s ease-in-out'
                };
            }
            else {
                return {
                    height: '180px',
                    transition: 'all 0.5s ease-in-out'
                };
            }
        }
        else {
            return {};
        }
    }

    const temp = navstyle();

    return (
        <nav style={temp}>
            <Link className='textselectno logo' to="/">
                <img
                    src="favicon.ico"
                    alt="Watch Party"
                    style={{ height: "20px", marginRight: "3px" }}
                />
                <span style={{ color: "#0d6efd" }}>Watch</span><span style={{ color: "#9CC3D5" }}>Party</span>
            </Link>
            <div className='menuicon'>
                <IconButton onClick={() => setnav(!nav)}>
                    <MenuIcon sx={{ color: 'white' }} />
                </IconButton>
            </div>
            <ul className={nav ? 'uldisplay' : 'ulhide'}>
                {username ? (
                    <>
                        <li onClick={() => setnav(false)}>
                            <Link
                                className='link'
                                onClick={handleOpen1}
                                to="/"
                            >
                                CREATE ROOM
                            </Link>
                            <Modal
                                open={open1}
                                onClose={handleOpen1}
                                closeAfterTransition
                            >
                                <Fade in={open1}>
                                    <Box sx={style}>
                                        <CreateRoom />
                                    </Box>
                                </Fade>
                            </Modal>
                        </li>
                        <li onClick={() => setnav(false)}>
                            <Link
                                className='link'
                                onClick={handleOpen2}
                                to="/"
                            >
                                Join Room
                            </Link>
                            <Modal
                                open={open2}
                                onClose={handleOpen2}
                                closeAfterTransition
                            >
                                <Fade in={open2}>
                                    <Box sx={style1}>
                                        <JoinRoom />
                                    </Box>
                                </Fade>
                            </Modal>
                        </li>
                        <li onClick={() => setnav(false)}>
                            <Link
                                className='link'
                                onClick={handleOpen3}
                                to="/"
                            >
                                My Rooms
                            </Link>
                            <Modal
                                open={open3}
                                onClose={handleOpen3}
                                closeAfterTransition
                            >
                                <Fade in={open3}>
                                    <Box sx={style1}>
                                        <MyRoom />
                                    </Box>
                                </Fade>
                            </Modal>
                        </li>
                        <li
                            onClick={handleMenu}
                            aria-controls={open4 ? "usermenu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open4 ? "true" : undefined}
                        >
                            <Tooltip title="Your Account">
                                <Link className='link' to='/' >
                                    Hi
                                    <img
                                        alt="gif"
                                        src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif"
                                        style={{ height: "20px" }}
                                    />{" "}
                                    {username}
                                </Link>
                            </Tooltip>
                            <Menu
                                id="usermenu"
                                anchorEl={anchorEl}
                                open={open4}
                                onClose={() => setanchorEl(null)}
                                onClick={() => setanchorEl(null)}
                                PaperProps={{
                                    sx: {
                                        bgcolor: "#14273a",
                                        color: "white",
                                    },
                                }}
                            >
                                <MenuItem>
                                    <Link
                                        className='link'
                                        to={{
                                            pathname: "/changepassword",
                                            state: {
                                                message: "You are Loggedout successfully.",
                                            },
                                        }}
                                    >
                                        <VpnKeyOutlinedIcon /> Change Password
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link
                                        className='link'
                                        onClick={handleLogout}
                                        to={{
                                            pathname: "/",
                                            state: {
                                                message: "You are Loggedout successfully.",
                                            },
                                        }}
                                    >
                                        <LogoutIcon /> Logout
                                    </Link>
                                </MenuItem>
                            </Menu>
                        </li>
                    </>
                ) : (
                    <>
                        <li onClick={() => setnav(false)}>
                            <Link className='link' to="/login">
                                Login
                            </Link>
                        </li>
                        <li onClick={() => setnav(false)}>
                            <Link className='link' to="/signup">
                                Sign Up
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;