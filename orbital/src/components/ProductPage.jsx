import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/ProductPage.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartContext } from "../global/CartContext";
import { Widget } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/config";

export const ProductPage = ({ userName, userId }) => {
    const { state } = useLocation();
    const { dispatch } = useContext(CartContext);
    const { productID, productName, productImg, productPrice, productStock, productDescription, uid, product } = state;

    useEffect(() => {
        getDoc(doc(db, "SignedUpUserData", uid)).then((doc) => {
            setUserImg(doc.data().Image);
        });
    }, [db, uid]);

    const navigate = useNavigate();
    const [userImg, setUserImg] = useState("");

    const handleClick = (id) => {
        navigate("/chat", {
            state: {
                uid: uid,
                img: userImg,
            },
        });
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
    };
    return (
        <>
            <Navbar user={userName} />
            <div class="product-page-container">
                {/* <!-- Left Column / Headphones Image --> */}
                <div className="left-column">
                    <div>
                        <Slider {...settings}>
                            {productImg &&
                                productImg.map((item) => (
                                    <div className="card-slide-edit">
                                        <img src={item} alt="not found" />
                                    </div>
                                ))}
                        </Slider>
                    </div>
                </div>

                {/* <!-- Right Column --> */}
                <div class="right-column">
                    {/* <!-- Product Description --> */}
                    <div class="product-description">
                        <span>Product</span>
                        <h1>{productName}</h1>
                        <p>{productDescription}</p>
                    </div>

                    {/* <!-- Product Pricing --> */}
                    <div class="product-price">
                        <div className="product-price-text">$ {productPrice}</div>
                        <div className="cart-chat-btn"></div>
                        <button
                            class="cart-btn"
                            onClick={() =>
                                dispatch({
                                    type: "ADD_TO_CART",
                                    id: productID,
                                    stock: productStock,
                                    product,
                                })
                            }
                        >
                            Add to cart
                        </button>
                        {uid !== userId && (
                            <button className="chat-btn" onClick={handleClick}>
                                Chat with seller
                            </button>
                        )}
                    </div>
                    <Widget />
                </div>
            </div>
        </>
    );
};
