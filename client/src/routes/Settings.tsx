import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/hooks/useSession";
import toast from "react-hot-toast";
import useApi from "@/hooks/useApi";
import type { User } from "@/types/user";

export default function SettingsPage() {
    const { session, setSession } = useSession();
    const api = useApi()
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
            const userData: User = res?.data
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
        const updatedFields = {};
        for (const key in formData) {
            if (formData[key] && formData[key] !== user?.[key]) {
                updatedFields[key] = formData[key];
            }
        }
        if (Object.keys(updatedFields).length === 0) {
            toast("Hech qanday o'zgartirish kiritilmadi", { icon: "⚠️" });
            return;
        }
        patchUser.mutate(updatedFields);
    };

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-6">
                Foydalanuvchi Sozlamalari
            </h1>
            <Card className="shadow-md border border-gray-200">
                <CardContent className="flex flex-col items-start gap-6 p-8">
                    <Input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Ism"
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Familiya"
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Input
                        name="old_password"
                        type="password"
                        value={formData.old_password}
                        onChange={handleChange}
                        placeholder="Eski parol"
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Input
                        name="new_password"
                        type="password"
                        value={formData.new_password}
                        onChange={handleChange}
                        placeholder="Yangi parol"
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={patchUser.isPending}
                        className="cursor-pointer"
                    >
                        Yangilash
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
