import React, { useState, useEffect } from "react";
import { db, auth } from ".././firebase";

import ImageUpload from "./ImageUpload";

import "./Navbar.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";

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
}));

function Navbar({ user, username }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [opensignin, setOpensignin] = useState(false);
  const [openImageup, setOpenImageup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

    setOpen(false);
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
      <Modal open={open} onClose={() => setOpen(false)}>
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
              color="primary"
              type="submit"
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
              color="primary"
              type="submit"
              onClick={signin}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      {user && (
        <Modal open={openImageup} onClose={() => setOpenImageup(false)}>
          <div style={modalStyle} className={classes.paper}>
            <ImageUpload username={user.displayName} userid={user.uid} />
          </div>
        </Modal>
      )}

      <div className="app__header">
        <div>
          <img
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            style={{ marginTop: 10 }}
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
        </div>
        <div>
          {user ? (
            <Button
              disableElevation
              variant="contained"
              color="secondary"
              onClick={() => auth.signOut()}
            >
              Logout
            </Button>
          ) : (
            <div className="app__logincontainer">
              <Button
                disableElevation
                variant="contained"
                onClick={() => setOpen(true)}
              >
                Sign Up
              </Button>
              <Button
                disableElevation
                style={{ marginLeft: 10 }}
                variant="contained"
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
