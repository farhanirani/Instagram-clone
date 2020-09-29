import React, { useState, useEffect, useContext } from "react";
import { db } from "../firebase";
import UserContext from "../context/UserContext";

import Post from "./Post";
import ImageUpload from "./ImageUpload";
import InstagramEmbeds from "./InstagramEmbeds";

import { Button, Modal, makeStyles } from "@material-ui/core";
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

function HomePage() {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [openImageup, setOpenImageup] = useState(false);

  const { user } = useContext(UserContext);

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
    <div className="app">
      {user && (
        <Modal open={openImageup} onClose={() => setOpenImageup(false)}>
          <div style={modalStyle} className={classes.paper}>
            <ImageUpload />
          </div>
        </Modal>
      )}

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
  );
}

export default HomePage;
