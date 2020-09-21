import React, { useState } from "react";
import MainApp from "./components/MainApp";
// const MyContext = React.createContext(null);

function App() {
  // const [userData, setUserData] = useState(null);

  return (
    <div className="app">
      {/* <MyContext.Provider value={{ userData, setUserData }}> */}
      <MainApp />
      {/* </MyContext.Provider> */}
    </div>
  );
}

export default App;
