import {Link} from "react-router-dom";


export function Common() {
    return (
        <nav className="w-full bg-gray-800 p-4 shadow-lg flex justify-center space-x-6 text-white">
            <h3 className={"text-green-400 text-lg "}>Wallet<span className={"shadow-lg text-sm text-lime-300"}>X</span></h3>
            <Link to="/" className="hover:text-green-400 transition">Signup</Link>
            <Link to="/signin" className="hover:text-green-400 transition">Signin</Link>
            <Link to="/transactions" className="hover:text-green-400 transition">Transaction Page</Link>
            <Link to="/show_privateKey" className="hover:text-green-400 transition">Show Private Key</Link>
        </nav>
    );
}