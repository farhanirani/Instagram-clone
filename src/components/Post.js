import React, { useEffect, useState } from "react";
import "./Post.css";
import { db } from "../firebase";
import firebase from "firebase";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { IconButton, Avatar } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { makeStyles } from "@material-ui/core/styles";
import { deepPurple } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  purple: {
    color: theme.palette.getContrastText(deepPurple["A700"]),
    backgroundColor: deepPurple["A700"],
  },
}));

function Post({ postId, postCreaterId, user, username, caption, imageurl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const classes = useStyles();

  // Get the comments
  useEffect(() => {
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            comment: doc.data(),
          }))
        );
      });
  }, [postId]);

  // Get the likes
  useEffect(() => {
    db.collection("posts")
      .doc(postId)
      .collection("likes")
      .onSnapshot((snapshot) => {
        setLikes(snapshot.docs.map((doc) => doc.data()));
      });
  }, [postId]);

  // Check which posts the current user has liked
  useEffect(() => {
    if (user) {
      var flag = 0;
      for (var i = 0; i < likes.length; i++) {
        if (likes[i].id === user.uid) {
          setLiked(true);
          flag = 1;
          break;
        }
      }
      if (flag === 0) {
        setLiked(false);
      }
    } else {
      setLiked(false);
    }
    // eslint-disable-next-line
  }, [likes, user]);

  const likePost = async (e) => {
    e.preventDefault();
    if (user && user.displayName) {
      if (liked) {
        var query = db
          .collection("posts")
          .doc(postId)
          .collection("likes")
          .where("id", "==", user.uid);
        query.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });
        setLiked(false);
      } else {
        db.collection("posts").doc(postId).collection("likes").add({
          id: user.uid,
        });

        setLiked(true);
      }
    } else {
      alert("Please login first");
    }
  };

  const postComment = (e) => {
    e.preventDefault();
    if (user && user.displayName && comment.length) {
      db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: user.displayName,
        commentCreaterId: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setComment("");
    } else {
      alert("Please sign in first");
    }
  };

  const deletePost = (e) => {
    e.preventDefault();
    if (user.uid === postCreaterId) {
      db.collection("posts").doc(postId).delete();
    } else {
      alert("Not authorized!!!");
    }
  };

  const deleteComment = async (commentid, commentpassed) => {
    if (user && user.uid === commentpassed.commentCreaterId) {
      db.collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentid)
        .delete();
    } else {
      alert("Not authorized!!!");
    }
  };

  //

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className={`post__avatar ${classes.purple}`}
          alt={username}
          src="/static/images/avatar/1.jpg"
        />

        <h3>{username}</h3>
      </div>

      <img
        onDoubleClick={likePost}
        className="post__image"
        src={imageurl}
        alt=""
      />

      <div className="post__text">
        <div className="post__likes__delete">
          <div className="post__likes">
            <div className="like__logo">
              {liked ? (
                <FavoriteIcon onClick={likePost} />
              ) : (
                <FavoriteBorderIcon onClick={likePost} />
              )}
            </div>

            {likes.length === 1 ? (
              <strong>{likes.length} like</strong>
            ) : (
              <strong>{likes.length} likes</strong>
            )}
          </div>
          <div className="post__likes__right">
            <IconButton onClick={deletePost}>
              <DeleteIcon
                style={
                  user && user.uid === postCreaterId
                    ? { visibility: "visible" }
                    : { visibility: "hidden" }
                }
                color="secondary"
              />
            </IconButton>
          </div>
        </div>
        <strong>{username}</strong> {caption}
      </div>

      <div className="post__comments">
        {comments.map(({ id, comment }) => (
          <>
            {user.uid === comment.commentCreaterId && (
              <DeleteOutlineIcon
                fontSize="small"
                style={{
                  cursor: "pointer",
                  float: "right",
                }}
                onClick={() => {
                  deleteComment(id, comment);
                }}
              />
            )}

            <p style={{ textAlign: "justify" }} key={comment.timestamp}>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          </>
        ))}
      </div>

      {user && (
        <form className="comment__box">
          <input
            className="comment__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <button
            disabled={!comment.length}
            className="comment__button"
            type="submit"
            onClick={postComment}
          >
            <strong>Post</strong>
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
