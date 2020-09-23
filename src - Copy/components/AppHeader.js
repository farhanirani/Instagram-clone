import React from "react";
import { db, auth } from "../firebase";
import { Button } from "@material-ui/core";

function AppHeader({ user }) {
  return (
    <div className="app__header">
      <div>
        <img
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          style={{ marginTop: 10 }}
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
      </div>
      <div>
        {user ? (
          <Button
            disableElevation
            variant="contained"
            color="secondary"
            onClick={() => auth.signOut()}
          >
            Logout
          </Button>
        ) : (
          <div className="app__logincontainer">
            <Button
              disableElevation
              variant="contained"
              onClick={() => setOpen(true)}
            >
              Sign Up
            </Button>
            <Button
              disableElevation
              style={{ marginLeft: 10 }}
              variant="contained"
              color="primary"
              onClick={() => setOpensignin(true)}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppHeader;
