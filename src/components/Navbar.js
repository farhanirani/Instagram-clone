import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import UserContext from "../context/UserContext";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Input,
  Modal,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";

import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import HomeIcon from "@material-ui/icons/Home";
import SendIcon from "@material-ui/icons/Send";
import FavoriteIcon from "@material-ui/icons/Favorite";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    maxWidth: "70%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: "none",
  },
  lightblue: {
    color: theme.palette.getContrastText(lightBlue[600]),
    backgroundColor: lightBlue[600],
  },
  small: {
    width: theme.spacing(3.8),
    height: theme.spacing(3.8),
    cursor: "pointer",
  },
}));

//

function Navbar() {
  const [modalStyle] = React.useState(getModalStyle);
  const [opensignup, setOpensignup] = useState(false);
  const classes = useStyles();

  const [username, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser, opensignin, setOpensignin } = useContext(UserContext);
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      return () => {
        unsubscribe();
      };
    });
    // eslint-disable-next-line
  }, [user, username]);

  const signup = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));
    setOpensignup(false);
  };

  const signin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));
    setOpensignin(false);
  };

  return (
    <>
      <Modal open={opensignup} onClose={() => setOpensignup(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
            <Input
              autoFocus={true}
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUname(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              disableElevation
              style={{ marginTop: 20 }}
              variant="contained"
              className={classes.lightblue}
              color="primary"
              type="submit"
              size="small"
              onClick={signup}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={opensignin} onClose={() => setOpensignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
            <Input
              autoFocus={true}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              disableElevation
              style={{ marginTop: 20 }}
              variant="contained"
              className={classes.lightblue}
              color="primary"
              type="submit"
              size="small"
              onClick={signin}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      {/*
       */}

      <div className="app__header__main">
        <div className="app__header">
          <div className="app__headerimage__36">
            <img
              onClick={() => {
                window.scrollTo(0, 0);
                history.push("/");
              }}
              className="app__headerImage__nav"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
          </div>

          {user ? (
            <div className="navbar__right__icons">
              <HomeIcon
                color="action"
                className={classes.small}
                onClick={() => {
                  window.scrollTo(0, 0);
                  history.push("/");
                }}
              />
              <SendIcon color="action" className={classes.small} />
              <FavoriteIcon color="action" className={classes.small} />
              <Avatar
                className={`${classes.lightblue} ${classes.small}`}
                alt={user.displayName}
                src="profilepic.jpg"
                onClick={openMenu}
              />

              <Menu
                className={classes.menu}
                elevation={5}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    history.push("/profile/" + user.uid);
                  }}
                >
                  <ListItemIcon>
                    <AccountCircleOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>

                <MenuItem>
                  <ListItemIcon>
                    <SettingsOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </MenuItem>

                <MenuItem
                  className="log__out__dropdown"
                  onClick={() => {
                    handleClose();
                    auth.signOut();
                  }}
                >
                  <ListItemText primary="Log Out" />
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <div className="navbar__right__icons">
              <HomeIcon
                color="action"
                className={classes.small}
                onClick={() => {
                  window.scrollTo(0, 0);
                  history.push("/");
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => setOpensignup(true)}
              >
                Sign Up
              </Button>
              <Button
                className={classes.lightblue}
                variant="contained"
                size="small"
                color="primary"
                onClick={() => setOpensignin(true)}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
