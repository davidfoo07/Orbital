import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Chat.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/config";
import { doc, addDoc, getDoc, collection, orderBy, query, serverTimestamp, onSnapshot } from "firebase/firestore";
import Icon from "react-icons-kit";
import { androidSend } from "react-icons-kit/ionicons/androidSend";

export const Chat = ({ userName, userId, userImage }) => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigate("/login");
        }
    });
    const { state } = useLocation();
    const navigate = useNavigate();
    const { uid, img } = state;
    const [senderName, setSenderName] = useState("");
    const [senderImage, setSenderImage] = useState("");
    const [recipientImage, setRecipientImage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesRef = collection(db, "Messages");

    useEffect(() => {
        if (userId) {
            const q = query(messagesRef, orderBy("createdAt"));
            onSnapshot(q, (querySnapshot) => {
                setMessages([]);
                querySnapshot.forEach((doc) => {
                    setMessages((prev) => [...prev, doc]);
                });
            });
            getDoc(doc(db, "SignedUpUserData", uid)).then((field) => {
                if (field.exists()) {
                    setSenderName(field.data().Name);
                    setSenderImage(field.data().Image);
                    setRecipientImage(img);
                }
            });
        }
    }, [userId]);

    const [formValue, setFormValue] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();

        await addDoc(messagesRef, {
            text: formValue,
            createdAt: serverTimestamp(),
            senderUid: userId,
            recipientUid: uid,
            senderName: userName,
        });

        setFormValue("");
    };

    // useEffect(() => {
    //     if (uid && userId) {
    //         getDoc(doc(db, "Messages", userId)).then((msg) => {
    //             if (msg.exists()) {
    //                 setMessage(msg.data());
    //             }
    //         });
    //         getDoc(
    //             doc(db, "SignedUpUserData", uid)).then((field) => {
    //                 if (field.exists()) {
    //                     setName(field.data().Name);
    //                     setImage(field.data().Image);
    //                 }
    //             })
    //     }
    // }, [userId, uid]);

    // const [messageClass] = auth.currentUser.uid === userId ? "sent" : "received";

    // const sendMessage = async (e) => {
    //     e.preventDefault();
    //     const docRef = doc(db, "Messages", userId);
    //     const docSnap = await getDoc(docRef);

    //     if (docSnap.exists()) {
    //         await updateDoc(docRef, {
    //             Text: formValue,
    //         });
    //     } else {
    //         await setDoc(docRef, {
    //             Text: formValue,
    //             Uid: userId,
    //             Image: userImage,
    //         });
    //     }

    //     setFormValue("");
    //     //dummy.current.scrollIntoView({ behavior: "smooth" });
    // };

    // return (
    //     <div className="Chat">
    //         <header>
    //             <img src={image} alt="" />
    //             <h3>{name}</h3>
    //         </header>
    //         <section>
    //             <div className="chatbox">
    //                 {message && (
    //                     <div className={`message ${messageClass}`}>
    //                         <p>{message.Text}</p>
    //                         <img src={message.Image} alt="not found" />
    //                     </div>
    //                 )}
    //             </div>

    //             <form className="chat-form" onSubmit={sendMessage}>
    //                 <input
    //                     value={formValue}
    //                     onChange={(e) => setFormValue(e.target.value)}
    //                     placeholder="say something nice"
    //                 />

    //                 <button type="submit" disabled={!formValue}>
    //                     🕊️
    //                 </button>
    //             </form>
    //         </section>
    //     </div>
    // );

    return (
        <div className="Chat">
            <header>
                <img src={senderImage} alt="" />
                <h3>{senderName}</h3>{" "}
            </header>
            <div className="chatbox">
                {messages &&
                    messages
                        .filter((msg) => {
                            return (
                                (msg.data().recipientUid === userId && msg.data().senderUid === uid) ||
                                (msg.data().senderUid === userId && msg.data().recipientUid === uid)
                            );
                        })
                        .map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                msg={msg.data()}
                                sendUid={userId}
                                recUid={userId}
                                senderImage={userImage}
                                recipientImage={recipientImage}
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
    );
};

function ChatMessage({ msg, sendUid, recUid, senderImage, recipientImage }) {
    const messageClass = sendUid === msg.senderUid ? "sent" : recUid === msg.recipientUid ? "received" : "";
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
