const express = require("express");
const { userModel, connectDB } = require("../mongoose");
const bcrypt = require("bcryptjs");
const { Connection, clusterApiUrl, Transaction, Keypair ,PublicKey ,LAMPORTS_PER_SOL} = require("@solana/web3.js");
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

        const token = await  jwt.sign({ publicKey:user.publicKey ,username:username , id: user._id }, JWT_SECRET, { expiresIn: "1h" });


        res.json({
            message: "Sign in successful",
            token,
            publicKey: user.publicKey,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error:error.toString() });
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
        res.status(500).json({ message: "Transaction signing failed",error: error.toString() });
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
        const privateKeyStringed = bs58.default.encode(Uint8Array.from(privateKeyArray));

        res.json({ message: "Status Success", privateKey: privateKeyStringed });
    } catch (error) {
        res.status(500).json({ message: "Server error",error: error.toString() });
    }
});

app.post("/api/v1/show_balance",async (req,res)=>{
   try{

       const walletPublicKey = req.body.publicKey;

       const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

       const publicKey = new PublicKey(walletPublicKey);

       const balance = await connection.getBalance(publicKey);

        res.json({
            message:"Balance  fetched successfully",
            balance: balance / LAMPORTS_PER_SOL
        })

   }catch (error){
       res.status(500).json({
           message:"Error in fetching balance",
           error:error.toString()
       })
   }
});

app.post("/api/v1/airdrop" , async (req,res)=>{
    try{
        const walletPublicKey = req.body.publicKey;
        const amount  = req.body.amount;

        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        const publicKey = new PublicKey(walletPublicKey);

        if(publicKey){
            await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
        }

        res.json({
            message:`${amount} of SOL airdropped to wallet ${walletPublicKey} successfully`
        })


    }catch(error){
        res.status(500).json({
            message:"Error in airdropping",
            error:error.toString()
        })
    }
})






app.listen(8000);


module.exports = app;
module.exports.handler = serverless(app);
