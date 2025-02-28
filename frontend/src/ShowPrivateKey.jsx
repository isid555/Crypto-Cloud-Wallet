import axios from "axios";
import {Common} from "./Common.jsx";
import {API_URL} from "./api_url.js";

export function ShowPrivateKey(){


   async function fetchKey(){
       const user = document.getElementById("username").value;
       const password = document.getElementById("password").value;

       try {
           const response = await axios.post(`${API_URL}/v1/show_privateKey`, {
               username: user,
               password: password,
           });

           document.getElementById("privateKey").innerHTML = response.data.privateKey;

       } catch (error) {
           console.log(error);
       }
    }




    return (
        <>
            <Common/>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">

            <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-600">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Show Private Key</h2>
                <h4 className="text-lg font-bold text-red-600 text-center mb-6">Do not reveal your private key to anyone !!!</h4>
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
                    onClick={fetchKey}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg shadow-lg hover:bg-gray-500 transition duration-300"
                >
                    Submit
                </button>

                <p className="mt-4 text-gray-300 font-semibold text-center ">Your Private Key is :- </p> <h4 id="privateKey" className="mt-4 text-green-600 font-semibold text-center"></h4>
            </div>
        </div>
        </>
    );
}