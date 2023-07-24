import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/Notifications.css";
import { Navbar } from "./Navbar";
import { Modal, Button, ModalFooter } from "react-bootstrap";
import { NotificationsContext } from "../global/NotificationsContext";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/config";
import { toast, ToastContainer } from "react-toastify";

export const Notifications = ({ userName }) => {
    const { orders } = useContext(NotificationsContext);
    const [showModal, setShowModal] = useState(false);
    const [buyerInfoId, setBuyerInfoId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => console.log(orders.length));

    const post = async (e) => {
        e.preventDefault();
        await deleteDoc(doc(db, "Buyer-Info", buyerInfoId))
            .then(() => {
                toast.success(`Done deal, it was a pleasure doing business with you Mr. ${userName}`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            })
            .then(() => setShowModal(false))
            .then(
                setTimeout(() => {
                    window.location.reload();
                }, 5000)
            )
            .catch((err) => setError(err));
    };

    return (
        <>
            <Navbar user={userName} />
            <div
                class="notifications-container"
                style={{
                    display: orders.length < 3 ? "flex" : "",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {orders.map((doc) => (
                    <div
                        className="orders-container"
                        onClick={() => {
                            setBuyerInfoId(doc.BuyerInfoId);
                            setShowModal(true);
                        }}
                    >
                        <h3>Product Name: {doc.ProductName}</h3>
                        <br />
                        <h5 style={{ textDecoration: "underline" }}>Buyer Info</h5>
                        <p>Name: {doc.BuyerName}</p>
                        <p>Address: {doc.BuyerAddress}</p>
                        <p>H/P: {doc.BuyerCell}</p>
                        <p>Email: {doc.BuyerEmail}</p>
                        <p>Price Paid: {doc.BuyerPayment}</p>
                        <p>Quantity: {doc.BuyerQuantity}</p>
                        <p>Payment Type: {doc.PaymentType}</p>
                    </div>
                ))}
                {error && <span>{error}</span>}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>If you have posted the item, please click on item posted.</Modal.Body>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={post}>
                        Item posted
                    </Button>
                </ModalFooter>
            </Modal>

            <ToastContainer />
        </>
    );
};
