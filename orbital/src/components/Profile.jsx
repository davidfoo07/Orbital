import React, { useState, useEffect, useContext } from "react";
import { Navbar } from "./Navbar";
import "../css/Profile.css";
import Icon from "react-icons-kit";
import { plus } from "react-icons-kit/icomoon/plus";
import { phone } from "react-icons-kit/icomoon/phone";
import { instagram } from "react-icons-kit/icomoon/instagram";
import { telegram } from "react-icons-kit/icomoon/telegram";
import { facebook } from "react-icons-kit/icomoon/facebook";
import { twitter } from "react-icons-kit/icomoon/twitter";
import { iosTrashOutline } from "react-icons-kit/ionicons/iosTrashOutline";
import { Modal, Button, ModalFooter } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { auth, db, storage } from "../config/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateDoc, collection, where, query, getDocs, doc, deleteDoc, arrayUnion } from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { onAuthStateChanged } from "firebase/auth";
import { ProductsContext } from "../global/ProductsContext";
import { useNavigate } from "react-router-dom";

export const Profile = ({ userName, userPhone, userId, userEmail, userImage, TWITTER, FB, IG, TELE }) => {
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const { creationTime } = user.metadata;
                const creationDate = new Date(creationTime).toLocaleString("en-US", {
                    month: "short",
                    year: "numeric",
                });
                setJoinDate(creationDate);
            } else {
                console.log("User not logged in.");
                navigate("/login");
            }
            console.log(currProduct);
        });
    });

    const navigate = useNavigate();
    const [joinDate, setJoinDate] = useState("");
    const [currProduct, setCurrProduct] = useState("");
    const [currProductImg, setCurrProductImg] = useState("");

    const { products } = useContext(ProductsContext);

    const listing = products.filter((item) => {
        return item.Uid === userId ? item : "";
    });

    const settings1 = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: listing.length < 3 ? listing.length : 3,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const settings2 = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: !currProduct
            ? 0
            : currProduct.ProductImg.length < 4
            ? currProduct.ProductImg.length + 1
            : currProduct.ProductImg.length === 4
            ? 4
            : 0,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const [showModal, setShowModal] = useState(false);
    const [showImgModal, setShowImgModal] = useState(false);
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productStock, setProductStock] = useState("");
    const [productImg, setProductImg] = useState(null);
    const [profileName, setProfileName] = useState("");
    const [profilePhone, setProfilePhone] = useState("");
    const [twt, setTwitter] = useState("");
    const [fb, setFb] = useState("");
    const [ig, setIg] = useState("");
    const [tele, setTele] = useState("");
    const [profileImg, setProfileImg] = useState(null);
    const [error, setError] = useState("");

    const [showProductModal, setShowProductModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showAddImgModal, setShowAddImgModal] = useState(false);
    const [showEditImgModal, setShowEditImgModal] = useState(false);
    const [showDeleteImgModal, setShowDeleteImgModal] = useState(false);

    const handleClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseImgModal = () => {
        setShowImgModal(false);
    };

    const handleCloseProductModal = () => {
        setShowProductModal(false);
    };

    const types = ["image/png", "image/jpeg"]; // image types

    const handleImage = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile && types.includes(selectedFile.type)) {
            const storageRef = ref(storage, `profile-images/${selectedFile.name}`);
            uploadBytes(storageRef, selectedFile).then(() => {
                setProfileImg(selectedFile);
                setError("");
            });
        } else {
            setProfileImg(null);
            setError("Please select a valid image type (jpg or png)");
        }
    };

    const upload = async (e) => {
        e.preventDefault();
        const q = query(collection(db, "SignedUpUserData"), where("Uid", "==", userId));
        const docRef = (await getDocs(q)).docs[0];
        const currDoc = doc(db, "SignedUpUserData", docRef.data().Uid);
        const url = await getDownloadURL(ref(storage, `profile-images/${profileImg.name}`));
        await updateDoc(currDoc, {
            Image: url,
        })
            .then(() => {
                toast.success("profile picture upload successfully", {
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
            .catch((err) => setError(err));
    };

    const handleProductImage = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile && types.includes(selectedFile.type)) {
            const storageRef = ref(storage, `product-images/${selectedFile.name}`);
            uploadBytes(storageRef, selectedFile).then(() => {
                setProductImg(selectedFile);
                setError("");
            });
        } else {
            setError("Please select a valid image type (jpg or png)");
        }
    };

    const editProduct = async (e) => {
        e.preventDefault();
        const currDoc = doc(db, "Products", currProduct.ProductID);

        await updateDoc(currDoc, {
            ProductName: !productName ? currProduct.ProductName : productName,
            ProductPrice: !productPrice ? currProduct.ProductPrice : productPrice,
            ProductStock: !productStock ? currProduct.ProductStock : productStock,
            ProductImg: !productImg
                ? currProduct.ProductImg
                : arrayUnion(await getDownloadURL(ref(storage, `product-images/${productImg.name}`))),
        })
            .then(() => {
                toast.success("Updated successfully", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            })
            .then(() => setShowEditModal(false))
            .catch((err) => setError(err));
    };

    const remove = async (e) => {
        e.preventDefault();
        const docRef = doc(db, "Products", currProduct.ProductID);
        await deleteDoc(docRef)
            .then(() => {
                toast.success("Deleted successfully", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            })
            .then(() => setShowDeleteModal(false))
            .then(() => window.location.reload())
            .catch((err) => setError(err));
    };

    const editProfile = async (e) => {
        e.preventDefault();
        const currDoc = doc(db, "SignedUpUserData", userId);

        await updateDoc(currDoc, {
            Name: !profileName ? userName : profileName,
            Phone: !profilePhone ? userPhone : profilePhone,
            Twitter: twt,
            Facebook: fb,
            Instagram: ig,
            Telegram: tele,
            Image: !profileImg ? userImage : await getDownloadURL(ref(storage, `profile-images/${profileImg.name}`)),
        })
            .then(() => {
                toast.success("Updated successfully", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            })
            .then(() => setShowEditProfileModal(false))
            .catch((err) => setError(err));
    };

    const addImg = async (e) => {
        e.preventDefault();
        const currDoc = doc(db, "Products", currProduct.ProductID);

        await updateDoc(currDoc, {
            ProductImg: arrayUnion(await getDownloadURL(ref(storage, `product-images/${productImg.name}`))),
        })
            .then(() => {
                toast.success("Added successfully", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            })
            .then(() => setShowAddImgModal(false))
            .catch((err) => setError(err));
    };

    const editImg = async (e) => {
        e.preventDefault();
        const currDoc = doc(db, "Products", currProduct.ProductID);
        const url = await getDownloadURL(ref(storage, `product-images/${productImg.name}`));
        const productImgArr = [...currProduct.ProductImg];

        for (let i = 0; i < productImgArr.length; i++) {
            if (productImgArr[i] === currProductImg) {
                productImgArr[i] = url;
            }
        }
        console.log(productImgArr);

        await updateDoc(currDoc, {
            ProductImg: productImgArr,
        })
            .then(() => {
                toast.success("Updated successfully", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            })
            .then(() => setShowEditImgModal(false))
            .catch((err) => setError(err));
    };

    const removeImg = async (e) => {
        e.preventDefault();
        const docRef = doc(db, "Products", currProduct.ProductID);
        const productImgArr = [...currProduct.ProductImg];
        for (let i = 0; i < productImgArr.length; i++) {
            if (productImgArr[i] === currProductImg) {
                productImgArr.splice(i, 1);
            }
        }

        await updateDoc(docRef, {
            ProductImg: productImgArr,
        })
            .then(() => {
                toast.success("Deleted successfully", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            })
            .then(() => setShowDeleteImgModal(false))
            .catch((err) => setError(err));
    };

    return (
        <>
            <Navbar user={userName} />

            {/* Upload Profile Picture */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload profile picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="file" placeholder="select photo" id="file" onChange={handleImage} />
                    {error && <span className="error-msg">{error}</span>}
                </Modal.Body>
                <ModalFooter>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={upload}>
                        Save changes
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Profile Image */}
            <Modal show={showImgModal} onHide={handleCloseImgModal}>
                <img src={userImage} alt="Preview" />
            </Modal>

            <Modal show={showProductModal} onHide={handleCloseProductModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="action">
                        <button
                            className="edit-btn"
                            onClick={() => {
                                setShowEditModal(true);
                                handleCloseProductModal();
                            }}
                        >
                            Edit listing
                        </button>
                        <button
                            className="dlt-btn"
                            onClick={() => {
                                setShowDeleteModal(true);
                                handleCloseProductModal();
                            }}
                        >
                            <Icon icon={iosTrashOutline} size={24} />
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Edit listing */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit listing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="action">
                        <form autoComplete="off" className="form-group">
                            <label htmlFor="product-name">Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder={currProduct.ProductName}
                                value={productName}
                            />
                            <br />
                            <label htmlFor="product-price">Product Price</label>
                            <input
                                type="number"
                                className="form-control"
                                onChange={(e) => setProductPrice(e.target.value)}
                                placeholder={currProduct.ProductPrice}
                                value={productPrice}
                            />
                            <br />
                            <label htmlFor="product-stock">Product Stock</label>
                            <input
                                type="number"
                                className="form-control"
                                onChange={(e) => setProductStock(e.target.value)}
                                placeholder={currProduct.ProductStock}
                                value={productStock}
                            />
                            <div
                                className="add-img-container"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <br />
                                <Slider {...settings2}>
                                    {currProduct.ProductImg &&
                                        currProduct.ProductImg.map((item) => (
                                            <div
                                                className="card-slide-edit"
                                                onClick={() => {
                                                    setShowEditImgModal(true);
                                                    setShowEditModal(false);
                                                    setCurrProductImg(item);
                                                }}
                                            >
                                                <img src={item} alt="not found" />
                                            </div>
                                        ))}
                                    {(!currProduct || currProduct.ProductImg.length < 4) && (
                                        <div
                                            className="card-slide-edit d-flex flex-column justify-content-center align-items-center px-1"
                                            onClick={() => {
                                                setShowAddImgModal(true);
                                                setShowEditModal(false);
                                            }}
                                        >
                                            <Icon icon={plus} />
                                            <h8>Add photo</h8>
                                        </div>
                                    )}
                                </Slider>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editProduct}>
                        Save changes
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Add Product Image */}
            <Modal show={showAddImgModal} onHide={() => setShowAddImgModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <br />
                    <label htmlFor="product-img">Product Image</label>
                    <input type="file" className="form-control" id="file" onChange={handleProductImage} />
                    <br />
                </Modal.Body>
                <ModalFooter>
                    <Button variant="primary" onClick={addImg}>
                        Save changes
                    </Button>
                    <Button variant="secondary" onClick={() => setShowAddImgModal(false)}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Product Image */}
            <Modal show={showEditImgModal} onHide={() => setShowEditImgModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <br />
                    <label htmlFor="product-img">Product Image</label>
                    <input type="file" className="form-control" id="file" onChange={handleProductImage} />
                    <br />
                </Modal.Body>
                <ModalFooter>
                    <Button variant="primary" onClick={editImg}>
                        Save changes
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowEditImgModal(false);
                            setShowEditModal(true);
                        }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="secondary"
                        className="dlt-btn"
                        onClick={() => {
                            setShowDeleteImgModal(true);
                            setShowEditImgModal(false);
                        }}
                    >
                        <Icon icon={iosTrashOutline} size={24} />
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete product image  */}
            <Modal show={showDeleteImgModal} onHide={() => setShowDeleteImgModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete photo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Are you sure you want to remove this photo?</h5>
                </Modal.Body>
                <ModalFooter>
                    <Button variant="secondary" onClick={removeImg}>
                        Yes
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDeleteImgModal(false)}>
                        No
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete product */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Are you sure you want to delete the item?</h5>
                </Modal.Body>
                <ModalFooter>
                    <Button variant="secondary" onClick={remove}>
                        Yes
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        No
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Profile */}
            <Modal show={showEditProfileModal} onHide={() => setShowEditProfileModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form action="" className="d-flex flex-column">
                        <label htmlFor="">Name</label>
                        <input type="text" onChange={(e) => setProfileName(e.target.value)} placeholder={userName} />
                        <label htmlFor="">Phone</label>
                        <input type="text" onChange={(e) => setProfilePhone(e.target.value)} placeholder={userPhone} />
                        <label htmlFor="">Twitter</label>
                        <input
                            type="text"
                            onChange={(e) => setTwitter(e.target.value)}
                            placeholder="twitter username"
                        />
                        <label htmlFor="">Facebook</label>
                        <input type="text" onChange={(e) => setFb(e.target.value)} placeholder="facebook username" />
                        <label htmlFor="">Instagram</label>
                        <input type="text" onChange={(e) => setIg(e.target.value)} placeholder="instagram handle" />
                        <label htmlFor="">Telegram</label>
                        <input type="text" onChange={(e) => setTele(e.target.value)} placeholder="telegram handle" />
                        <label htmlFor="">Image</label>
                        <input type="file" onChange={handleImage} />
                    </form>
                </Modal.Body>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setShowEditProfileModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editProfile}>
                        Save Changes
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Profile image preview*/}
            <Modal show={showImgModal} onHide={handleCloseImgModal}>
                <img src={userImage} alt="Preview" />
            </Modal>

            <div class="container mt-4 mb-4 p-3 d-flex justify-content-center">
                <div class="card p-4">
                    <div class=" image d-flex flex-column justify-content-center align-items-center">
                        {!userImage && (
                            <button class={!userImage ? "btnP" : ""} onClick={handleClick}>
                                <Icon className="plus-icon" icon={plus} />
                            </button>
                        )}
                        {userImage && (
                            <button class={userImage ? "btnP" : ""}>
                                <img src={userImage} alt="not found" onClick={() => setShowImgModal(true)} />
                            </button>
                        )}
                        <span class="name mt-3">{userName}</span> <span class="idd">{userEmail}</span>
                        <div class="d-flex flex-col justify-content-center align-items-center gap-2">
                            <span class="idd1">@{userId}</span>
                        </div>
                        <div class="d-flex flex-col justify-content-center align-items-center">
                            <span class="phone">
                                <Icon icon={phone} /> {userPhone}
                            </span>
                        </div>
                        <div class=" d-flex mt-2">
                            <button class="btn1 btn-dark" onClick={() => setShowEditProfileModal(true)}>
                                Edit Profile
                            </button>
                        </div>
                        <div class="gap-3 mt-3 icons d-flex flex-row justify-content-center align-items-center">
                            <span className="d-flex flex-column justify-content-center align-items-center">
                                <i class="fa fa-twitter">
                                    <Icon icon={twitter} />
                                </i>
                                <p>@{TWITTER}</p>
                            </span>{" "}
                            <span className="d-flex flex-column justify-content-center align-items-center">
                                <i class="fa fa-facebook-f">
                                    <Icon icon={facebook} />
                                </i>
                                <p>@{FB}</p>
                            </span>{" "}
                            <span className="d-flex flex-column justify-content-center align-items-center">
                                <i class="fa fa-instagram">
                                    <Icon icon={instagram} />
                                </i>
                                <p>@{IG}</p>
                            </span>{" "}
                            <span className="d-flex flex-column justify-content-center align-items-center">
                                <i class="fa fa-telegram">
                                    <Icon icon={telegram} />
                                </i>
                                <p>@{TELE}</p>
                            </span>
                        </div>
                        <div class="px-2 rounded mt-4 date ">
                            <span class="join">Joined {joinDate}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="carousel-slider"
                style={{
                    display: listing.length < 3 ? "flex" : "",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <h2 className="text-center mt-4 mb-4">My listing:</h2>
                {listing.length === 0 && <p className="text-center">none</p>}

                <Slider {...settings1}>
                    {listing &&
                        listing.map((item) => (
                            <div
                                className="card-slide"
                                onClick={() => {
                                    setShowProductModal(true);
                                    setCurrProduct(item);
                                }}
                            >
                                <div className="card-top">
                                    <img src={item.ProductImg} alt="not found" />
                                    <h5>{item.ProductName}</h5>
                                </div>
                                <div className="card-bottom">
                                    <h5>$ {item.ProductPrice}</h5>
                                    <span className="category">Stock:{item.ProductStock}</span>
                                </div>
                            </div>
                        ))}
                </Slider>
            </div>
            <ToastContainer />
        </>
    );
};
