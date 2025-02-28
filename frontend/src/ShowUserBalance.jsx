import { useEffect, useState } from "react";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Common } from "./Common";
import {Loading} from "./Loading.jsx";
import {AuthGuard} from "./AuthGuard.jsx";


export function ShowUserBalance() {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const publicKeyStr = localStorage.getItem("publicKey");

    useEffect(() => {
        async function fetchBalance() {
            if (publicKeyStr) {
                try {
                    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
                    const publicKey = new PublicKey(publicKeyStr);
                    const balanceInLamports = await connection.getBalance(publicKey);
                    setBalance(balanceInLamports / LAMPORTS_PER_SOL);
                } catch (error) {
                    console.error("Error fetching balance:", error);
                } finally {
                    setLoading(false);
                }
            }
        }

        fetchBalance();
    }, [publicKeyStr]);

    return (
        <>
            <Common />
            <AuthGuard/>
            {loading && <Loading />}
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
                <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-600 mt-6 text-center transform transition-all duration-500 ease-in-out hover:scale-105">
                    <h2 className="text-3xl font-bold text-white text-center mb-6">User Balance</h2>
                    <p className="text-gray-300 text-lg">The balance for your public key:</p>
                    <p className="text-green-400 font-semibold text-md mt-2">{publicKeyStr}</p>
                    <p className="text-white text-xl font-bold mt-4 animate-pulse">
                        {balance !== null ? `${balance} SOL` : "Loading..."}
                    </p>
                </div>
            </div>
        </>
    );
}
