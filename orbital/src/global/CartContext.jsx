import React, {createContext, useReducer} from "react";
import {CartReducer} from './CartReducer'

export const CartContext = createContext()

export const CartContextProvider = (props) => {
    const [cart, dispatch] = useReducer(CartReducer, {shoppingCartry: [], totalPrice: 0, totoalQty: 0} )
    return {
        <CartContextProvider value={{ ...cart, dispatch}}>
            {props.children}
        </CartContextProvider>
    }
}