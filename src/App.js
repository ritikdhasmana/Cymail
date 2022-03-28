import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";

import "./app.css";
import Navbar from "./Components/Navbar";
import Compose from "./Pages/Compose";
import Inbox from "./Pages/Inbox";
import ViewMail from "./Pages/ViewMail";

// import {
//   ApolloClient,
//   InMemoryCache,
//   ApolloProvider,
//   HttpLink,
//   from,
// } from "@apollo/client";
// import { onError } from "@apollo/client/link/error";

// const errorLink = onError(({ graphqlErrors, networkError }) => {
//   if (graphqlErrors) {
//     graphqlErrors.map(({ message, location, path }) => {
//       alert(`Graphql error $(message)`);
//       return message;
//     });
//   }
// });
// const link = from([
//   errorLink,
//   new HttpLink({ uri: "https://api.cybertino.io/connect/" }),
// ]);
// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: link,
// });

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
    // <ApolloProvider client={client}>
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
    // </ApolloProvider>
  );
};

export default App;
