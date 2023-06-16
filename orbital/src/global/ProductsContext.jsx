import React, { createContext } from "react";
import { db } from "../config/config";
import { collection, onSnapshot, query, setDoc } from "firebase/firestore";

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
    };

    componentDidMount() {
        const prevProducts = this.state.products;
        const q = query(collection(db, "Products"));
        onSnapshot(q, (snapshot) => {
            let changes = snapshot.docChanges();
            changes.forEach((change) => {
                if (change.type === "added") {
                    prevProducts.push({
                        ProductID: change.doc.id,
                        ProductName: change.doc.data().ProductName,
                        ProductPrice: change.doc.data().ProductPrice,
                        ProductImg: change.doc.data().ProductImg,
                    });
                }
                this.setState({
                    products: prevProducts
                })
            });
        });
    }

    render() {
        return <ProductsContext.Provider value={{ products: [...this.state.products] }}>{this.props.children}</ProductsContext.Provider>;
    }
}
