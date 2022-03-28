import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Inbox.css";
import Moralis from "moralis";
import { GET_FOLLOWERS } from "../Components/Queries";
import LoadingIndicator from "../Components/LoadingIndicator";
const Inbox = (props) => {
  const [allMails, setAllMails] = useState();
  const [updated, setUpdated] = useState();
  const [userAddress, setUserAddress] = useState();
  const subscribeToMails = async () => {
    const Mails = Moralis.Object.extend("Mails");
    let query = new Moralis.Query(Mails);
    let subscription = await query.subscribe();
    subscription.on("create", notifyOnCreate);
  };
  const notifyOnCreate = (result) => {
    setUpdated(result);
  };

  const getAllMails = async () => {
    const Mails = Moralis.Object.extend("Mails");
    let query = new Moralis.Query(Mails);
    const results = await query.find();
    console.log(results);
    setAllMails(results);
  };

  useEffect(() => {
    subscribeToMails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAllMails("");
  }, [updated]);

  useEffect(() => {
    getAllMails();
  }, [updated]);

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
        setUserAddress(account);
        return account;
      } else {
        console.log("No account available");
      }
    } catch (error) {
      console.log(error);
    }
  };
  getCurrentAccount();

  const dateConverter = (date) => {
    return date?.toISOString("MM-DD-YYYY").split("T")[0];
  };

  const convertAddressList = (addrList) => {
    const recipientAddr = addrList[0].address;
    const addr =
      recipientAddr.substring(0, 3) +
      "..." +
      recipientAddr.substring(recipientAddr.length - 3, recipientAddr.length);
    if (addrList.length > 1) {
      return addr + `, +${addrList.length - 1}`;
    } else {
      return addr;
    }
  };
  const convertAddress = (addr) => {
    return (
      addr.substring(0, 3) +
      "..." +
      addr.substring(addr.length - 3, addr.length)
    );
  };
  const renderSent = (mail) => {
    return (
      <div className="inbox--sent-mail-container">
        <div className="recipient-address">
          to: {convertAddressList(mail.get("to"))}
        </div>
        <div className="sent-date">
          on: {dateConverter(mail.get("createdAt"))}
        </div>
        <div className="sent-indicator">Sent</div>
      </div>
    );
  };
  const renderReceived = (mail) => {
    const recieverList = mail.get("to");
    var i;
    var isReciever = false;
    for (i = 0; i < recieverList.length; i++) {
      if (
        recieverList[i]["address"].toLowerCase() === userAddress.toLowerCase()
      ) {
        isReciever = true;
      }
    }
    console.log("user:", userAddress);
    console.log("reciever: ", recieverList[0]["address"]);
    if (isReciever === false) {
      return <></>;
    }
    return (
      <div className="inbox--sent-mail-container">
        <div className="recipient-address">
          from: {convertAddress(mail.get("from"))}
        </div>
        <div className="sent-date">
          on: {dateConverter(mail.get("createdAt"))}
        </div>
        <div className="received-indicator">Received</div>
      </div>
    );
  };

  return (
    <div className="inbox-container">
      <div style={{ marginBottom: "1rem" }}>Click to view details</div>
      {allMails ? (
        allMails
          .slice(0)
          .reverse()
          .map((mail, index) => (
            <Link
              to={`/view-mail${mail.id}`}
              className="mail-container"
              key={index}
            >
              {mail.get("from") === userAddress
                ? renderSent(mail)
                : renderReceived(mail, index)}
            </Link>
          ))
      ) : (
        <div className="inbox-Loading">
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
};

export default Inbox;
