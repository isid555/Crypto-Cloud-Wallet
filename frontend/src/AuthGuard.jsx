import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AuthGuard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const publicKey = localStorage.getItem("publicKey");

        if (!token || ! publicKey) {

                alert("You need to sign up or log in to continue.");



            // Delay navigation slightly to prevent blocking UI updates
            setTimeout(() => {
                navigate("/");
            }, 100);
        }
    }, [navigate]);

    return null;
}
