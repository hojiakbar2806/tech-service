import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Mail, Lock, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

const schema = z.object({
    method: z.enum(["link", "password"]),
    email: z.string().min(1, "Email kerak").email("Email noto'g'ri"),
    password: z.string().optional(),
}).refine(
    (data) => {
        if (data.method === "password") {
            return data.password && data.password.length > 0;
        }
        return true;
    },
    {
        message: "Parol kerak",
        path: ["password"],
    }
);

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { method: "password" },
    });

    const method = watch("method");

    const loginMutation = useMutation({
        mutationFn: (formData: FormData) =>
            api.post("/auth/login", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            }),
        onSuccess: (res) => {
            toast.success(res.data.message);
            if (res.data.role === "user") navigate("/profile");
            else navigate("/dashboard");
        },
        onError: (err) => {
            if (isAxiosError(err)) toast.error(err?.response?.data?.detail);
            else toast.error("Kirishda xatolik yuz berdi");
        },
    });

    const sendLinkMutation = useMutation({
        mutationFn: (formData: FormData) =>
            api.post("/auth/send-auth-link", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            }),
        onSuccess: (res) => {
            toast.success(res.data.message);
        },
        onError: (err) => {
            if (isAxiosError(err)) toast.error(err?.response?.data?.detail);
            else toast.error("Kirishda xatolik yuz berdi");
        },
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
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl">
                    <CardTitle className="text-3xl font-extrabold text-center text-gray-800 mb-8">
                        Kirish
                    </CardTitle>

                    <div className="flex justify-center gap-3 p-6">
                        <Button
                            type="button"
                            className={`flex-1 cursor-pointer ${method === "link"
                                ? " text-white shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                                }`}
                            onClick={() => setValue("method", "link", { shouldValidate: true })}
                        >
                            Link bilan
                        </Button>
                        <Button
                            type="button"
                            className={`flex-1 cursor-pointer ${method === "password"
                                ? " text-white shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                                }`}
                            onClick={() => setValue("method", "password", { shouldValidate: true })}
                        >
                            Parol bilan
                        </Button>
                    </div>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email manzil
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        className="pl-10 h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="email@example.com"
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1 animate-fadeIn">{errors.email.message}</p>
                                )}
                            </div>

                            {method === "password" && (
                                <div className="space-y-2 animate-fadeIn">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Parol
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            className="pl-10 h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="********"
                                            {...register("password")}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-500 mt-1 animate-fadeIn">{errors.password.message}</p>
                                    )}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="cursor-pointer w-full"
                                disabled={loginMutation.isPending || sendLinkMutation.isPending}
                            >
                                {(method === "password" ? loginMutation.isPending : sendLinkMutation.isPending) ? (
                                    "Yuborilmoqda..."
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Kirish <ArrowRight className="h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-gray-600 mt-4">
                            Hisobingiz yo‘qmi?{" "}
                            <Link
                                to="/auth/register"
                                className="text-indigo-600 font-semibold hover:underline"
                            >
                                Ro‘yxatdan o‘tish
                            </Link>
                        </p>

                        {method === "link" && (
                            <Alert variant="default" className="mt-4 bg-indigo-50 text-indigo-800 border-indigo-200 rounded-lg">
                                <InfoIcon className="h-4 w-4 text-indigo-500" />
                                <AlertTitle className="text-indigo-700 font-medium">Eslatma!</AlertTitle>
                                <AlertDescription className="text-indigo-600 text-sm">
                                    Siz kiritgan emailingizga kirish havolasi yuboriladi. Iltimos, to'g'ri manzil kiriting.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}