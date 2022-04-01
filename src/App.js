import { useEffect, useState } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";

import "./app.css";
import Navbar from "./Components/Navbar";
import Compose from "./Pages/Compose";
import Inbox from "./Pages/Inbox";
import ViewMail from "./Pages/ViewMail";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { ethereum } = window;
  const [userAddress, setUserAddress] = useState("");
  //fetches current ethereum address to check if we are still using the same address or not
  const getCurrentAccount = async () => {
    try {
      if (!ethereum) {
        alert("Metamask not found");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length !== 0) {
        const account = accounts[0];
        if (account !== userAddress) {
          setUserAddress(account);
          setIsLoggedIn(true);
          console.log("Account: ", userAddress);
        }
        return account;
      } else {
        console.log("No account available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userAddress && sessionStorage.getItem("address") !== userAddress) {
      console.log(userAddress);
      sessionStorage.setItem("address", userAddress);
      console.log("local storage ", sessionStorage.getItem("address"));
    }
  }, [userAddress]);

  ethereum.on("accountsChanged", function (accounts) {
    getCurrentAccount();
  });

  useEffect(() => {
    if (!userAddress && !sessionStorage.getItem("address")) {
      setIsLoggedIn(false);
    } else if (sessionStorage.getItem("address")) {
      setUserAddress(sessionStorage.getItem("address"));
      setIsLoggedIn(true);
      console.log("it is called for address", userAddress);
    }
    console.log(userAddress);
  }, []);

  const login = async () => {
    await getCurrentAccount()
      .then(function () {
        setIsLoggedIn(true);
        console.log("logged in user:", userAddress);
        console.log(userAddress);
        setIsLoggedIn(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const logOut = async () => {
    setIsLoggedIn(false);
    console.log(userAddress);
    console.log("logged out");
  };

  //setting up routes for the app
  const MyRoutes = () => {
    let routes = useRoutes([
      {
        path: "/",
        element: <Inbox address={userAddress} />,
      },
      {
        path: "/inbox",
        element: <Inbox address={userAddress} />,
      },
      {
        path: "/compose",
        element: <Compose addr={userAddress} />,
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
