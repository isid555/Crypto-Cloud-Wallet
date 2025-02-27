
import './App.css'
import {clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import axios from "axios"


const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');


function App() {
const fromPubkey = new PublicKey("AJD4eVPKZ9jX63wwdy6Sf8K1BYcQ6KyDSTinPbidDzE2")
const toPubkey = new PublicKey("Etf7PWQDoTNGfTGfzTy8cvoyaiYYquqWS24JgDy8LF9w")


async function sendSol(){


    const ix = SystemProgram.transfer({
        fromPubkey: fromPubkey,
        toPubkey:toPubkey,
        lamports:0.001 * LAMPORTS_PER_SOL
    });

    const tx = new Transaction().add(ix)



    const { blockhash } = await connection.getLatestBlockhash();



    tx.recentBlockhash = blockhash
    tx.feePayer = fromPubkey





    const serializedTx = tx.serialize({
        requireAllSignatures:false,
        verifySignatures:false
    })

    console.log(serializedTx )

    await axios.post("http://localhost:8000/api/v1/txn/sign",{
        message:serializedTx,
        username:"Sid"
        }
    )

}


  return (
    <>
        <input type="text" placeholder={"Username"}/>
        <input type="text" placeholder={"Address"}/>
        <input type="number" placeholder={"Amount"}/>
        <button  onClick={sendSol}>Submit</button>
    </>
  )
}

export default App
