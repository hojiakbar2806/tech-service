import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/useSession";
import toast from "react-hot-toast";
import useApi from "@/hooks/useApi";
import type { User } from "@/types/user";
import { AlertCircle, UserIcon, Lock } from "lucide-react";

export default function SettingsPage() {
    const { session, setSession } = useSession();
    const api = useApi();
    const user = session?.user;
    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        old_password: "",
        new_password: "",
    });

    const patchUser = useMutation({
        mutationFn: (data: { [key: string]: string }) => api.patch("/users", data),
        onSuccess: (res) => {
            const userData: User = res?.data;
            if (userData && session) {
                setSession({ token: session.token, user: userData });
            }
            toast.success("Ma'lumotlar yangilandi");
        },
        onError: (res) => {
            if (isAxiosError(res)) {
                toast.error(res?.response?.data?.detail || "Xatolik yuz berdi");
            }
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const updatedFields: { [key: string]: string } = {};
        for (const key in formData) {
            if (key === "old_password" && !formData[key]) {
                continue;
            }
            if (formData[key] && formData[key] !== user?.[key]) {
                updatedFields[key] = formData[key];
            }
        }

        if (updatedFields.new_password && !updatedFields.old_password) {
            toast.error("Yangi parol o'rnatish uchun eski parolni kiriting", { icon: <AlertCircle className="w-4 h-4" /> });
            return;
        }

        if (Object.keys(updatedFields).length === 0) {
            toast("Hech qanday o'zgartirish kiritilmadi", { icon: "⚠️" });
            return;
        }

        patchUser.mutate(updatedFields);
    };

    return (
        <div className="flex-1">
            <div className=" mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                    <UserIcon className="w-8 h-8 text-primary" />
                    Sozlamalar
                </h1>

                <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6">Shaxsiy Ma'lumotlar</h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="first_name" className="text-sm font-semibold text-gray-700">
                                Ism
                            </Label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="Ismingizni kiriting"
                                    className="pl-12 h-12 text-lg border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="last_name" className="text-sm font-semibold text-gray-700">
                                Familiya
                            </Label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Familiyangizni kiriting"
                                    className="pl-12 h-12 text-lg border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl mt-4 font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        Parolni O'zgartirish
                    </h2>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="old_password" className="text-sm font-semibold text-gray-700">
                                Eski Parol
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    id="old_password"
                                    name="old_password"
                                    type="password"
                                    value={formData.old_password}
                                    onChange={handleChange}
                                    placeholder="Eski parolingiz"
                                    className="pl-12 h-12 text-lg border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new_password" className="text-sm font-semibold text-gray-700">
                                Yangi Parol
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    id="new_password"
                                    name="new_password"
                                    type="password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    placeholder="Yangi parolingiz"
                                    className="pl-12 h-12 text-lg border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={patchUser.isPending}
                        className="cursor-pointer mt-4"
                    >
                        {patchUser.isPending ? (
                            "Yangilanmoqda..."
                        ) : (
                            "Ma'lumotlarni Yangilash"
                        )}
                    </Button>
                </section>

            </div>
        </div>
    );
}