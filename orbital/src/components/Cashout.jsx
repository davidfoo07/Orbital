import React from "react";
import { Navbar } from "./Navbar";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../global/CartContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/config";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, query, collection, getDocs, where } from "firebase/firestore";
import { Button, Modal, ModalFooter } from "react-bootstrap";
import { StripeContainer } from "./StripeContainer";

export const Cashout = ({ userName, userId }) => {
    const { shoppingCart, totalPrice, totalQty, dispatch } = useContext(CartContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cell, setCell] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collection(db, "SignedUpUserData"), where("Uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setName(querySnapshot.docs[0].data().Name);
                    setEmail(querySnapshot.docs[0].data().Email);
                }
            } else {
                navigate("/login");
            }
        });
    });

    const cashoutSubmit = (e, type) => {
        e.preventDefault();
        shoppingCart.map((cart) =>
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    await addDoc(collection(db, "Buyer-Info"), {
                        BuyerName: name,
                        BuyerEmail: email,
                        BuyerCell: cell,
                        BuyerAddress: address,
                        BuyerPayment: totalPrice,
                        BuyerQuantity: totalQty,
                        ProductOwnerUid: cart.Uid,
                        BuyerUid: userId,
                        ProductName: cart.ProductName,
                        PaymentType: type,
                    })
                        .then(() => {
                            setCell("");
                            setAddress("");
                            dispatch({ type: "EMPTY", id: cart.ProductID, stock: cart.ProductStock, cart });
                            setSuccessMsg(
                                "Your order has been placed successfully! Thank you for shopping on One2sell."
                            );
                            setTimeout(() => {
                                navigate("/");
                            }, 4000);
                        })
                        .then(() => {
                            setTimeout(() => {
                                window.location.reload();
                            }, 5000);
                        })
                        .catch((err) => setError(err.message));
                }
            })
        );
    };

    return (
        <>
            <Navbar user={userName} />
            <div className="container">
                <br />
                <h2>Cashout Details</h2>
                <br />
                {successMsg && <div className="success-msg">{successMsg}</div>}
                <form autoComplete="off" className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" required value={name} disabled />
                    <br />
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" required value={email} disabled />
                    <br />
                    <label htmlFor="Cell No">Mobile phone number</label>
                    <input
                        type="number"
                        className="form-control"
                        required
                        onChange={(e) => setCell(e.target.value)}
                        value={cell}
                        placeholder="eg 03123456789"
                    />
                    <br />
                    <label htmlFor="Delivery Address">Delivery Address</label>
                    <input
                        type="text"
                        className="form-control"
                        required
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                    />
                    <br />
                    <label htmlFor="Price To Pay">Price To Pay</label>
                    <input type="number" className="form-control" required value={totalPrice} disabled />
                    <br />
                    <label htmlFor="Total No of Products">Total No of Products</label>
                    <input type="number" className="form-control" required value={totalQty} disabled />
                    <br />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModal(true);
                        }}
                        className="card-btn btn-success btn-md mybtn"
                    >
                        Payment by card
                    </button>
                    <button className="cod-btn btn-success btn-md mybtn" onClick={(e) => cashoutSubmit(e, "COD")}>
                        Cash on delivery
                    </button>
                </form>
                {error && <span className="error-msg">{error}</span>}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <StripeContainer handleSubmit={(e) => cashoutSubmit(e, "Card")} />
                </Modal.Body>
            </Modal>
        </>
    );
};
