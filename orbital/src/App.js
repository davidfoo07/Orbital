import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { AddProducts } from "./components/AddProducts";
import { ProductsContextProvider } from "./global/ProductsContext";
import { SignUp } from "./components/SignUp";
import { Login } from "./components/Login";
import { db, auth } from "./config/config";
import { onAuthStateChanged } from "firebase/auth";
import { where, query, getDocs, collection } from "firebase/firestore";
import { CartContextProvider } from "./global/CartContext";
import { Cart } from "./components/Cart";
import { Cashout } from "./components/Cashout";

export class App extends Component {
    state = {
        user: null,
    };

    componentDidMount() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collection(db, "SignedUpUserData"), where("Uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    this.setState({
                        user: querySnapshot.docs[0].data().Name,
                    });
                }
            } else {
                this.setState({
                    user: null,
                });
            }
        });
    }

    render() {
        return (
            <div>
                <ProductsContextProvider>
                    <CartContextProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route exact path="/" element={<Home user={this.state.user} />}></Route>
                                <Route path="/signup" element={<SignUp />}></Route>
                                <Route path="/login" element={<Login />}></Route>
                                <Route path="/cartproducts" element={<Cart user={this.state.user} />}></Route>
                                <Route path="/addproducts" element={<AddProducts user={this.state.user} />}></Route>
                                <Route path="/cashout" element={<Cashout user={this.state.user} />}></Route>
                            </Routes>
                        </BrowserRouter>
                    </CartContextProvider>
                </ProductsContextProvider>
            </div>
        );
    }
}

export default App;
