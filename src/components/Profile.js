import React, { useState, useEffect, useContext } from "react";
import { db } from "../firebase";
import UserContext from "../context/UserContext";
import Post from "./Post";

function Profile() {
  const [posts, setPosts] = useState([]);
  // eslint-disable-next-line
  const { user } = useContext(UserContext);
  const userId = window.location.pathname.substring(9);

  // to get the data
  useEffect(() => {
    console.log(userId);
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
  }, []);

  return (
    <div className="app__body">
      <div>
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
      <div></div>
    </div>
  );
}

export default Profile;
