import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MoralisProvider } from "react-moralis";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Moralis Server
const server_url = process.env.REACT_APP_SERVER_URL;
const app_id = process.env.REACT_APP_APP_ID;

//Apollo client
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        project: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "https://api.cybertino.io/connect/",
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <MoralisProvider serverUrl={server_url} appId={app_id}>
        <App />
      </MoralisProvider>
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
