import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCheck, InfoIcon } from "lucide-react";
import api from "@/lib/api";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const email = (e.target as HTMLFormElement).email.value.trim();

        if (!email) {
            toast.error("Iltimos, email manzilini kiriting.");
            return;
        }

        const formData = new FormData();
        formData.append("email", email);

        setLoading(true);

        try {
            await toast.promise(
                api.post("/auth/send-auth-link", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                }),
                {
                    loading: "Yuborilmoqda...",
                    success: "Kirish linki emailingizga yuborildi.",
                    error: "Email yuborishda xatolik yuz berdi.",
                }
            );
            setError("");
            setMessage("");

            setMessage("Biz sizga kirish uchun link yubordik. Iltimos, emailingizni tekshiring.");
        } catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.detail || "Tizimda xatolik yuz berdi.");
            } else {
                setError("Noma’lum xatolik yuz berdi.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Kirish</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email manzilingiz</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="email@example.com"
                                disabled={loading}
                            />
                        </div>
                        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                            {loading ? "Yuborilmoqda..." : "Kirish linkini olish"}
                        </Button>
                    </form>

                    {message && (
                        <Alert variant="success" className="mt-4">
                            <CheckCheck className="row-span-2" />
                            <AlertTitle>Muvaffaqiyatli!</AlertTitle>
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="error" className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Xatolik!</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {(!message && !error) &&
                        <Alert variant="info" className="mt-4">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Info!</AlertTitle>
                            <AlertDescription>
                                Biz sizning emailingizga shaxsiy kabinetingizga kirish uchun link yuboramiz.
                                Iltimos to'g'ri email manzilini kiriting.
                            </AlertDescription>
                        </Alert>}
                </CardContent>
            </Card>
        </div>
    );
}
