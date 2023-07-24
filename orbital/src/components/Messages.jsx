import React, { useContext, useEffect, useState } from "react";
import "../css/Messages.css";
import { ChatContext } from "../global/ChatContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/config";
import Icon from "react-icons-kit";
import { search } from "react-icons-kit/icomoon/search";
import { androidSend } from "react-icons-kit/ionicons/androidSend";

export const Messages = ({ userId, userName, userImage }) => {
    const { chat, users } = useContext(ChatContext);
    const [fixedChat, setFixedChat] = useState([]);
    const [filteredChat, setFilteredChat] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [currchat, setCurrChat] = useState("");
    const [recipientUid, setRecipientUid] = useState("");
    let senderUidArr = [];

    const [formValue, setFormValue] = useState("");
    const [srch, setSearch] = useState("");

    useEffect(() => {
        setFilteredChat(
            chat.reverse().filter((c) => {
                if (senderUidArr.includes(c.data().senderUid)) {
                    return false;
                } else {
                    senderUidArr.push(c.data().senderUid);
                    return true;
                }
            })
        );
        setFixedChat(chat.reverse());
        senderUidArr.length = 0;
    }, [chat]);

    const handleClick = (name, image, chat, senderUid) => {
        setShowChat(true);
        setName(name);
        setImage(image);
        setCurrChat(chat);
        setRecipientUid(senderUid);
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        await addDoc(collection(db, "Messages"), {
            text: formValue,
            createdAt: serverTimestamp(),
            senderUid: userId,
            recipientUid: recipientUid,
            senderName: userName,
        });

        setFormValue("");
    };

    return (
        <div className="messages-container">
            <div className="sidebar">
                <div className="d-flex flex-row">
                    <input type="search" placeholder="enter name" onChange={(e) => setSearch(e.target.value)} />
                    <button className="search-icon">
                        <Icon icon={search} />
                    </button>
                </div>
                {filteredChat &&
                    filteredChat
                        .filter((c) => {
                            return srch === "" ? c : c.data().senderName.toLowerCase().includes(srch);
                        })
                        .filter((c) => {
                            return c.data().recipientUid === userId;
                        })
                        .map((c) => {
                            let image;
                            let name;
                            for (let user of users) {
                                if (user.data().Uid === c.data().senderUid) {
                                    image = user.data().Image;
                                    name = user.data().Name;
                                }
                            }
                            return (
                                <div
                                    className="messages-box"
                                    onClick={() => handleClick(name, image, c, c.data().senderUid)}
                                >
                                    <img src={image} alt="" />
                                    <div className="right-box">
                                        <p>{name}</p>
                                        <p>{c.data().text}</p>
                                    </div>
                                </div>
                            );
                        })}
            </div>
            {showChat && (
                <div className="right-section">
                    <header>
                        <img src={image} alt="not found" />
                        <h3>{name}</h3>
                    </header>
                    <div className="chatbox">
                        {currchat &&
                            fixedChat
                                .filter((c) => {
                                    return (
                                        (c.data().senderUid === recipientUid && c.data().recipientUid === userId) ||
                                        (c.data().senderUid === userId && c.data().recipientUid === recipientUid)
                                    );
                                })
                                .map((msg) => (
                                    <ChatMessage
                                        key={msg.id}
                                        msg={msg.data()}
                                        sendUid={userId}
                                        recUid={recipientUid}
                                        senderImage={userImage}
                                        recipientImage={image}
                                    />
                                ))}
                    </div>
                    <form className="chat-form" onSubmit={sendMessage}>
                        <input
                            value={formValue}
                            onChange={(e) => setFormValue(e.target.value)}
                            placeholder="say something nice"
                        />

                        <button type="submit" disabled={!formValue}>
                            <Icon icon={androidSend} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

function ChatMessage({ msg, sendUid, recUid, senderImage, recipientImage }) {
    const messageClass = sendUid === msg.senderUid ? "sent" : recUid === msg.senderUid ? "received" : "";
    return (
        <>
            {messageClass && (
                <div className={`message ${messageClass}`}>
                    <img src={messageClass === "sent" ? senderImage : recipientImage} alt="not found" />
                    <p>{msg.text}</p>
                </div>
            )}
        </>
    );
}
