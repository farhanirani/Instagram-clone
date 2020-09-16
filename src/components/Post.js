import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import firebase from "firebase";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

function Post({ postId, user, username, caption, imageurl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
  }, [postId]);

  useEffect(() => {
    db.collection("posts")
      .doc(postId)
      .collection("likes")
      .onSnapshot((snapshot) => {
        setLikes(snapshot.docs.map((doc) => doc.data()));
      });
  }, [postId]);

  useEffect(() => {
    if (user) {
      for (var i = 0; i < likes.length; i++) {
        if (likes[i].id === user.uid) setLiked(true);
      }
    }
    // eslint-disable-next-line
  }, [likes]);

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
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setComment("");
    } else {
      alert("Please sign in first");
    }
  };

  //

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />

        <h3>{username}</h3>
      </div>

      <img className="post__image" src={imageurl} alt="" />

      <h4 className="post__text">
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
        <strong>{username}</strong> {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p key={comment.timestamp}>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="comment__box">
          <input
            className="comment__input"
            type="text"
            placeholder="Enter a comment"
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
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
