import React from "react";
import "./styles/ViewMail.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Moralis from "moralis";
const ViewMail = (props) => {
  const params = useParams();
  const [currentMail, setCurrentMail] = useState(false);
  const [mailContent, setMailContent] = useState("");
  const mailId = params.id;
  const Mails = Moralis.Object.extend("Mails");
  const query = new Moralis.Query(Mails);

  const fetchMail = async () => {
    query.equalTo("objectId", mailId);
    const results = await query.find();
    if (results !== currentMail) {
      console.log(mailId);
      console.log(results);
      setCurrentMail(results);
      if (results[0].get("metadata"))
        setMailContent(results[0].get("metadata").data);
    }
  };
  if (currentMail === false) {
    fetchMail();
  }
  const dateConverter = (date) => {
    return date?.toISOString("MM-DD-YYYY").split("T")[0];
  };

  return currentMail ? (
    <div className="view-mail-container">
      <div className="vm-from-address-box">
        from: <span>{currentMail[0].get("from")}</span>
      </div>
      <div className="vm-to-address-box">
        to:
        {currentMail[0].get("to").map((addr, index) => (
          <div className="to-address" key={index}>
            {addr.address}
          </div>
        ))}
      </div>
      <div className="vm-date-created-box">
        on:
        <span>{dateConverter(currentMail[0].get("createdAt"))}</span>
      </div>
      <div
        className="vm-mail-content-container"
        dangerouslySetInnerHTML={{
          __html: mailContent,
        }}
      ></div>
    </div>
  ) : (
    <div>No Current Mail !</div>
  );
};

export default ViewMail;
