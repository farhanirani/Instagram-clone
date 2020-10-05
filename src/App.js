import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UserContext from "./context/UserContext";
import "./App.css";

import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";

function App() {
  const [user, setUser] = useState(null);
  const [opensignin, setOpensignin] = useState(false);
  const [openImageup, setOpenImageup] = useState(false);
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    if (user) setImageURL(user.photoURL);
    else setImageURL("");
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        opensignin,
        setOpensignin,
        openImageup,
        setOpenImageup,
        imageURL,
        setImageURL,
      }}
    >
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/profile" component={Profile} />
          {/* <Route exact path="/messages" component={Messages} />  */}
        </Switch>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
