import React, { useEffect, useState, useRef } from "react";
import "./styles/Compose.css";

import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import Moralis from "moralis";
import {
  GetFollowersQuery,
  GetFollowingQuery,
  GetFriendsQuery,
} from "../Components/Queries.js";
import { useQuery } from "@apollo/client";

const Compose = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState) => {
    console.log(editorState);
    setEditorState(editorState);
  };

  const [destinationvalues, setDestinationValues] = useState([{ address: "" }]);
  const [showToast, setShowToast] = useState(false);

  const handleAddrChange = (i, e) => {
    console.log(destinationvalues[i].address);
    console.log(e);
    let newDestinationValues = [...destinationvalues];
    newDestinationValues[i]["address"] = e.target.value;
    setDestinationValues(newDestinationValues);
  };
  const addFormFields = () => {
    let newDestinationValues = [...destinationvalues, { address: "" }];
    setDestinationValues(newDestinationValues);
  };

  const removeFormFields = (i) => {
    let newDestinationValues = [...destinationvalues];
    newDestinationValues.splice(i, 1);
    setDestinationValues(newDestinationValues);
  };

  const getCurrentAccount = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Metamask not found");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Account: ", account);
        return account;
      } else {
        console.log("No account available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Mails = Moralis.Object.extend("Mails");
  let mail = new Mails();
  const sendNewMail = async () => {
    let curAddress = await getCurrentAccount();
    console.log("a", curAddress);
    const prevRandomAddrCount = await fetchPrevMails(curAddress);
    if (prevRandomAddrCount > 30) {
      alert("Cannot send mails to more than 30 random Address per month!");
      return;
    }
    if (curAddress !== props.addr) {
      alert("Address changed. Please log in Again!");
      props.setIsLoggedIn(false);
      return;
    }
    mail.set("from", curAddress);
    mail.set("to", destinationvalues);
    const metadata = {
      data: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    };
    mail.set("metadata", metadata);
    await mail.save();
    console.log("mail sent from : ", mail);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const [optionsAS, setOptionsAS] = useState([]);
  const [followersList, setFollowersList] = useState();
  const [followersCursor, setFollowersCursor] = useState(0);
  const [followersData, setFollowersData] = useState();
  const { data } = useQuery(GetFollowersQuery, {
    variables: {
      Address: props.addr,
      After: followersCursor.toString(),
    },
  });
  useEffect(() => {
    console.log("data:", data);
    if (data) {
      setFollowersData(data);
      console.log("data:", data.identity.followers.pageInfo.hasNextPage);
    }
  }, [data]);

  useEffect(() => {
    if (followersData) {
      setFollowersCursor(followersData.identity.followers.pageInfo.endCursor);
      if (followersList) {
        setFollowersList((prevFollowersList) => [
          ...prevFollowersList,
          ...followersData.identity.followers.list,
        ]);
      } else {
        setFollowersList(followersData.identity.followers.list);
      }
      setOptionsAS(() => [
        ...optionsAS,
        ...followersData.identity.followers.list,
      ]);
    }
  }, [followersData]);
  console.log("list: ", followersList);
  console.log("cursor: ", followersCursor);

  const [followingsList, setFollowingsList] = useState();
  const [followingsCursor, setFollowingsCursor] = useState(0);
  const [followingsData, setFollowingsData] = useState();
  const { data: data2 } = useQuery(GetFollowingQuery, {
    variables: {
      Address: props.addr,
      After: followingsCursor.toString(),
    },
  });
  console.log("d: ", data);
  useEffect(() => {
    console.log("data:", data2);
    if (data2) {
      setFollowingsData(data2);
      console.log("data:", data2.identity.followings.pageInfo.hasNextPage);
    }
  }, [data2]);

  useEffect(() => {
    if (followingsData) {
      setFollowingsCursor(
        followingsData.identity.followings.pageInfo.endCursor
      );
      if (followingsList) {
        setFollowingsList((prevFollowingsList) => [
          ...prevFollowingsList,
          ...followingsData.identity.followings.list,
        ]);
      } else {
        setFollowingsList(followingsData.identity.followings.list);
      }
      setOptionsAS(() => [
        ...optionsAS,
        ...followingsData.identity.followings.list,
      ]);
    }
  }, [followingsData]);

  console.log("list2: ", followingsList);
  console.log("cursor2: ", followingsCursor);

  const [friendsList, setFriendsList] = useState();
  const [friendsCursor, setFriendsCursor] = useState(0);
  const [friendsData, setFriendsData] = useState();
  const { data: data3 } = useQuery(GetFriendsQuery, {
    variables: {
      Address: props.addr,
      After: friendsCursor.toString(),
    },
  });
  useEffect(() => {
    console.log("data:", data3);
    if (data3) {
      setFriendsData(data3);
      console.log("data:", data3.identity.friends.pageInfo.hasNextPage);
    }
  }, [data3]);

  useEffect(() => {
    if (friendsData) {
      setFriendsCursor(friendsData.identity.friends.pageInfo.endCursor);
      if (friendsList) {
        setFriendsList((prevFriendsList) => [
          ...prevFriendsList,
          ...friendsData.identity.friends.list,
        ]);
      } else {
        setFriendsList(friendsData.identity.friends.list);
      }
      setOptionsAS(() => [...optionsAS, ...friendsData.identity.friends.list]);
    }
  }, [friendsData]);

  console.log("list3: ", friendsList);
  console.log("cursor3: ", friendsCursor);
  console.log(optionsAS);
  /////////////// Auto Suggestions(AS) for destinaion based on user's Cyber Connect following/follower/friends ////////////////////////////
  const [displayASiD, setDisplayASiD] = useState(-1);
  const wrapperRef = useRef(null);
  const handleASOptionCick = (i, newaddr) => {
    let newDestinationValues = [...destinationvalues];
    newDestinationValues[i]["address"] = newaddr;
    setDestinationValues(newDestinationValues);
    console.log(destinationvalues[i].address);
    setDisplayASiD(-1);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideAS);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAS);
    };
  });
  const handleClickOutsideAS = (event) => {
    const { current: wrap } = wrapperRef;
    console.log("clicked", event);
    console.log(wrap);
    if (!wrap || !wrap.contains(event.target)) {
      setDisplayASiD(-1);
    }
  };

  const fetchPrevMails = async (addr) => {
    var today = new Date();
    console.log("arr", addr);
    var priorDate = new Date(new Date().setDate(today.getDate() - 30));
    const moralisQuery = new Moralis.Query(Mails);
    moralisQuery.equalTo("from", addr.toString().toLowerCase());
    // console.log()
    moralisQuery.greaterThan("createdAt", priorDate);
    const result = await moralisQuery.find();
    console.log(result);
    var randomAddressCount = 0;
    for (let i = 0; i < result.length; i++) {
      var pastRecipients = result[i].get("to");
      for (let j = 0; j < pastRecipients.length; j++) {
        var recAddr = pastRecipients[j].address;
        if (optionsAS.findIndex((x) => x.address === recAddr) === -1)
          randomAddressCount++;
      }
    }
    console.log(randomAddressCount);
    return randomAddressCount;
  };
  return (
    <div className="Compose-container">
      <div className="editor-container">
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={onEditorStateChange}
        />
      </div>
      <div className="destination-sendbtn-container">
        <div className="destination-container">
          Add Destination
          {destinationvalues.map((address, index) => (
            <div className="InputAddressField" ref={wrapperRef} key={index}>
              <input
                type="text"
                placeholder="Enter Address"
                onClick={() =>
                  setDisplayASiD((prevDisplayASid) =>
                    prevDisplayASid === -1 ? index : -1
                  )
                }
                address="address"
                value={address.address || ""}
                onChange={(e) => handleAddrChange(index, e)}
              />
              {displayASiD === index && optionsAS.length > 0 && (
                <div className="AS-container">
                  {[
                    ...new Map(optionsAS.map((v) => [v.address, v])).values(),
                  ].map((v, i) => {
                    return (
                      <div
                        className="AS-option"
                        key={i}
                        tabIndex="0"
                        onClick={() => handleASOptionCick(index, v.address)}
                      >
                        <span>{v.domain ? v.domain : v.address} </span>
                      </div>
                    );
                  })}
                </div>
              )}
              {index ? (
                <button
                  type="button"
                  className="cta-button connect-wallet-button button remove"
                  onClick={() => removeFormFields(index)}
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
          <button
            className="cta-button connect-wallet-button button add"
            type="button"
            onClick={() => addFormFields()}
          >
            Add More
          </button>
        </div>
        <button
          className="cta-button connect-wallet-button"
          onClick={sendNewMail}
        >
          Send
        </button>
      </div>
      <div id="toast" className={showToast ? "show" : ""}>
        <div id="desc">{`Mail sent Successfully!`}</div>
      </div>
    </div>
  );
};

export default Compose;
