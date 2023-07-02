import React, { createContext } from "react";
import { db } from "../config/config";
import { collection, onSnapshot, query } from "firebase/firestore";

export const ProductsContext = createContext();

export class ProductsContextProvider extends React.Component {
    // componentDidMount() {
    //     const prevProducts = this.state.products
    //     addDoc(collection(db, 'Products').onSnapshot(snapshot => {
    //         let changes = snapshot.docChanges()
    //         changes.forEach(change => {
    //             if (change.type === 'added') {
    //                 prevProducts.push({
    //                     ProductID: change.doc.id,
    //                     ProductName: change.doc.data().ProductName,
    //                     ProductPrice: change.doc.data().ProductPrice,
    //                     ProductImg: change.doc.data().ProductImg,
    //                 })
    //             }
    //             this.setState({
    //                 products: prevProducts
    //             })
    //         })
    //     })
    // )}

    state = {
        products: [],
        loading: true,
    };

    componentDidMount() {
        //const prevProducts = this.state.products;
        const q = query(collection(db, "Products"));
        onSnapshot(q, (snapshot) => {
            this.setState({
                products: [],
            });
            snapshot.forEach((change) => {
                console.log(change.data().ProductName);
                var item = change.data();
                item["ProductID"] = change.id;
                this.setState((prev) => ({
                    products: [...prev.products, item],
                }));
            });
        });
        this.setState({
            loading: false,
        });
    }

    render() {
        return (
            <ProductsContext.Provider value={{ products: this.state.products }}>
                {!this.state.loading && this.props.children}
            </ProductsContext.Provider>
        );
    }
}
