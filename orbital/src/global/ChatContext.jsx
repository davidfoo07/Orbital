import { collection, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/config";
import { onAuthStateChanged } from "firebase/auth";

export const ChatContext = createContext();

export const ChatContextProvider = (props) => {
    const [senderChat, setSenderChat] = useState([]);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            // const recipientQuery = query(
            //     collection(db, "Messages"),
            //     where("recipientUid", "==", user.uid),
            //     orderBy("createdAt")
            // );

            const senderQuery = query(
                collection(db, "Messages"),
                // where("senderUid", "==", user.uid),
                orderBy("createdAt")
            );

            // const senderDoc = await getDoc(senderQuery);
            // Merge the two arrays of document snapshots
            // const mergedDocs = recipientDoc.concat(senderDoc);
            // onSnapshot(recipientQuery, (snapshot) => {
            //     setRecipientChat([]);
            //     snapshot.forEach((doc) => {
            //         setRecipientChat((prev) => [...prev, doc]);
            //     });
            // });

            onSnapshot(senderQuery, (snapshot) => {
                setSenderChat([]);
                snapshot.forEach((doc) => {
                    setSenderChat((prev) => [...prev, doc]);
                });
            });

            const q2 = query(collection(db, "SignedUpUserData"));
            onSnapshot(q2, (snapshot) => {
                setUsers([]);
                snapshot.forEach((doc) => {
                    setUsers((prev) => [...prev, doc]);
                });
            });
        });
    }, []);
    return (
        <ChatContext.Provider value={{ chat: senderChat, users: users }}>
            {props.children}
        </ChatContext.Provider>
    );
};
