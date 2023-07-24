import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { AddProducts } from "./components/AddProducts";
import { ProductsContextProvider } from "./global/ProductsContext";
import { SignUp } from "./components/SignUp";
import { Login } from "./components/Login";
import { db, auth } from "./config/config";
import { onAuthStateChanged } from "firebase/auth";
import { where, query, collection, onSnapshot } from "firebase/firestore";
import { CartContextProvider } from "./global/CartContext";
import { Cart } from "./components/Cart";
import { Cashout } from "./components/Cashout";
import { Profile } from "./components/Profile";
import { ProductPage } from "./components/ProductPage";
import { Chat } from "./components/Chat";
import { Messages } from "./components/Messages";
import { ChatContextProvider } from "./global/ChatContext";
import { Notifications } from "./components/Notifications";
import { NotificationsContextProvider } from "./global/NotificationsContext";

export class App extends Component {
    state = {
        userName: null,
        userPhone: null,
        userId: null,
        userEmail: null,
        userImage: null,
        twitter: null,
        facebook: null,
        instagram: null,
        telegram: null,
    };

    componentDidMount() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collection(db, "SignedUpUserData"), where("Uid", "==", user.uid));
                onSnapshot(q, (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        this.setState({
                            userName: querySnapshot.docs[0].data().Name,
                            userPhone: querySnapshot.docs[0].data().Phone,
                            userId: querySnapshot.docs[0].data().Uid,
                            userEmail: querySnapshot.docs[0].data().Email,
                            userImage: querySnapshot.docs[0].data().Image,
                            twitter: querySnapshot.docs[0].data().Twitter,
                            facebook: querySnapshot.docs[0].data().Facebook,
                            instagram: querySnapshot.docs[0].data().Instagram,
                            telegram: querySnapshot.docs[0].data().Telegram,
                        });
                    }
                });
            }
        });
    }

    render() {
        return (
            <div>
                <ProductsContextProvider>
                    <CartContextProvider>
                        <ChatContextProvider>
                            <NotificationsContextProvider>
                                <BrowserRouter>
                                    <Routes>
                                        <Route exact path="/" element={<Home userName={this.state.userName} />}></Route>
                                        <Route path="/signup" element={<SignUp />}></Route>
                                        <Route path="/login" element={<Login />}></Route>
                                        <Route
                                            path="/profile"
                                            element={
                                                <Profile
                                                    userName={this.state.userName}
                                                    userPhone={this.state.userPhone}
                                                    userId={this.state.userId}
                                                    userEmail={this.state.userEmail}
                                                    userImage={this.state.userImage}
                                                    TWITTER={this.state.twitter}
                                                    FB={this.state.facebook}
                                                    IG={this.state.instagram}
                                                    TELE={this.state.telegram}
                                                />
                                            }
                                        ></Route>
                                        <Route
                                            path="/cartproducts"
                                            element={<Cart userName={this.state.userName} />}
                                        ></Route>
                                        <Route
                                            path="/addproducts"
                                            element={
                                                <AddProducts
                                                    userName={this.state.userName}
                                                    userId={this.state.userId}
                                                />
                                            }
                                        ></Route>
                                        <Route
                                            path="/cashout"
                                            element={
                                                <Cashout userName={this.state.userName} userId={this.state.userId} />
                                            }
                                        ></Route>
                                        <Route
                                            path="/productPage"
                                            element={
                                                <ProductPage
                                                    userName={this.state.userName}
                                                    userId={this.state.userId}
                                                />
                                            }
                                        ></Route>
                                        <Route
                                            path="/chat"
                                            element={
                                                <Chat
                                                    userName={this.state.userName}
                                                    userId={this.state.userId}
                                                    userImage={this.state.userImage}
                                                />
                                            }
                                        ></Route>
                                        <Route
                                            path="/messages"
                                            element={
                                                <Messages
                                                    userId={this.state.userId}
                                                    userName={this.state.userName}
                                                    userImage={this.state.userImage}
                                                />
                                            }
                                        ></Route>
                                        <Route
                                            path="/notifications"
                                            element={
                                                <Notifications
                                                    userName={this.state.userName}
                                                    userId={this.state.userId}
                                                />
                                            }
                                        ></Route>
                                    </Routes>
                                </BrowserRouter>
                            </NotificationsContextProvider>
                        </ChatContextProvider>
                    </CartContextProvider>
                </ProductsContextProvider>
            </div>
        );
    }
}

export default App;
