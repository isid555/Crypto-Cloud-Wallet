const express = require("express");
const { userModel, connectDB } = require("../mongoose");
const bcrypt = require("bcryptjs");
const { Connection, clusterApiUrl, Transaction, Keypair } = require("@solana/web3.js");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv").config();
const serverless = require("serverless-http");
const bs58 = require("bs58");

const JWT_SECRET = "bonkbot";

const app = express();
app.use(express.json());
app.use(cors());

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

connectDB();

app.post("/api/v1/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        const userExists = await userModel.findOne({ username });

        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const keyPair = Keypair.generate();

        await userModel.create({
            username,
            password: hashedPassword,
            publicKey: keyPair.publicKey.toString(),
            privateKey: keyPair.secretKey.toString(),
        });

        res.json({
            message: "User created successfully",
            publicKey: keyPair.publicKey.toString(),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.post("/api/v1/signin", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({ username });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({
            message: "Sign in successful",
            token,
            publicKey: user.publicKey,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.post("/api/v1/txn/sign", async (req, res) => {
    try {
        const { message, username } = req.body;
        const tx = Transaction.from(message.data);
        const user = await userModel.findOne({ username });

        if (!user) return res.status(404).json({ message: "User not found" });

        const privateKeyArray = user.privateKey.split(",").map(Number);
        const keyPair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));

        const { blockhash } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = keyPair.publicKey;

        tx.sign(keyPair);
        const signature = await connection.sendTransaction(tx, [keyPair]);

        res.json({ message: "Transaction Signed Successfully", signature });
    } catch (error) {
        res.status(500).json({ message: "Transaction signing failed", error });
    }
});

app.post("/api/v1/show_privateKey", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({ username });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const privateKeyArray = user.privateKey.split(",").map(Number);
        const privateKeyStringed = bs58.encode(Uint8Array.from(privateKeyArray));

        res.json({ message: "Status Success", privateKey: privateKeyStringed });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.listen(8000);


module.exports = app;
module.exports.handler = serverless(app);
