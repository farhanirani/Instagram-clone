import React, { useEffect, useState } from "react";
import { storage, auth } from "./firebase";

import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
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

function App() {
  const [user, setUser] = useState(null);
  const [user2, setUser2] = useState(null);
  const [image, setImage] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    // console.log("user HAS BEEN UPDATED");
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser2(authUser);
      } else {
        setUser2(null);
      }
      return () => {
        unsubscribe();
      };
    });
  }, [user]);

  useEffect(() => {
    console.log("user2 HAS BEEN UPDATED" + user2);
    console.log(user2);
  }, [user2]);

  useEffect(() => {
    if (image && user2) {
      const uploadTask = storage.ref(`profilepics/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapShot) => {
          console.log("uploading ... ");
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
              setUser2({ ...user2, photoURL: url });
              user2
                .updateProfile({
                  photoURL: url,
                })
                .then(() => {
                  console.log("Updated");
                })
                .catch((err) => alert(err.message));
              setImage(null);
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
    if (user2) {
      setUser2({ ...user2, photoURL: null });
      user2
        .updateProfile({
          photoURL: "",
        })
        .then(() => {
          console.log("Updated");
        })
        .catch((err) => alert(err.message));
      setImage(null);
    }
  };

  return (
    <>
      {user2 && (
        <Avatar
          className={`${classes.lightblue} ${classes.large}`}
          alt={user2.displayName}
          src={user2.photoURL ? user2.photoURL : "junk.jpg"}
          onClick={() => {
            console.log(user2);
          }}
        />
      )}
      <input
        type="file"
        id="uploadphoto"
        style={{ display: "none" }}
        onChange={imageSelect}
      />
      <label style={{ color: "#0095F6" }} for="uploadphoto">
        Upload Photo
      </label>{" "}
      <br />
      <label style={{ color: "#F27156" }} onClick={removeImage}>
        Remove Current Photo
      </label>
    </>
  );
}

export default App;
