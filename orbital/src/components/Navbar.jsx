import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/One2Sell_logo.png";
import "../css/Home.css";
import Icon from "react-icons-kit";
import { home } from "react-icons-kit/icomoon/home";
import { cart } from "react-icons-kit/entypo/cart";
import { plus } from "react-icons-kit/icomoon/plus";
import { bell } from "react-icons-kit/fa/bell";
import { auth } from "../config/config";
import { signOut } from "firebase/auth";
import { CartContext } from "../global/CartContext";
import { bubble } from "react-icons-kit/icomoon/bubble";
import { NotificationsContext } from "../global/NotificationsContext";

export const Navbar = ({ user }) => {
    const { totalQty } = useContext(CartContext);
    const { orders } = useContext(NotificationsContext);

    useEffect(() => {
        console.log(orders);
    });

    const navigate = useNavigate();

    const logout = () => {
        signOut(auth).then(() => {
            navigate("/login");
        });
    };

    return (
        <div className="navbox">
            <div className="leftside">
                <img src={logo} alt="" />
            </div>
            {!user && (
                <div className="rightside">
                    <button className="navlinks" onClick={() => navigate("/signup")}>
                        SIGN UP
                    </button>
                    <button className="navlinks" onClick={() => navigate("/login")}>
                        LOG IN
                    </button>
                </div>
            )}
            {user && (
                <div className="rightside">
                    <span>
                        <button className="navlinks" onClick={() => navigate("/")}>
                            <Icon icon={home}></Icon>
                        </button>
                    </span>
                    <span>
                        <button className="navlinks" onClick={() => navigate("/profile")}>
                            {user}
                        </button>
                    </span>
                    <span>
                        <button className="navlinks" onClick={() => navigate("/notifications")}>
                            <Icon icon={bell}></Icon>
                            <span className="no-of-notifications">{orders.length}</span>
                        </button>
                    </span>
                    <span>
                        <button className="navlinks" onClick={() => navigate("/messages")}>
                            <Icon icon={bubble}></Icon>
                        </button>
                    </span>
                    <span>
                        <button className="navlinks" onClick={() => navigate("/addproducts")}>
                            <Icon icon={plus} />
                        </button>
                    </span>
                    <span>
                        <button className="navlinks" onClick={() => navigate("/cartproducts")}>
                            <Icon icon={cart} />
                            <span className="no-of-products">{totalQty}</span>
                        </button>
                    </span>
                    <div className="relative">
                        <span>
                            <button className="logout-btn" onClick={logout}>
                                LOGOUT
                            </button>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
