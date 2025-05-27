import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useApi from "@/hooks/useApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil } from "lucide-react";

type User = {
    id: number;
    first_name?: string;
    last_name?: string;
    email: string;
    role: string;
    created_at?: string;
    updated_at?: string;
};

const userSchema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email("Email formati noto‘g‘ri").min(1, "Email majburiy"),
    password: z.string().min(6, "Parol kamida 6 ta belgi bo‘lishi kerak"),
    role: z.string().min(1, "Rol majburiy"),
});

type FormData = z.infer<typeof userSchema>;


export default function UsersPage() {
    const api = useApi();
    const [modalOpen, setModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("all");

    const { data: users = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["users"],
        queryFn: () => api.get("/users"),
        select: (data) => data.data as User[],
    });

    const filteredUsers =
        selectedRole === "all" ? users : users.filter((user) => user.role === selectedRole);

    const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            role: "",
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: FormData) => api.post("/users", data),
        onSuccess: () => {
            toast.success("Foydalanuvchi muvaffaqiyatli qo‘shildi!");
            setModalOpen(false);
            reset();
            refetch();
        },
        onError: () => {
            toast.error("Foydalanuvchi qo‘shishda xatolik yuz berdi");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: FormData & { id: number }) => api.patch(`/users/${data.id}`, data),
        onSuccess: () => {
            toast.success("Foydalanuvchi muvaffaqiyatli yangilandi!");
            setModalOpen(false);
            setEditUser(null);
            reset();
            refetch();
        },
        onError: () => {
            toast.error("Foydalanuvchi yangilashda xatolik yuz berdi");
        },
    });

    const onSubmit = (data: FormData) => {
        if (editUser) {
            updateMutation.mutate({ ...data, id: editUser.id });
        } else {
            createMutation.mutate(data);
        }
    };

    const openEditModal = (user: User) => {
        setEditUser(user);
        reset({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email,
            role: user.role,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditUser(null);
        reset();
    };

    const displayValue = (value?: string) =>
        value ? value : <span className="text-gray-400">To‘ldirilmagan</span>;

    const displayDate = (dateStr?: string) =>
        dateStr
            ? new Date(dateStr).toLocaleString("uz-UZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : <span className="text-gray-400">To‘ldirilmagan</span>;

    const roles = ["all", "user", "master", "manager"];

    return (
        <div className="w-full flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Foydalanuvchilar</h2>
                <div className="flex gap-4">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className=" cursor-pointer">
                            <SelectValue placeholder="Rol bo‘yicha filtr" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role} value={role} className="cursor-pointer">
                                    {role === "all" ? "Hammasi" : role.charAt(0).toUpperCase() + role.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="cursor-pointer ">
                                <Plus className="h-4 w-4" />
                                Qo‘shish
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg w-full bg-white p-4 rounded-lg shadow-lg">
                            <header className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editUser ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi qo‘shish"}
                                </h3>
                            </header>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                        Ism
                                    </Label>
                                    <Input
                                        id="first_name"
                                        placeholder="Ismingizni kiriting"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        {...register("first_name")}
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                    />
                                    {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                        Familiya
                                    </Label>
                                    <Input
                                        id="last_name"
                                        placeholder="Familiyangizni kiriting"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        {...register("last_name")}
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                    />
                                    {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Emailingizni kiriting"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        {...register("email")}
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Rol
                                    </Label>
                                    <Controller
                                        name="role"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={createMutation.isPending || updateMutation.isPending}
                                            >
                                                <SelectTrigger className="mt-1 block w-full rounded-md border border-gray-300">
                                                    <SelectValue placeholder="Rolni tanlang" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="master">Texnik</SelectItem>
                                                    <SelectItem value="manager">Menejer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeModal}
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        className="cursor-pointer"
                                    >
                                        Bekor qilish
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        className="cursor-pointer "
                                    >
                                        {createMutation.isPending || updateMutation.isPending
                                            ? "Saqlanmoqda..."
                                            : editUser
                                                ? "Yangilash"
                                                : "Qo‘shish"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 overflow-auto rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-100">
                            <TableHead className="p-2 px-6">ID</TableHead>
                            <TableHead className="p-2 px-6">Ism</TableHead>
                            <TableHead className="p-2 px-6">Familiya</TableHead>
                            <TableHead className="p-2 px-6">Email</TableHead>
                            <TableHead className="p-2 px-6">Rol</TableHead>
                            <TableHead className="p-2 px-6">Yaratilgan</TableHead>
                            <TableHead className="p-2 px-6">Yangilangan</TableHead>
                            <TableHead className="p-2 px-6">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    {[...Array(8)].map((__, j) => (
                                        <TableCell key={j} className="p-2 px-6">
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-red-500 p-4">
                                    Ma‘lumotlarni yuklashda xatolik yuz berdi.
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center p-4">
                                    Foydalanuvchilar topilmadi
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-slate-50">
                                    <TableCell className="p-2 px-6">{user.id}</TableCell>
                                    <TableCell className="p-2 px-6">{displayValue(user.first_name)}</TableCell>
                                    <TableCell className="p-2 px-6">{displayValue(user.last_name)}</TableCell>
                                    <TableCell className="p-2 px-6">{displayValue(user.email)}</TableCell>
                                    <TableCell className="p-2 px-6">{displayValue(user.role)}</TableCell>
                                    <TableCell className="p-2 px-6">{displayDate(user.created_at)}</TableCell>
                                    <TableCell className="p-2 px-6">{displayDate(user.updated_at)}</TableCell>
                                    <TableCell className="p-2 px-6">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditModal(user)}
                                            className="cursor-pointer"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}