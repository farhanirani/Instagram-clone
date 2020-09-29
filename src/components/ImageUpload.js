import React, { useState, useContext } from "react";
import { storage, db } from ".././firebase";
import UserContext from "../context/UserContext";
import firebase from "firebase";
import "./ImageUpload.css";
import { Button, Input, makeStyles } from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  lightblue: {
    color: theme.palette.getContrastText(lightBlue[600]),
    backgroundColor: lightBlue[600],
  },
}));

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const classes = useStyles();

  // userContext hook
  const { user } = useContext(UserContext);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();

    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //   progress bar ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error
        console.log(error.message);
        alert(error.message);
      },
      () => {
        //   complete function
        // to get the downloaded link fo the image
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image in the database
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageurl: url,
              username: user.displayName,
              userid: user.uid,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <form onSubmit={handleUpload}>
      <div className="image__upload">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        <progress style={{ width: "100%" }} value={progress} max="100" />
        <Input
          required
          multiline
          type="text"
          label="Caption"
          placeholder="Caption"
          rows={2}
          style={{ width: "100%" }}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Input required type="file" onChange={handleChange} />
        <Button
          style={{ marginTop: 20 }}
          variant="contained"
          color="primary"
          className={`upload__button ${classes.lightblue}`}
          type="submit"
        >
          Upload
        </Button>
      </div>
    </form>
  );
}

export default ImageUpload;
