import React, { useContext, useEffect, useState } from "react";
import { ProductsContext } from "../global/ProductsContext";
import { CartContext } from "../global/CartContext";
import { ToastContainer } from "react-toastify";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import Icon from "react-icons-kit";
import { search } from "react-icons-kit/icomoon/search";

export const Products = () => {
    useEffect(() => console.log(products.map((item) => item.Uid)));
    const { products } = useContext(ProductsContext);

    // const data = useContext(CartContext)
    // console.log(data)

    const { dispatch } = useContext(CartContext);

    const navigate = useNavigate();
    const [srch, setSearch] = useState("");

    const handleClick = (id, name, img, price, stock, desc, uid, product) => {
        navigate("/productPage", {
            state: {
                productID: id,
                productName: name,
                productImg: img,
                productPrice: price,
                productStock: stock,
                productDescription: desc,
                uid: uid,
                product: product,
            },
        });
    };

    return (
        <>
            {products.length !== 0 && (
                <div>
                    <h1>Products</h1>{" "}
                    <div className="products-search">
                        <input type="search" placeholder="enter keyword" onChange={(e) => setSearch(e.target.value)} />
                        <button>
                            <Icon className="search-icon" icon={search} />
                        </button>
                    </div>
                </div>
            )}

            <div className="products-container">
                {products.length === 0 && <div>slow internet...no products to display</div>}
                {products
                    .filter((item) => (item.ProductName.includes(srch) ? item : ""))
                    .map((product) => (
                        <div className="product-card" key={product.ProductID}>
                            <div
                                className="product-img"
                                onClick={() =>
                                    handleClick(
                                        product.ProductID,
                                        product.ProductName,
                                        product.ProductImg,
                                        product.ProductPrice,
                                        product.ProductStock,
                                        product.ProductDescription,
                                        product.Uid,
                                        product
                                    )
                                }
                            >
                                <img src={product.ProductImg[0]} alt="not found" />
                            </div>
                            <div className="product-name">{product.ProductName}</div>
                            <div className="product-price">$ {product.ProductPrice}.00</div>
                            <button
                                className="addcart-btn"
                                onClick={() =>
                                    dispatch({
                                        type: "ADD_TO_CART",
                                        id: product.ProductID,
                                        stock: product.ProductStock,
                                        product,
                                    })
                                }
                            >
                                ADD TO CART
                            </button>
                            <ToastContainer />
                        </div>
                    ))}
            </div>
        </>
    );
};
