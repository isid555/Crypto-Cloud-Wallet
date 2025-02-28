import axios from "axios";
import {Common} from "./Common.jsx";
import {API_URL} from "./api_url.js";
export function Signin() {
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
            localStorage.setItem("token", response.data.token);
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
                    onClick={userSignin}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg shadow-lg hover:bg-gray-500 transition duration-300"
                >
                    Submit
                </button>

                {/*<p id="result" className="mt-4 text-gray-300 font-semibold text-center"></p>*/}
               <p className="mt-4 text-gray-300 font-semibold text-center ">Your Public Key is :- </p> <h4 id="publicKey" className="mt-4 text-green-600 font-semibold text-center"></h4>
            </div>
        </div>
        </>
    );
}
