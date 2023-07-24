import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export const NotificationsContext = createContext();

export const NotificationsContextProvider = (props) => {
    const [docRef, setDocRef] = useState([]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            const q = query(collection(db, "Buyer-Info"), where("ProductOwnerUid", "==", user.uid));
            onSnapshot(q, (docSnap) => {
                setDocRef([]);
                docSnap.forEach((doc) => {
                    var item = doc.data();
                    item["BuyerInfoId"] = doc.id;
                    setDocRef((prev) => [...prev, item]);
                });
            });
        });
    }, []);

    return <NotificationsContext.Provider value={{ orders: docRef }}>{props.children}</NotificationsContext.Provider>;
};
