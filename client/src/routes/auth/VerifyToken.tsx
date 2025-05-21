import { useSession } from "@/hooks/useSession"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const VerifyToken = () => {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("")
    const { setSession } = useSession()
    const { token } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Token topilmadi.")
            return
        }

        const verify = async () => {
            setSession(null)
            try {
                const res = await fetch(`http://localhost:8000/auth/verify/${token}`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                })
                await new Promise((resolve) => setTimeout(resolve, 1000))
                if (res.ok) {
                    setStatus("success")
                    setTimeout(() => navigate("/profile"), 1000)
                } else {
                    const data = await res.json()
                    setStatus("error")
                    setMessage(data?.detail.message || "Token noto'g'ri yoki eskirgan.")
                }
            } catch (error) {
                console.log(error)
                setStatus("error")
                setMessage("Server bilan aloqa yo'q.")
            }
        }

        verify()
    }, [token, navigate, setSession])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <Card className="max-w-md w-full border-0 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl" />

                <CardHeader className="relative space-y-1 pb-2">
                    <CardTitle className="text-2xl font-bold text-center">
                        {status === "loading" && "Token tekshirilmoqda"}
                        {status === "success" && "Muvaffaqiyatli tasdiqlandi"}
                        {status === "error" && "Xatolik yuz berdi"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="relative flex flex-col items-center justify-center pt-6 pb-8">
                    {status === "loading" && (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full blur-md bg-primary/20 animate-pulse"></div>
                                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                            </div>
                            <p className="text-muted-foreground text-center mt-4">
                                Tokeningiz tekshirilmoqda, iltimos kuting...
                            </p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center space-y-4 animate-fadeIn">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full blur-md bg-green-100 animate-pulse"></div>
                                <CheckCircle className="h-16 w-16 text-green-500" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-green-600 font-medium">Muvaffaqiyatli tasdiqlandi!</p>
                                <p className="text-muted-foreground">Profilingizga yo'naltirilmoqdasiz...</p>
                            </div>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center space-y-4 animate-fadeIn">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full blur-md bg-red-100 animate-pulse"></div>
                                <XCircle className="h-16 w-16 text-red-500" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-red-600 font-medium">Xatolik yuz berdi</p>
                                <p className="text-muted-foreground">{message}</p>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="relative flex justify-center pb-6">
                    {status === "error" && (
                        <div className="space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/login")}
                                className="border-primary/20 hover:bg-primary/5 hover:text-primary"
                            >
                                Kirish sahifasiga qaytish
                            </Button>
                            <Button
                                onClick={() => navigate("/")}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Bosh sahifaga
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

export default VerifyToken
