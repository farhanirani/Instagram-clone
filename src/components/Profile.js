import React, { useState, useEffect, useContext } from "react";
import { storage, db } from ".././firebase";
import UserContext from "../context/UserContext";

import Post from "./Post";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Modal } from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";
import "./Profile.css";

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
    borderRadius: 10,
    outline: "none",
  },
  lightblue: {
    color: theme.palette.getContrastText(lightBlue[600]),
    backgroundColor: lightBlue[600],
  },
  large: {
    width: theme.spacing(18),
    height: theme.spacing(18),
    marginTop: 10,
    marginBottom: 30,
    cursor: "pointer",
  },
}));

//

function Profile() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);
  const userId = window.location.pathname.substring(9);

  const [image, setImage] = useState(null);
  const [openPP, setOpenPP] = useState(false);

  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  // to get the data
  useEffect(() => {
    // console.log(userId);
    db.collection("posts")
      .where("userid", "==", userId)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
    // eslint-disable-next-line
  }, [userId]);

  // To upload the picture with just one click
  useEffect(() => {
    if (image && user) {
      const uploadTask = storage.ref(`profilepics/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapShot) => {
          console.log(snapShot);
        },
        (err) => {
          console.log(err);
        },
        () => {
          storage
            .ref("profilepics")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              user
                .updateProfile({
                  photoURL: url,
                })
                .then(() => console.log("Updated"))
                .catch((err) => alert(err.message));
              setImage(null);
              setOpenPP(false);
              window.location.reload();
            });
        }
      );
    } // eslint-disable-next-line
  }, [image]);

  const imageSelect = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const removeImage = (e) => {
    e.preventDefault();
    if (user) {
      user
        .updateProfile({
          photoURL: "",
        })
        .then(() => console.log("Updated"))
        .catch((err) => alert(err.message));
      setImage(null);
      setOpenPP(false);
      window.location.reload();
    }
  };

  return (
    <div className="app__body">
      <Modal open={openPP} onClose={() => setOpenPP(false)}>
        <div
          style={modalStyle}
          className={`${classes.paper} upload__profilepic__modal`}
        >
          <h3 style={{ fontWeight: 600 }}>Change Profile Photo</h3>
          <input
            type="file"
            id="uploadphoto"
            style={{ display: "none" }}
            onChange={imageSelect}
          />
          <label style={{ color: "blue" }} for="uploadphoto">
            Upload Photo
          </label>
          <label style={{ color: "red" }} onClick={removeImage}>
            Remove Current Photo
          </label>
          <label
            onClick={() => {
              setOpenPP(false);
            }}
          >
            Cancel
          </label>
        </div>
      </Modal>

      <div className="left__side">
        {user && user.uid === userId && (
          <Avatar
            className={`${classes.lightblue} ${classes.large}`}
            alt={user.displayName}
            src={user.photoURL ? user.photoURL : "junk.jpg"}
            onClick={() => {
              setOpenPP(true);
            }}
          />
        )}

        {posts.length ? (
          posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              postCreaterId={post.userid}
              postCreaterUsername={post.username}
              caption={post.caption}
              imageurl={post.imageurl}
            />
          ))
        ) : (
          <h1>No posts yet</h1>
        )}
      </div>
    </div>
  );
}

export default Profile;
