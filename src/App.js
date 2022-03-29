import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";

import "./app.css";
import Navbar from "./Components/Navbar";
import Compose from "./Pages/Compose";
import Inbox from "./Pages/Inbox";
import ViewMail from "./Pages/ViewMail";

const App = () => {
  //Moralis
  const { authenticate, user } = useMoralis();

  console.log(user);

  //user Login Status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //storing user login status to avoid loss on reloads
  useEffect(() => {
    setIsLoggedIn(JSON.parse(window.sessionStorage.getItem("isLoggedIn")));
    console.log("it is called");
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  //login using moralis , moralis authenticates using metamask and ethereum address
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

  //setting up routes for the app
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
        element: (
          <Compose
            addr={user.get("ethAddress")}
            setIsLoggedIn={setIsLoggedIn}
          />
        ),
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
