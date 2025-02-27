const express = require("express")

const {userModel}  =require("./mongoose")
const bcrypt = require("bcryptjs")
const {Connection, clusterApiUrl, Transaction} = require("@solana/web3.js");
const {Keypair} = require("@solana/web3.js");
const {hash} = require("bcryptjs");
const jwt = require('jsonwebtoken')
const JWT_SECRET = "bonkbot"
const bs58 = require("bs58")
const cors = require("cors")
const dotenv = require("dotenv").config()







const app = express();
app.use(express.json())
app.use(cors())


const connection = new Connection(clusterApiUrl('devnet') , 'confirmed')

app.post("/api/v1/signup" , async (req,res)=>{

    const username = req.body.username;
    const password = req.body.password;


    const user = await  userModel.findOne({username})

    if(user){
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password,10)


    const keyPair = new Keypair();
             await userModel.create({
                 username ,
                 password:hashedPassword,
                 publicKey:keyPair.publicKey.toString(),
                 privateKey :keyPair.secretKey.toString()
             })

    res.json({
        message:"user created Successfully",
        publicKey:keyPair.publicKey.toString()
    })
})


app.post("/api/v1/signin" , async (req,res)=>{


    const username = req.body.username;
    const password = req.body.password;

    const user = await userModel.findOne({username});

    if(!user){
        res.json({
            message:"user not found"
        })
    }

    const hashed = user.password;

    const isMatch = await bcrypt.compare(password  , hashed)

    if (!isMatch) {

        return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({
        id:user
    },JWT_SECRET)

    res.json({
        message:"Sign in",
        token:token
    })


})




app.post("/api/v1/txn/sign" , async (req,res)=>{


    const serializedTransaction = req.body.message;
    const username = req.body.username;


    const tx = Transaction.from(serializedTransaction.data)

    const user = await userModel.findOne({username})

    // const privateKey  = user.privateKey;
        const privateKey = process.env.PRIVATE_KEY;

    // const privateKeyArray = privateKey.split(",").map(num => parseInt(num, 10));
    // const keyPair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));

    const keyPair = Keypair.fromSecretKey(bs58.default.decode(privateKey))

    const {blockhash} = await  connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = keyPair.publicKey


    tx.sign(keyPair)
     const signature =  await connection.sendTransaction(tx , [keyPair])

    res.json({
        message:"Transaction Signed Succesfully",
        signature:signature
    })
})





app.get("/api/v1/txn/?id=id" , (req,res)=>{
    res.json({
        message:"Status -><"
    })
})


app.listen(8000);

