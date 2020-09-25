import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import UserContext from "../context/UserContext";

import Post from "./Post";
import ImageUpload from "./ImageUpload";
import InstagramEmbeds from "./InstagramEmbeds";

import "./MainApp.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
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

function MainApp() {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [opensignin, setOpensignin] = useState(false);
  const [openImageup, setOpenImageup] = useState(false);

  const [username, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user logged in
        // console.log(authUser);
        setUser(authUser);
      } else {
        // userlogged out
        setUser(null);
      }
      return () => {
        unsubscribe();
      };
    });
  }, [user, username]);

  // to get the data
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

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

  const uploadModalClicked = (e) => {
    // console.log(user);
    if (user && user.displayName) {
      setOpenImageup(true);
    } else {
      alert("Please Sign In first");
    }
  };

  //

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="app">
        {/*
         */}
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
                className={classes.lightblue}
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
                className={classes.lightblue}
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
              <ImageUpload />
            </div>
          </Modal>
        )}
        <div className="app__header__main">
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
                  <Button variant="contained" onClick={() => setOpen(true)}>
                    Sign Up
                  </Button>
                  <Button
                    className={classes.lightblue}
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
        </div>

        <div className="app__body">
          <div className="left__side">
            <div className="image__upload__app">
              <Button
                className={classes.lightblue}
                disableElevation
                variant="contained"
                color="primary"
                onClick={uploadModalClicked}
              >
                Post Image
              </Button>
            </div>

            {posts.map(({ id, post }) => (
              <Post
                key={id}
                postId={id}
                postCreaterId={post.userid}
                postCreaterUsername={post.username}
                caption={post.caption}
                imageurl={post.imageurl}
              />
            ))}
          </div>

          <InstagramEmbeds />
          {/*  */}
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default MainApp;
