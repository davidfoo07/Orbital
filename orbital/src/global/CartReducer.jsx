import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../config/config";
import { deleteDoc, updateDoc, doc } from "firebase/firestore";

export const CartReducer = (state, action) => {
    const { shoppingCart, totalPrice, totalQty } = state;

    const removeItem = async (id) => {
        await deleteDoc(doc(db, "Products", id));
    };

    const updateStock = async (id, stock) => {
        await updateDoc(doc(db, "Products", id), {
            ProductStock: stock,
        });
    };

    let product;
    let index;
    let updatedPrice;
    let updatedQty;
    let stockQty;

    switch (action.type) {
        case "ADD_TO_CART":
            if (shoppingCart.length > 0) {
                const check = shoppingCart.find((product) => product.ProductID === action.id);
                if (check) {
                    toast.info("this product is already in your cart", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                    });
                    return state;
                } else {
                    product = action.product;
                    product["qty"] = 1;
                    product["TotalProductPrice"] = product.ProductPrice * product.qty;
                    product["StockQty"] = product.ProductStock;
                    updatedQty = totalQty + 1;
                    updatedPrice = totalPrice + product.ProductPrice;
                    return {
                        shoppingCart: [product, ...shoppingCart],
                        totalPrice: updatedPrice,
                        totalQty: updatedQty,
                    };
                }
            } else {
                product = action.product;
                product["qty"] = 1;
                product["TotalProductPrice"] = product.ProductPrice * product.qty;
                updatedQty = totalQty + 1;
                updatedPrice = totalPrice + product.ProductPrice;
                return {
                    shoppingCart: [product, ...shoppingCart],
                    totalPrice: updatedPrice,
                    totalQty: updatedQty,
                };
            }

        case "INC":
            product = action.cart;
            if (product.qty >= action.stock) {
                toast.error("Max stock limit has reached", {
                    position: "top-center",
                    autoClose: 2000,
                    closeOnClick: true,
                    draggable: false,
                });
                updatedQty = totalQty;
                updatedPrice = totalPrice;
                index = shoppingCart.findIndex((cart) => cart.ProductID === action.id);
                shoppingCart[index] = product;
                return {
                    shoppingCart: [...shoppingCart],
                    totalPrice: updatedPrice,
                    totalQty: updatedQty,
                };
            } else {
                product.qty++;
                product.TotalProductPrice = product.qty * product.ProductPrice;
                updatedQty = totalQty + 1;
                updatedPrice = totalPrice + product.ProductPrice;
                index = shoppingCart.findIndex((cart) => cart.ProductID === action.id);
                shoppingCart[index] = product;
                return {
                    shoppingCart: [...shoppingCart],
                    totalPrice: updatedPrice,
                    totalQty: updatedQty,
                };
            }

        case "DEC":
            product = action.cart;
            if (product.qty > 1) {
                product.qty--;
                product.TotalProductPrice = product.qty * product.ProductPrice;
                updatedPrice = totalPrice - product.ProductPrice;
                updatedQty = totalQty - 1;
                index = shoppingCart.findIndex((cart) => cart.ProductID === action.id);
                shoppingCart[index] = product;
                return {
                    shoppingCart: [...shoppingCart],
                    totalPrice: updatedPrice,
                    totalQty: updatedQty,
                };
            } else {
                return state;
            }

        case "DELETE":
            const filtered = shoppingCart.filter((product) => product.ProductID !== action.id);
            product = action.cart;
            updatedQty = totalQty - product.qty;
            updatedPrice = totalPrice - product.qty * product.ProductPrice;
            return {
                shoppingCart: [...filtered],
                totalPrice: updatedPrice,
                totalQty: updatedQty,
            };

        case "EMPTY":
            product = action.cart;
            stockQty = action.stock - product.qty;
            updateStock(action.id, stockQty).then(() => {
                console.log(action.stock);
                console.log(stockQty);
                console.log(action.id);
                if (stockQty <= 0) {
                    removeItem(action.id);
                }
            });
            return {
                shoppingCart: [],
                totalPrice: 0,
                totalQty: 0,
            };
        default:
            return state;
    }
};
