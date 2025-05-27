import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import type { Application } from "@/types/application";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedApp: Application | null;
    refetch: () => void;
};

type Component = {
    id: number;
    name?: string;
    in_stock: number;
};

const ApplicationModal = ({ open, setOpen, selectedApp, refetch }: Props) => {
    const [price, setPrice] = useState("");
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedComponents, setSelectedComponents] = useState<{ id: number; quantity: number }[]>([]);

    const { data: components = [], isLoading: isComponentsLoading } = useQuery<Component[]>({
        queryKey: ["components"],
        queryFn: () => api.get("/components").then((res) => res.data),
        enabled: open,
    });

    useEffect(() => {
        if (open) {
            setPrice("");
            setEndDate(null);
            setSelectedComponents([]);
        }
    }, [open]);

    const addComponent = () => {
        setSelectedComponents((prev) => [...prev, { id: 0, quantity: 1 }]);
    };

    const handleComponentChange = (index: number, field: "id" | "quantity", value: string) => {
        const newComponents = [...selectedComponents];
        if (field === "id") {
            newComponents[index].id = Number(value);
        } else if (field === "quantity") {
            newComponents[index].quantity = Number(value);
        }
        setSelectedComponents(newComponents);
    };

    const mutation = useMutation({
        mutationFn: (data: { price: number; end_date: string; components: { id: number; quantity: number }[] }) =>
            api.patch(`/repair-requests/${selectedApp?.id}/personalize-order`, data),
        onSuccess: (res) => {
            toast.success(res?.data?.message || "Murojaat muvaffaqiyatli qabul qilindi");
            setOpen(false);
        },
        onError: () => toast.error("Murojaat qabul qilishda xatolik yuz berdi"),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!endDate || !price) return;

        for (const { id, quantity } of selectedComponents) {
            const component = components.find((c) => c.id === id);
            if (component && quantity > component.in_stock) {
                toast.error(`ID ${id} komponent uchun mavjud miqdor: ${component.in_stock}, tanlangan: ${quantity}`);
                return;
            }
        }

        const data = {
            price: Number(price),
            end_date: endDate.toISOString(),
            components: selectedComponents.length > 0 ? selectedComponents : [{ id: 0, quantity: 0 }],
        };

        await mutation.mutateAsync(data);
        refetch();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg w-full max-h-5/6 overflow-auto">
                <DialogHeader>
                    <DialogTitle>Murojaat ID: {selectedApp?.id}</DialogTitle>
                    <DialogDescription>
                        {selectedApp?.owner?.email || "Noma'lum"} — {selectedApp?.device_model}
                    </DialogDescription>
                </DialogHeader>

                <section className="mb-4 p-2 rounded bg-slate-100 space-y-2">
                    <p><span className="font-semibold">Murojaat egasi:</span> {selectedApp?.owner?.email || "Noma'lum"}</p>
                    <p><span className="font-semibold">Model:</span> {selectedApp?.device_model}</p>
                    <p><span className="font-semibold">Muammo turi:</span> {selectedApp?.issue_type === "hardware" ? "Qurilma" : "Dasturiy ta'minot"}</p>
                    {selectedApp?.description && <p><span className="font-semibold">Tavsif:</span> {selectedApp?.description}</p>}
                </section>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="price">Narx</Label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            placeholder="Narx kiriting"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <Label htmlFor="endDate">Tugash sanasi</Label>
                        <DatePicker
                            id="endDate"
                            selected={endDate}
                            onChange={(date: Date | null) => setEndDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeCaption="Vaqt"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholderText="Sanani va vaqtni tanlang"
                            required
                        />
                    </div>

                    <div>
                        <Label>Komponentlar</Label>
                        {isComponentsLoading ? (
                            <p className="text-gray-500">Yuklanmoqda...</p>
                        ) : (
                            <>
                                {selectedComponents.map((comp, index) => {
                                    const selectedIds = selectedComponents.map((c) => c.id);
                                    const currentComponent = components.find((c) => c.id === comp.id);

                                    return (
                                        <div key={index} className="flex gap-2 mt-2 items-start">
                                            <div className="flex-1 space-y-1">
                                                <Label>
                                                    {currentComponent?.name} — mavjud: {currentComponent?.in_stock}
                                                </Label>
                                                <div className="flex gap-2 items-center">
                                                    <Select
                                                        value={String(comp.id)}
                                                        onValueChange={(val) => handleComponentChange(index, "id", val)}
                                                    >
                                                        <SelectTrigger className="flex-1 ">
                                                            <SelectValue placeholder="Komponent tanlang" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {components.map((c) => (
                                                                <SelectItem
                                                                    key={c.id}
                                                                    value={String(c.id)}
                                                                    disabled={selectedIds.includes(c.id) && c.id !== comp.id}
                                                                >
                                                                    {c.name} (stock: {c.in_stock})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        className="w-24"
                                                        value={comp.quantity}
                                                        onChange={(e) => handleComponentChange(index, "quantity", e.target.value)}
                                                    />

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="text-red-500"
                                                        onClick={() =>
                                                            setSelectedComponents((prev) =>
                                                                prev.filter((_, i) => i !== index)
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <Button type="button" onClick={addComponent} className="mt-2 cursor-pointer" variant="outline">
                                    + Qo‘shish
                                </Button>
                            </>
                        )}
                    </div>


                    <Button
                        type="submit"
                        disabled={mutation.isPending || isComponentsLoading}
                        className="w-full cursor-pointer"
                    >
                        {mutation.isPending ? "Yuklanmoqda..." : "Qabul qilish"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ApplicationModal;
