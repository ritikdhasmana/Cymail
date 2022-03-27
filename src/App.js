// import { useEffect, useState } from "react";
// import Moralis from "moralis";
import { memo, useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  // Routes,
  // Route,
  useRoutes,
} from "react-router-dom";

import "./app.css";
import Navbar from "./Components/Navbar";
import Compose from "./Pages/Compose";
import Inbox from "./Pages/Inbox";
import UserInfo from "./Pages/UserInfo";
import ViewMail from "./Pages/ViewMail";
const App = () => {
  const {
    authenticate,
    // isAuthenticated,
    user,
    // account,
    // logout,
  } = useMoralis();

  console.log(user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(JSON.parse(window.sessionStorage.getItem("isLoggedIn")));
    console.log("it is called");
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const login = async () => {
    await authenticate({ signingMessage: "Log in using Moralis" })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
      })
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const logOut = async () => {
    setIsLoggedIn(false);
    console.log("logged out");
  };

  // const [currentMail, setCurrentMail] = useState(false);
  // useEffect(() => {
  //   console.log("here");
  //   setCurrentMail(() => {
  //     try {
  //       return JSON.parse(window.sessionStorage.getItem("currentMail"));
  //     } catch (e) {
  //       return window.sessionStorage.getItem("currentMail");
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   window.sessionStorage.setItem("currentMail", currentMail);
  // }, [currentMail]);

  const MyRoutes = () => {
    let routes = useRoutes([
      {
        path: "/",
        element: <Inbox />,
      },
      {
        path: "/inbox",
        element: <Inbox />,
      },
      {
        path: "/compose",
        element: <Compose />,
      },
      {
        path: "/userInfo",
        element: <UserInfo />,
      },
      {
        path: "/view-mail:id",
        element: <ViewMail />,
      },
    ]);
    return routes;
  };
  console.log(isLoggedIn);
  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <Router>
            <Navbar logOut={logOut} />
            <MyRoutes />
          </Router>
        </>
      ) : (
        <>
          <div className="app--heading">
            Connect your wallet to get started!
          </div>
          <button className="cta-button connect-wallet-button" onClick={login}>
            connect wallet
          </button>
        </>
      )}
    </div>
  );
};

export default App;
