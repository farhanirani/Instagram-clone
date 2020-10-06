import React, { useState, useEffect, useContext } from "react";
import { storage, db, auth } from ".././firebase";
import firebase from "firebase";
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
  largeNocursor: {
    width: theme.spacing(18),
    height: theme.spacing(18),
    marginTop: 10,
    marginBottom: 30,
  },
}));

//

function Profile() {
  const [posts, setPosts] = useState([]);
  const { user, imageURL, setImageURL } = useContext(UserContext);
  const userId = window.location.pathname.substring(9);

  const [image, setImage] = useState(null);
  const [openPP, setOpenPP] = useState(false);

  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  const [currentPro, setCurrentPro] = useState("");

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
      const uploadTask = storage.ref(`profilepics/${user.uid}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapShot) => {
          // console.log(snapShot);
          console.log("uploading ... ");
        },
        (err) => {
          console.log(err);
        },
        () => {
          storage
            .ref("profilepics")
            .child(user.uid)
            .getDownloadURL()
            .then((url) => {
              user
                .updateProfile({
                  photoURL: url,
                })
                .then(() => {
                  setImageURL(url);
                  console.log("Updated");
                })
                .catch((err) => alert(err.message));
              setImage(null);
              setOpenPP(false);
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
        .then(() => {
          setImageURL(null);
          console.log("Updated");
        })
        .catch((err) => alert(err.message));
      setImage(null);
      setOpenPP(false);
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
          <label style={{ color: "#0095F6" }} for="uploadphoto">
            Upload Photo
          </label>
          <label style={{ color: "#F27156" }} onClick={removeImage}>
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
        {user && user.uid === userId ? (
          <div className="profile__details">
            <div className="profile__avatar">
              <Avatar
                className={`${classes.lightblue} ${classes.large}`}
                alt={user.displayName}
                src={imageURL ? imageURL : "junk.jpg"}
                onClick={() => {
                  setOpenPP(true);
                }}
              />
            </div>
            <div className="profile__info">
              <h1>{user.displayName}</h1>
            </div>
          </div>
        ) : (
          <div className="other__user__profile">
            <Avatar
              className={`${classes.lightblue} ${classes.largeNocursor}`}
              alt={userId}
              src={`https://firebasestorage.googleapis.com/v0/b/instagram-clone-react-3aadc.appspot.com/o/profilepics%2F${userId}?alt=media`}
            />
          </div>
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
          <div className="no__posts__yet">
            <h1>No posts yet</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
