import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Mail, Lock, ArrowRight } from 'lucide-react';
import { SiteHeader } from "@/components/site-header";

const schema = z.object({
    method: z.enum(["link", "password"]),
    email: z.string().min(1, "Email kerak").email("Email noto'g'ri"),
    password: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
    const [method, setMethod] = useState<"link" | "password">("link");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { method: "link" }
    });

    const loginMutation = useMutation({
        mutationFn: (formData: FormData) => api.post("/auth/login", formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        ),
        onSuccess: (res) => {
            toast.success(res.data.message);
            if (res.data.role === "user") navigate("/profile");
            else navigate("/dashboard");
        },
        onError: (err) => {
            if (isAxiosError(err)) toast.error(err?.response?.data?.detail);
            else toast.error("Kirishda xatolik yuz berdi");
        }
    });

    const sendLinkMutation = useMutation({
        mutationFn: (formData: FormData) => api.post("/auth/send-auth-link", formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        ),
        onSuccess: (res) => {
            toast.success(res.data.message)
        },
        onError: (err) => {
            if (isAxiosError(err)) toast.error(err?.response?.data?.detail);
            else toast.error("Kirishda xatolik yuz berdi");
        }
    });

    const onSubmit = (data: FormValues) => {
        const formData = new FormData();
        if (data.method === "link") {
            formData.append("email", data.email);
            sendLinkMutation.mutate(formData);

        } else {
            formData.append("username", data.email);
            formData.append("password", data.password || "");
            loginMutation.mutate(formData);
        }
    };

    return (
        <>
            <SiteHeader />
            <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="w-full max-w-md">
                    <Card className="w-full shadow-xl border-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl" />

                        <CardTitle className="text-2xl font-bold text-center">Kirish</CardTitle>

                        <CardContent className="relative space-y-6">
                            <div className="w-full flex justify-center gap-2 p-1 bg-muted rounded-lg">
                                <Button
                                    type="button"
                                    variant={method === "link" ? "default" : "ghost"}
                                    className={`flex-1 cursor-pointer rounded-md transition-all duration-300 ${method === "link" ? "shadow-sm" : ""}`}
                                    onClick={() => {
                                        setValue("method", "link")
                                        setMethod("link")
                                    }}
                                >
                                    Link bilan
                                </Button>
                                <Button
                                    type="button"
                                    variant={method === "password" ? "default" : "ghost"}
                                    className={`flex-1 cursor-pointer rounded-md transition-all duration-300 ${method === "password" ? "shadow-sm" : ""}`}
                                    onClick={() => {
                                        setValue("method", "password")
                                        setMethod("password")
                                    }}
                                >
                                    Parol bilan
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email manzil
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            className="pl-10 h-11 border-muted-foreground/20 focus-visible:ring-primary/50"
                                            placeholder="email@example.com"
                                            {...register("email")}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-destructive mt-1 animate-fadeIn">{errors.email.message}</p>
                                    )}
                                </div>

                                {method === "password" && (
                                    <div className="space-y-2 animate-fadeIn">
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            Parol
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                className="pl-10 h-11 border-muted-foreground/20 focus-visible:ring-primary/50"
                                                placeholder="********"
                                                {...register("password", {
                                                    required: method === "password" ? "Parol kerak" : false
                                                })}
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-destructive mt-1 animate-fadeIn">{errors.password.message}</p>
                                        )}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer"
                                    disabled={loginMutation.isPending || sendLinkMutation.isPending}
                                >
                                    {(method === "password"
                                        ? loginMutation.isPending
                                        : sendLinkMutation.isPending)
                                        ? "Yuborilmoqda..."
                                        : (
                                            <span className="flex items-center justify-center gap-2">
                                                Kirish <ArrowRight className="h-4 w-4" />
                                            </span>
                                        )}
                                </Button>
                            </form>

                            {method === "link" && (
                                <Alert variant="default" className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
                                    <InfoIcon className="h-4 w-4 text-blue-500" />
                                    <AlertTitle className="text-blue-700 font-medium">Eslatma!</AlertTitle>
                                    <AlertDescription className="text-blue-600">
                                        Siz kiritgan emailingizga kirish havolasi yuboriladi. Iltimos, to'g'ri manzil kiriting.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
