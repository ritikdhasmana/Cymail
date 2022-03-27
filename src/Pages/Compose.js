import React, { useState } from "react";
import "./styles/Compose.css";

import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
import Moralis from "moralis";

function Compose() {
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
            <div className="InputAddressField" key={index}>
              <label className="addressfield-label">Address: </label>
              <input
                type="text"
                address="address"
                value={address.address || ""}
                onChange={(e) => handleAddrChange(index, e)}
              />
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
}

export default Compose;
