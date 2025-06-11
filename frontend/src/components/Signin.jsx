import axios from "axios";
import {Common} from "./Common.jsx";
import {API_URL} from "../api_url.js";
import {Link} from "react-router-dom";
import {useState} from "react";
export function Signin() {
    const [loading, setLoading] = useState(false);


    async function handleSignIn() {
        setLoading(true);
        setTimeout(async () => {
            await userSignin(); // Call the sign-in function
            setLoading(false);
        }, 3000);
    }


    async function userSignin() {
        const user = document.getElementById("username").value;
        const password = document.getElementById("password").value;




        try {


            const response = await axios.post(`${API_URL}/v1/signin`, {
                username: user,
                password: password,
            });
            // document.getElementById("result").innerHTML = response.data.token;
            document.getElementById("publicKey").innerHTML = response.data.publicKey;
            console.log(response.data.token);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("publicKey", response.data.publicKey);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Common/>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-600">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Sign In</h2>
                <input
                    type="text"
                    placeholder="Enter Username"
                    id="username"
                    className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <input
                    type="password"
                    placeholder="Enter Password"
                    id="password"
                    className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                    onClick={handleSignIn}
                    disabled={loading}
                    className={`w-full bg-gray-600 text-white py-2 rounded-lg shadow-lg transition duration-300 flex items-center justify-center ${
                        loading ? "cursor-not-allowed opacity-70" : "hover:bg-gray-500"
                    }`}
                >
                    {loading ? (
                        <svg
                            className="animate-spin h-5 w-5 text-white mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                    ) : (
                        "Submit"
                    )}
                </button>
                <Link to={"/"} className={"text-lg text-lime-400"}>Don't have an account ? Signup Now !</Link>
                {/*<p id="result" className="mt-4 text-gray-300 font-semibold text-center"></p>*/}
                <p className="mt-4 text-gray-300 font-semibold text-center ">Your Public Key is :- </p> <h4
                id="publicKey" className="mt-4 text-green-600 font-semibold text-center"></h4>
            </div>
        </div>
        </>
    );
}
