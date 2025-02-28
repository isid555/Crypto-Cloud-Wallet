import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Common} from "./Common.jsx";
import {API_URL} from "./api_url.js";
export function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [publicKey, setPublicKey] = useState("");

    async function userSignup() {
        try {
            const response = await axios.post(`${API_URL}/v1/signup`, {
                username,
                password,
            });
            setPublicKey(response.data.publicKey);
            toast.success("Signup successful!");
        } catch (error) {
            toast.error("Signup failed. Please try again." , error);
        }
    }

    return (
        <>
            <Common/>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-600">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Sign Up</h2>
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                    onClick={userSignup}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg shadow-lg hover:bg-gray-500 transition duration-300"
                >
                    Submit
                </button>
                {publicKey && (
                    <p className="mt-4 text-gray-300 font-semibold text-center">
                        Public Key: {publicKey}
                    </p>
                )}
            </div>
        </div>
        </>
    );
}

export default Signup;
