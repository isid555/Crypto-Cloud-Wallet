import {clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {Common} from "./Common.jsx";
import {API_URL} from "./api_url.js";
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

export function Transactions() {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const publickey = decode.id.publicKey;

    async function sendSol() {
        const fromPubkey = new PublicKey(publickey);
        const toPubkey = new PublicKey(document.getElementById("to").value);

        const ix = SystemProgram.transfer({
            fromPubkey: fromPubkey,
            toPubkey: toPubkey,
            lamports: document.getElementById("amt").value * LAMPORTS_PER_SOL
        });

        const tx = new Transaction().add(ix);
        const { blockhash } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = fromPubkey;

        const serializedTx = tx.serialize({
            requireAllSignatures: false,
            verifySignatures: false
        });

        const usernameFrom_Document = document.getElementById("user").value;

        const response = await axios.post(`${API_URL}/v1/txn/sign`, {
            message: serializedTx,
            username: usernameFrom_Document
        });

        document.getElementById("signature").innerHTML = response.data.signature;
    }

    return (
        <>
            <Common/>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-600">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Transactions</h2>
                <input
                    type="text"
                    placeholder="Username"
                    id="user"
                    className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <input
                    type="text"
                    placeholder="Address"
                    id="to"
                    className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    id="amt"
                    className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                    onClick={sendSol}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg shadow-lg hover:bg-gray-500 transition duration-300"
                >
                    Submit
                </button>
                <p className="mt-4 text-green-600 font-semibold text-center">The Signature of this transaction is
                    :- </p>
                <p id="signature" className="mt-4 text-green-600 font-semibold text-center"></p>
            </div>
        </div>
        </>
    );
}
