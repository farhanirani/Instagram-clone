import React, { useEffect, useState, useContext } from "react";
import "./Post.css";
import { db } from "../firebase";
import UserContext from "../context/UserContext";

import firebase from "firebase";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { IconButton, Avatar } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { makeStyles } from "@material-ui/core/styles";
import { lightBlue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  lightblue: {
    color: theme.palette.getContrastText(lightBlue[600]),
    backgroundColor: lightBlue[600],
  },
  small: {
    width: theme.spacing(4.2),
    height: theme.spacing(4.2),
  },
}));

function Post({
  postId,
  postCreaterId,
  postCreaterUsername,
  caption,
  imageurl,
}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const classes = useStyles();
  const [viewmore, setViewmore] = useState(false);

  // userContext hook
  // eslint-disable-next-line
  const { user, setOpensignin } = useContext(UserContext);

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
      setOpensignin(true);
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
      setOpensignin(true);
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
          className={`post__avatar ${classes.lightblue} ${classes.small}`}
          alt={postCreaterUsername}
          src="profilepic.jpg"
        />

        <h3>{postCreaterUsername}</h3>
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
                <FavoriteIcon color="secondary" onClick={likePost} />
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
            <IconButton
              disabled={!(user && user.uid === postCreaterId)}
              onClick={deletePost}
            >
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
        <strong>{postCreaterUsername}</strong> {caption}
      </div>

      {comments.length > 2 && (
        <div className="view__all" onClick={() => setViewmore(!viewmore)}>
          {viewmore ? <p> See less</p> : <p> View all comments</p>}
        </div>
      )}
      {comments.length < 3 && comments.length > 0 && (
        <div className="view__all">
          <p> Comments</p>
        </div>
      )}
      {comments.length === 0 && (
        <div className="view__all">
          <p>No comments..</p>
        </div>
      )}

      <div className="post__comments">
        {comments.slice(0, 2).map(({ id, comment }) => (
          <div key={comment.timestamp}>
            {user && user.uid === comment.commentCreaterId && (
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

            <p style={{ textAlign: "justify" }}>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          </div>
        ))}

        {viewmore &&
          comments.slice(2).map(({ id, comment }) => (
            <div key={comment.timestamp}>
              {user && user.uid === comment.commentCreaterId && (
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

              <p style={{ textAlign: "justify" }}>
                <strong>{comment.username}</strong> {comment.text}
              </p>
            </div>
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
