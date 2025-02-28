import { Common } from "./Common.jsx";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { Loading } from "./Loading.jsx";
import { AuthGuard } from "./AuthGuard.jsx";

export function AirDrop() {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [signature, setSignature] = useState("");
    const [error, setError] = useState("");
    const [publicKeyStr, setPublicKeyStr] = useState("");

    useEffect(() => {
        const storedKey = localStorage.getItem("publicKey");
        if (storedKey) {
            setPublicKeyStr(storedKey);
        }
    }, []);

    const connection = new Connection( clusterApiUrl("devnet") ,  "confirmed");

    async function requestAirdrop() {
        if (!publicKeyStr) {
            setError("❌ No public key found. Please sign in.");
            return;
        }

        let publicKey;
        try {
            publicKey = new PublicKey(publicKeyStr);
        } catch (error) {
            setError("❌ Invalid public key.");
            return;
        }

        if (!amount || amount <= 0) {
            setError("❌ Enter a valid amount.");
            return;
        }

        setLoading(true);
        setError("");
        setSignature("");

        const amountToAirdrop = Math.min(2, amount);

        try {
            const signature = await connection.requestAirdrop(publicKey, amountToAirdrop * LAMPORTS_PER_SOL);
            // await connection.confirmTransaction(signature, "confirmed");
            setSignature(signature);
        } catch (error) {
            console.error("Airdrop failed:", error);
            setError("❌ Airdrop failed. Try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Common />
            <AuthGuard />
            {loading && <Loading />}
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
                <div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-600 mt-6 text-center transform transition-all duration-500 ease-in-out hover:scale-105">
                    <h2 className="text-3xl font-bold text-white text-center mb-6">Airdrop SOL</h2>
                    <p className="text-gray-300 text-lg">Airdropping for wallet:</p>
                    <p className="text-green-400 font-semibold text-md mt-2">{publicKeyStr || "Not connected"}</p>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0.01"
                        step="0.01"
                        className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-center"
                        placeholder="Enter amount (max 2 SOL)"
                    />

                    {error && <p className="text-red-500 font-semibold text-sm mt-2">{error}</p>}
                    {signature && (
                        <p className="text-green-400 font-semibold text-md mt-2">
                            ✅ Airdrop successful!
                            <a
                                href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-400"
                            >
                                View on Solana Explorer
                            </a>
                        </p>
                    )}

                    <button
                        onClick={requestAirdrop}
                        disabled={loading || !amount || amount <= 0}
                        className={`w-full py-2 rounded-lg shadow-lg transition duration-300 ${
                            loading || !amount || amount <= 0
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-gray-600 hover:bg-gray-500 text-white"
                        }`}
                    >
                        {loading ? "Processing..." : "Request Airdrop"}
                    </button>
                </div>
            </div>
        </>
    );
}
