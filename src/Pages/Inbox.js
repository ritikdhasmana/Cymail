import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Inbox.css";
import Moralis from "moralis";
import LoadingIndicator from "../Components/LoadingIndicator";
import { RiDeleteBinLine } from "react-icons/ri";
const Inbox = (props) => {
  console.log(props.address);
  const [allMails, setAllMails] = useState();
  const [updated, setUpdated] = useState();
  const [deletedMails, setDeletedMails] = useState([]);
  //subscribes to mails which are being sent to the server
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
    let results = await query.find();
    console.log(results);
    setAllMails(results);
  };

  const getDeletedMails = async () => {
    const DeletedMails = Moralis.Object.extend("DeletedMails");
    let query = new Moralis.Query(DeletedMails);
    query.equalTo("userID", props.address);
    const deletedMailList = await query.find();
    console.log("deleted list", deletedMailList);
    setDeletedMails(deletedMailList);
    return deletedMailList;
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
    getDeletedMails();
  }, [updated]);

  useEffect(() => {
    getDeletedMails();
  }, [props.address]);

  const dateConverter = (date) => {
    return date?.toISOString("MM-DD-YYYY").split("T")[0];
  };

  //shortens addresses
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

  const deleteMail = async (mail) => {
    console.log("print", mail);
    if (mail) {
      const DeletedMails = Moralis.Object.extend("DeletedMails");
      let deletedMail = new DeletedMails();
      deletedMail.set("userID", props.address);
      deletedMail.set("mailID", mail.id);
      await deletedMail.save();
      setUpdated([]);
      console.log("mail Deleted: ", mail.id);
    }
  };

  //renders all the mails which were sent by user
  const renderSent = (mail) => {
    return (
      <div className="inbox--sent-mail-container">
        <div className="sent-date">
          on: {dateConverter(mail.get("createdAt"))}
        </div>
        <div className="recipient-address">
          to: {convertAddressList(mail.get("to"))}
        </div>
        <div className="sent-indicator">Sent</div>
        <div
          className="delete-button"
          onClick={(e) => {
            e.preventDefault();
            deleteMail(mail);
          }}
        >
          <RiDeleteBinLine />
        </div>
      </div>
    );
  };

  //renders mail which were recieved by users
  const renderReceived = (mail) => {
    const recieverList = mail.get("to");
    var i;
    var isReciever = false;
    for (i = 0; i < recieverList.length; i++) {
      if (
        recieverList[i]["address"].toLowerCase() === props.address.toLowerCase()
      ) {
        isReciever = true;
      }
    }
    console.log("user:", props.address);
    console.log("reciever: ", recieverList[0]["address"]);
    if (isReciever === false) {
      return <></>;
    }
    return (
      <div className="inbox--sent-mail-container">
        <div className="sent-date">
          on: {dateConverter(mail.get("createdAt"))}
        </div>
        <div className="recipient-address">
          from: {convertAddress(mail.get("from"))}
        </div>
        <div className="received-indicator">Received</div>
        <div
          className="delete-button"
          onClick={(e) => {
            e.preventDefault();
            deleteMail(mail);
          }}
        >
          <RiDeleteBinLine />
        </div>
      </div>
    );
  };

  return (
    <div className="inbox-container">
      <div style={{ marginBottom: "1rem" }}>Click to view details</div>
      {allMails ? (
        allMails
          .filter((mail) => {
            var index = deletedMails.findIndex((x) => {
              return x.get("mailID") === mail.id;
            });
            return index === -1;
          })
          .slice(0)
          .reverse()
          .map((mail, index) => (
            <Link
              to={`/view-mail${mail.id}`}
              className="mail-container"
              key={index}
            >
              {mail.get("from") === props.address
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
