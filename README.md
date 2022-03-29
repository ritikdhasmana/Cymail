# Cymail

This project is my Submission for Gitcoin's Hackathon: Grants Round 13 Hackathon
[Task 2 - Mails And Credits](https://gitcoin.co/issue/cyberconnecthq/gitcoin-gr13-hackathon/2/100028549).

### About Cymail

Cymail is an online mailing application which uses wallet address to send and fetch mails.
This app uses React and Moralis and utilizes CyberConnect's GraphQL API to fetch user details such as cyberconnect followers, following and friends and allows you to send mails using their ETH address!
You can view history of mail sent and recieved in the inbox section or write mails using rich text editor in the compose section!

Landing Page Showing highlights - [Landing Page](https://extraordinary-cat-ec8a26.netlify.app/)

Live Demo - [Cymail](https://earnest-pegasus-59a98f.netlify.app/)

#### Working
Cymail uses Moralis server to store it's data.
To run Locally you will be required to create a moralis server is add it's details manually to the project-

`const server_url = process.env.REACT_APP_SERVER_URL;`

`const app_id = process.env.REACT_APP_APP_ID;`

Each mail is a custom moralis object stored in the server database

`const Mails = Moralis.Object.extend("Mails");`

  `let mail = new Mails();`

##### Inbox

When user sends a mail it gets stored in the moralis server.
Then using moralis query we subscribe to changes happening in the database.

    `const subscribeToMails = async () => {`
 
    `const Mails = Moralis.Object.extend("Mails");`
    
    `let query = new Moralis.Query(Mails);`
    
    `let subscription = await query.subscribe();`
    
    `subscription.on("create", notifyOnCreate);`
  
    `};`
  
  It keeps track of changes happening in the server and filters out mails that were sent by user or were intended to be sent to user, after which the selected mails are shown in inbox.
  
  ##### Compose
 Input field to write mail is a rich text editor which uses react package called react-draft-wysiwyg.
 
 More details about this can be found [here](https://jpuri.github.io/react-draft-wysiwyg/#/demo)
 
 While selecting the destination addresses to deliver mail Cymail shows a list of addresses from users Cyber Connect following, follower, friends list.
 
 This is done using [CyberConnect's Api](https://docs.cyberconnect.me/docs/get_started) which uses GraphQL.
 
 Apollo client is used for GraphQL queries.
```
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
```

##### Avoid Spamming
Before sending mail, we check the mails sent by the user in past 30 days and count the number of random address to whom mail was sent by the user.

Here random accounts are accounts which aren't included in user's cyberConnect following, follower, firends list.

And if this count exceeds 30 then the user is flagged as spammer and isn't allowed to send mails anymore till this count resets to a value loewr than 30.



For now Cymail only supports sending and recieving mails using address and is only avaliable as a web app. 
