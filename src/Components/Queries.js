import { gql } from "@apollo/client";
export const GetFollowersQuery = gql`
  query ($Address: String!, $After: String!) {
    identity(address: $Address) {
      followers(namespace: "CyberConnect", after: $After) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        list {
          address
          domain
          avatar
        }
      }
    }
  }
`;
export const GetFollowingQuery = gql`
  query ($Address: String!, $After: String!) {
    identity(address: $Address) {
      followings(namespace: "CyberConnect", after: $After) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        list {
          address
          domain
          avatar
        }
      }
    }
  }
`;
export const GetFriendsQuery = gql`
  query ($Address: String!, $After: String!) {
    identity(address: $Address) {
      friends(namespace: "CyberConnect", after: $After) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        list {
          address
          domain
          avatar
        }
      }
    }
  }
`;
