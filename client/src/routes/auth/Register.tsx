import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom"; // Fixed import to match React Router v6
import toast from "react-hot-toast";
import { User, Mail, Lock, Briefcase } from "lucide-react"; // Added icons for first_name, last_name, company_name
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { isAxiosError } from "axios";
import { SiteHeader } from "@/components/site-header";

const schema = z.object({
    first_name: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo‘lishi kerak"),
    last_name: z.string().min(2, "Familiya kamida 2 ta belgidan iborat bo‘lishi kerak"),
    email: z.string().email("Email noto‘g‘ri"),
    password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak"),
    is_legal_entity: z.boolean().optional(),
    company_name: z.string().optional(), // boshida optional
    terms: z.boolean().refine((val) => val === true, "Foydalanish shartlariga rozilik kerak"),
}).refine(
    (data) => {
        if (data.is_legal_entity) {
            return data.company_name && data.company_name.length >= 2;
        }
        return true;
    },
    {
        message: "Kompaniya nomi majburiy",
        path: ["company_name"],
    }
);

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            is_legal_entity: false,
            company_name: "",
            terms: false,
        },
    });

    const isLegalEntity = watch("is_legal_entity");

    const registerMutation = useMutation({
        mutationFn: (data: FormValues) => api.post("/auth/register", data),
        onSuccess: (res) => {
            toast.success(res.data.message || "Ro‘yxatdan o‘tish muvaffaqiyatli");
            if (res.data.role === "user") {
                navigate("/profile");
            } else {
                navigate("/dashboard");
            }
        },
        onError: (err) => {
            if (isAxiosError(err)) toast.error(err?.response?.data?.detail);
            else toast.error("Ro‘yxatdan o‘tishda xatolik yuz berdi");
        },
    });

    const onSubmit = (data: FormValues) => {
        registerMutation.mutate(data);
    };

    return (
        <>
            <SiteHeader />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl">
                    <CardTitle className="text-3xl font-extrabold text-center text-gray-800">
                        Ro‘yxatdan o‘tish
                    </CardTitle>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                                    Ism
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="first_name"
                                        className="pl-10 h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="Ismingiz"
                                        {...register("first_name")}
                                    />
                                </div>
                                {errors.first_name && (
                                    <p className="text-sm text-red-500 mt-1 animate-fadeIn">{errors.first_name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                                    Familiya
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="last_name"
                                        className="pl-10 h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="Familiyangiz"
                                        {...register("last_name")}
                                    />
                                </div>
                                {errors.last_name && (
                                    <p className="text-sm text-red-500 mt-1 animate-fadeIn">{errors.last_name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email
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

                            <div className="space-y-2">
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

                            <div className="flex items-center space-x-3">
                                <Controller
                                    name="is_legal_entity"
                                    control={control}
                                    render={({ field }) => (
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={field.value}
                                            onClick={() => field.onChange(!field.value)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${field.value ? "bg-indigo-600" : "bg-gray-200"
                                                }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${field.value ? "translate-x-5" : "translate-x-0"
                                                    }`}
                                            />
                                        </button>
                                    )}
                                />
                                <Label htmlFor="is_legal_entity" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                    Yuridik shaxsman
                                </Label>
                            </div>

                            {isLegalEntity && (
                                <div className="space-y-2 animate-fadeIn">
                                    <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">
                                        Kompaniya nomi
                                    </Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="company_name"
                                            className="pl-10 h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="Kompaniya nomingiz"
                                            {...register("company_name")}
                                        />
                                    </div>
                                    {errors.company_name && (
                                        <p className="text-sm text-red-500 mt-1 animate-fadeIn">{errors.company_name.message}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="terms"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all"
                                        />
                                    )}
                                />
                                <Label htmlFor="terms" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                    Foydalanish shartlariga roziman
                                </Label>
                            </div>
                            {errors.terms && (
                                <p className="text-sm text-red-500 mt-1 animate-fadeIn">{errors.terms.message}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={registerMutation.isPending}
                                className="w-full cursor-pointer"
                            >
                                {registerMutation.isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Yuborilmoqda...
                                    </span>
                                ) : (
                                    "Ro‘yxatdan o‘tish"
                                )}
                            </Button>

                            <p className="text-center text-sm text-gray-600 mt-4">
                                Allaqachon ro‘yxatdan o‘tganmisiz?{" "}
                                <Link to="/auth/login" className="text-indigo-600 font-semibold hover:underline">
                                    Kirish
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}