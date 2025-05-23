import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useApi from "@/hooks/useApi";
import type { User } from "@/types/user";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plus, X } from "lucide-react";

const schema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z
        .string({ required_error: "Email majburiy" })
        .email("Email formati noto'g'ri"),
    password: z
        .string({ required_error: "Parol majburiy" })
        .min(6, "Kamida 6 ta belgi bo'lishi kerak"),
    role: z.string(),
});

type FormData = z.infer<typeof schema>;

const fetchUsers = async (api: ReturnType<typeof useApi>) => {
    const res = await api.get("users");
    return res.data as User[];
};

export default function UsersPage() {
    const api = useApi();

    const [modalOpen, setModalOpen] = useState(false);

    const [selectedRole, setSelectedRole] = useState<string>("all");

    const {
        data: users = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["users"],
        queryFn: () => fetchUsers(api),
    });

    const filteredUsers =
        selectedRole === "all"
            ? users
            : users.filter((user) => user.role === selectedRole);

    const displayValue = (value: string | null | undefined) => {
        return value ? (
            <span>{value}</span>
        ) : (
            <span className="text-gray-400">To'ldirilmagan</span>
        );
    };

    const displayDate = (dateStr: string | null | undefined) => {
        if (!dateStr)
            return <span className="text-black font-semibold">To'ldirilmagan</span>;
        return <span>{
            new Date(dateStr).toLocaleString("uz-UZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })}
        </span>;
    };

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: (data: FormData) => api.post("/users", data),
        onSuccess: () => {
            toast.success("Foydalanuvchi muvaffaqiyatli yaratildi!");
            reset();
            setModalOpen(false)
            refetch()
        },
        onError: () => {
            toast.error("So'rov yuborishda xatolik yuz berdi");
        },
    });

    const onSubmit = (data: FormData) => mutation.mutate(data);

    const roles = ["all", "user", "master", "manager"];

    return (
        <div className="w-full mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>

                <div className="flex gap-5">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Role bo'yicha filtr" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role} value={role} className="cursor-pointer">
                                    {role === "all"
                                        ? "Hammasi"
                                        : role.charAt(0).toUpperCase() + role.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        className="cursor-pointer"
                        onClick={() => setModalOpen(true)}
                        aria-label="Foydalanuvchi qo'shish"
                        title="Foydalanuvchi qo'shish"
                    >
                        <Plus className="size-5" />
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-auto border rounded-xl">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 sticky top-0 z-10">
                            <th className="p-2 px-6 text-left border-b">ID</th>
                            <th className="p-2 px-6 text-left border-b">Ism</th>
                            <th className="p-2 px-6 text-left border-b">Familiya</th>
                            <th className="p-2 px-6 text-left border-b">Email</th>
                            <th className="p-2 px-6 text-left border-b">Role</th>
                            <th className="p-2 px-6 text-left border-b min-w-48">Created At</th>
                            <th className="p-2 px-6 text-left border-b min-w-48">Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {[...Array(7)].map((__, j) => (
                                        <td key={j} className="p-2 px-6 border-b">
                                            <div className="h-4 bg-gray-300 rounded w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : isError ? (
                            <tr>
                                <td colSpan={7} className="text-center text-red-500 p-4">
                                    Ma'lumotlarni yuklashda xatolik yuz berdi.
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center p-4">
                                    Foydalanuvchilar topilmadi
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="p-2 px-6 border-b">{user.id ?? <span className="font-semibold text-black">To'ldirilmagan</span>}</td>
                                    <td className="p-2 px-6 border-b">{displayValue(user.first_name)}</td>
                                    <td className="p-2 px-6 border-b">{displayValue(user.last_name)}</td>
                                    <td className="p-2 px-6 border-b">{displayValue(user.email)}</td>
                                    <td className="p-2 px-6 border-b">{displayValue(user.role)}</td>
                                    <td className="p-2 px-6 border-b">{displayDate(user.created_at)}</td>
                                    <td className="p-2 px-6 border-b">{displayDate(user.updated_at)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div
                role="dialog"
                aria-modal="true"
                data-open={modalOpen}
                className="fixed inset-0 opacity-0 pointer-events-none bg-black/50 bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300
                data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto"
            >


                <Card className="relative max-w-2xl w-full">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Foydalanuvchi qo'shish</CardTitle>
                        <Button
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={() => setModalOpen(false)}
                        >
                            <X />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                            <div>
                                <Label className="mb-2" htmlFor="first_name">
                                    Ism
                                </Label>
                                <Input
                                    id="first_name"
                                    placeholder="Ismingizni kiriting"
                                    {...register("first_name")}
                                    disabled={mutation.isPending}
                                    aria-invalid={errors.first_name ? "true" : "false"}
                                />
                                {errors.first_name && (
                                    <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-2" htmlFor="last_name">
                                    Familiya
                                </Label>
                                <Input
                                    id="last_name"
                                    placeholder="Familiyangizni kiriting"
                                    {...register("last_name")}
                                    disabled={mutation.isPending}
                                    aria-invalid={errors.last_name ? "true" : "false"}
                                />
                                {errors.last_name && (
                                    <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-2" htmlFor="email">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Emailingizni kiriting"
                                    {...register("email")}
                                    disabled={mutation.isPending}
                                    aria-invalid={errors.email ? "true" : "false"}
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-2" htmlFor="password">
                                    Parol
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Kamida 6 ta belgi"
                                    {...register("password")}
                                    disabled={mutation.isPending}
                                    aria-invalid={errors.password ? "true" : "false"}
                                />
                                {errors.password && (
                                    <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-2" htmlFor="role">
                                    Rol
                                </Label>
                                <Controller
                                    name="role"
                                    control={control}
                                    rules={{ required: "Rol majburiy" }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={mutation.isPending}
                                            >
                                                <SelectTrigger id="role" className="w-full">
                                                    <SelectValue placeholder="Rolni tanlang" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="master">Texnik</SelectItem>
                                                    <SelectItem value="user">User</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                                {errors.role && (
                                    <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
                                )}
                            </div>

                            <Button type="submit" disabled={mutation.isPending} className="w-full">
                                {mutation.isPending ? "Yaratilmoqda..." : "Foydalanuvchi yaratish"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
