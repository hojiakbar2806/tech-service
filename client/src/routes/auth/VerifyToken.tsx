import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerifyToken = () => {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Token topilmadi.");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`http://localhost:8000/auth/verify/${token}`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (res.ok) {
                    setStatus("success");
                    navigate("/profile");
                } else {
                    const data = await res.json();
                    setStatus("error");
                    setMessage(data?.detail.message || "Token noto‘g‘ri yoki eskirgan.");
                }
            } catch (error){
                console.log(error);
                setStatus("error");
                setMessage("Server bilan aloqa yo‘q.");
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
                {status === "loading" && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-blue-500 font-semibold">Tekshirilmoqda...</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <div className="text-green-500 text-4xl mb-2">✓</div>
                        <p className="text-green-600 font-semibold">Muvaffaqiyatli tasdiqlandi. Yo‘naltirilmoqda...</p>
                    </>
                )}
                {status === "error" && (
                    <>
                        <div className="text-red-500 text-4xl mb-2">✕</div>
                        <p className="text-red-600 font-semibold">{message}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyToken;
