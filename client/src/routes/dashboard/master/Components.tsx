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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";

type Component = {
    id: number;
    name: string;
    description: string;
    in_stock: number;
    price: number;
};

const componentSchema = z.object({
    name: z.string().min(1, "Nomi majburiy"),
    description: z.string().min(1, "Tavsif majburiy"),
    in_stock: z.number().min(0, "Soni 0 dan kichik bo‘lmasligi kerak"),
    price: z.number().min(0, "Narx 0 dan kichik bo‘lmasligi kerak"),
});

type FormData = z.infer<typeof componentSchema>;


export default function ComponentsPage() {
    const api = useApi();
    const [modalOpen, setModalOpen] = useState(false);
    const [editComponent, setEditComponent] = useState<Component | null>(null);

    const { data: components = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["components"],
        queryFn: () => api.get("/components"),
        select: (res) => res.data,
    });

    const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(componentSchema),
        defaultValues: {
            name: "",
            description: "",
            in_stock: 0,
            price: 0,
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: FormData) => api.post("/components", data),
        onSuccess: () => {
            toast.success("Komponent muvaffaqiyatli qo‘shildi!");
            setModalOpen(false);
            reset();
            refetch();
        },
        onError: () => {
            toast.error("Komponent qo‘shishda xatolik yuz berdi");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: FormData & { id: number }) => api.patch(`/components/${data.id}`, data),
        onSuccess: () => {
            toast.success("Komponent muvaffaqiyatli yangilandi!");
            setModalOpen(false);
            setEditComponent(null);
            reset();
            refetch();
        },
        onError: () => {
            toast.error("Komponent yangilashda xatolik yuz berdi");
        },
    });

    const onSubmit = (data: FormData) => {
        if (editComponent) {
            updateMutation.mutate({ ...data, id: editComponent.id });
        } else {
            createMutation.mutate(data);
        }
    };

    const openEditModal = (component: Component) => {
        setEditComponent(component);
        reset({
            name: component.name,
            description: component.description,
            in_stock: component.in_stock,
            price: component.price,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditComponent(null);
        reset();
    };

    return (
        <div className="w-full flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Komponentlar</h1>
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="cursor-pointer" onClick={() => setModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Komponent qo‘shish
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editComponent ? "Komponentni tahrirlash" : "Yangi komponent qo‘shish"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nomi</Label>
                                <Input
                                    id="name"
                                    placeholder="Komponent nomini kiriting"
                                    {...register("name")}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="description">Tavsif</Label>
                                <Input
                                    id="description"
                                    placeholder="Komponent tavsifini kiriting"
                                    {...register("description")}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="in_stock">Soni</Label>
                                <Controller
                                    name="in_stock"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            id="in_stock"
                                            type="number"
                                            min="0"
                                            placeholder="Soni kiriting"
                                            value={field.value}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                        />
                                    )}
                                />
                                {errors.in_stock && <p className="text-red-500 text-sm mt-1">{errors.in_stock.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="price">Narx</Label>
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Narx kiriting"
                                            value={field.value}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                        />
                                    )}
                                />
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={closeModal}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    Bekor qilish
                                </Button>
                                <Button
                                    type="submit"
                                    className="cursor-pointer"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {createMutation.isPending || updateMutation.isPending
                                        ? "Saqlanmoqda..."
                                        : editComponent
                                            ? "Yangilash"
                                            : "Qo‘shish"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex-1 overflow-auto rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nomi</TableHead>
                            <TableHead>Tavsif</TableHead>
                            <TableHead>Soni</TableHead>
                            <TableHead>Narx</TableHead>
                            <TableHead>Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    {[...Array(6)].map((__, j) => (
                                        <TableCell key={j}>
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-red-500">
                                    Ma'lumotlarni yuklashda xatolik yuz berdi.
                                </TableCell>
                            </TableRow>
                        ) : components.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Komponentlar topilmadi
                                </TableCell>
                            </TableRow>
                        ) : (
                            components.map((component) => (
                                <TableRow key={component.id} className="hover:bg-muted cursor-pointer">
                                    <TableCell>{component.id}</TableCell>
                                    <TableCell>{component.name}</TableCell>
                                    <TableCell>{component.description}</TableCell>
                                    <TableCell>{component.in_stock}</TableCell>
                                    <TableCell>{component.price}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditModal(component)}
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