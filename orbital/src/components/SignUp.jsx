import React, { useState } from "react";
import { auth, db } from "../config/config";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SignUp = (props) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const signup = (e) => {
        e.preventDefault();
        // console.log('form submitted')
        // console.log(name, email, password)
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setDoc(doc(db, "SignedUpUserData", `${userCredential.user.uid}`), {
                    Name: name,
                    Phone: phone,
                    Email: email,
                    Password: password,
                    Image: null,
                    Uid: userCredential.user.uid,
                })
                    .then(() => {
                        setName("");
                        setPhone("");
                        setEmail("");
                        setPassword("");
                        setError("");
                        //props.history.push('/login')
                    })
                    .then(() => {
                        toast.success("Signed up successfully", {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                        });
                    })
                    .then(() => {
                        setTimeout(() => {
                            navigate("/login");
                        }, 2000);
                    })
                    .catch((err) => setError(err.message));
            })
            .catch((err) => setError(err.message));
    };

    return (
        <div className="container">
            <br />
            <h2>Sign Up</h2>
            <br />
            <form action="" autoComplete="off" className="form-group" onSubmit={signup}>
                <label htmlFor="Name">Name</label>
                <br />
                <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                />
                <br />
                <label htmlFor="Phnoe">Phone Number</label>
                <br />
                <input
                    type="text"
                    placeholder="012345678"
                    className="form-control"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    required
                />
                <br />
                <label htmlFor="Email">Email</label>
                <br />
                <input
                    type="email"
                    placeholder="youremail@gmail.com"
                    className="form-control"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                <br />
                <label htmlFor="Password">Password</label>
                <br />
                <input
                    type="password"
                    placeholder="********"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <br />
                <button type="submit" className="btn btn-success btn-md mybtn">
                    REGISTER
                </button>
            </form>
            {error && <div className="error-msg">{error}</div>}
            <br />
            <div>
                Already have an account? Login
                <span className="text-decoration-underline" onClick={() => navigate("/login")}>
                    {" "}
                    Here
                </span>
            </div>
            <ToastContainer />
        </div>
    );
};
