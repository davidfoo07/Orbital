import React, { useState, useEffect } from 'react'
import { storage, db, auth } from '../config/config'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'
import { Navbar } from './Navbar'
import { useNavigate } from 'react-router-dom'

export const AddProducts = ({user}) => {

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productStock, setProductStock] = useState(null)
    const [productImg, setProductImg] = useState(null);
    const [error, setError] = useState('');
    
    const navigate = useNavigate()
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/login");
            }
        });
        console.log(user)
    });

    const types = ['image/png', 'image/jpeg']; // image types

    const productImgHandler = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile && types.includes(selectedFile.type)) {
            const storageRef = ref(storage, `product-images/${selectedFile.name}`)
            uploadBytes(storageRef, selectedFile).then(() => {
                setProductImg(selectedFile);
                setError('')
            })
        }
        else {
            setProductImg(null);
            setError('Please select a valid image type (jpg or png)');
        }
    }

    // add product
    const addProduct = (e) => {
        e.preventDefault();
        getDownloadURL(ref(storage, `product-images/${productImg.name}`)).then((url) => {
            addDoc(collection(db, 'Products'), {
            ProductName: productName,
            ProductPrice: Number(productPrice),
            ProductStock: Number(productStock),
            ProductImg: url
            }).then(() => {
                setProductName('');
                setProductPrice(0)
                setProductStock(0)
                setProductImg('');
                setError('');
                document.getElementById('file').value = '';
            }).catch(err => setError(err.message))
        })
    }
        

    return (
        <div className='container'>
            <Navbar user={user}/>
            <br />
            <h2>ADD PRODUCTS</h2>
            <hr />
            <form autoComplete="off" className='form-group' onSubmit={addProduct}>
                <label htmlFor="product-name">Product Name</label>
                <input type="text" className='form-control' required
                    onChange={(e) => setProductName(e.target.value)} value={productName} />
                <br />
                <label htmlFor="product-price">Product Price</label>
                <input type="number" className='form-control' required
                    onChange={(e) => setProductPrice(e.target.value)} value={productPrice} />
                <br />
                <label htmlFor="product-stock">Product Stock</label>
                <input type="number" className='form-control' required 
                    onChange={(e) => setProductStock(e.target.value)} value={productStock}/>
                    <br />
                <label htmlFor="product-img">Product Image</label>
                <input type="file" className='form-control' id="file" required
                    onChange={productImgHandler} />
                <br />
                <button type="submit" className='btn btn-success btn-md mybtn'>ADD</button>
            </form>
            {error && <span className='error-msg'>{error}</span>}
            {productImg && <img src={URL.createObjectURL(productImg)} alt='Preview' />}
        </div>
    )
}