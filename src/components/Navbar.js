import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import UserContext from "../context/UserContext";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Input, Modal } from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";

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
          <div>
            {user ? (
              <div className="app__logincontainer">
                <Button
                  variant="contained"
                  className={classes.lightblue}
                  color="primary"
                  size="small"
                  onClick={() => {
                    history.push("/profile/" + user.uid);
                  }}
                >
                  Profile
                </Button>
                <Button
                  style={{ marginLeft: 10 }}
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => auth.signOut()}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="app__logincontainer">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setOpensignup(true)}
                >
                  Sign Up
                </Button>
                <Button
                  className={classes.lightblue}
                  style={{ marginLeft: 10 }}
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
      </div>
    </>
  );
}

export default Navbar;
