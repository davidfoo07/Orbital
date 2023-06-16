export const CartReducer = (state, action) => {
    const { shoppingCart, totalPrice, totalQty } = state;
    let product;
    let index;
    let updatedPrice;
    let updatedQty;

    switch (action.type) {
        
        case "ADD TO CART":
            
            const check = shoppingCart.find((product) => product.ProductID === action.id);
            if (check) {
                console.log("Producy is already in your cart");
                return state;
            } else {
                product = action.product;
                product["qty"] = 1;
                product[totalProductPrice] = productPrice * product.qty;
                updatedQty = totalQty + 1;
                updatedPrice = totalPrice + product.productPrice;
                return {
                    shoppingCart: [product, ...shoppingCart],
                    totalPrice: updatedPrice,
                    totalQty: updatedQty,
                };
            }
    }
};
