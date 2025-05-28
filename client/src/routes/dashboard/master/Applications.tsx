import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import useApi from "@/hooks/useApi";
import { getStatus } from "@/components/get-status";
import type { Application } from "@/types/application";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ApplicationModal from "@/components/application-modal";
import { formatDate } from "@/lib/utils";

export default function Applications() {
    const api = useApi();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedStatus = searchParams.get("status") || "all";

    const { data: appsRaw, isPending, isError } = useQuery<Application[]>({
        queryKey: ["applications"],
        queryFn: async () => {
            const [checked, other] = await Promise.all([
                api.get("/repair-requests?status=checked"),
                api.get("/repair-requests/master")
            ]);
            const checkedData = Array.isArray(checked.data) ? checked.data : [];
            const otherData = Array.isArray(other.data) ? other.data : [];
            return [...checkedData, ...otherData];
        },
    });

    const apps = useMemo(() => {
        if (!Array.isArray(appsRaw)) return [];
        return appsRaw.sort((a, b) => b.id - a.id);
    }, [appsRaw]);

    const filteredApps = useMemo(() => {
        if (!Array.isArray(apps)) return [];
        return selectedStatus === "all" ? apps : apps.filter(app => app.status === selectedStatus);
    }, [apps, selectedStatus]);

    const completeMutation = useMutation({
        mutationFn: async (app: Application) => {
            await api.patch(`/repair-requests/${app.id}/as-completed`);
        },
        onSuccess: () => {
            toast.success("Murojaat tugatildi");
            queryClient.invalidateQueries({ queryKey: ["applications"] });
        },
        onError: () => {
            toast.error("Tugatishda xatolik yuz berdi");
        },
    });

    const openModalWithApp = (app: Application) => {
        if (!isPending && app.status === "checked") {
            setSelectedApp(app);
            setOpen(true);
        }
    };

    return (
        <div className="w-full flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Kelgan murojaatlar</h2>
                <Select
                    value={selectedStatus}
                    onValueChange={(value) => setSearchParams({ status: value })}
                >
                    <SelectTrigger className="w-40 cursor-pointer">
                        <SelectValue placeholder="Holatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Holat</SelectLabel>
                            <SelectItem value="all">Hammasi</SelectItem>
                            <SelectItem value="checked">Tekshirilgan</SelectItem>
                            <SelectItem value="approved">Tasdiqlangan</SelectItem>
                            <SelectItem value="in_progress">Jarayonda</SelectItem>
                            <SelectItem value="completed">Tugatildi</SelectItem>
                            <SelectItem value="cancelled">Bekor qilindi</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 overflow-auto rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-100">
                            <TableHead className="p-2 px-6">Id</TableHead>
                            <TableHead className="p-2 px-6">Murojat egasi</TableHead>
                            <TableHead className="p-2 px-6">Model</TableHead>
                            <TableHead className="p-2 px-6">Muammo turi</TableHead>
                            <TableHead className="p-2 px-6">Holati</TableHead>
                            <TableHead className="p-2 px-6">Yaratilgan vaqti</TableHead>
                            <TableHead className="p-2 px-6">Amal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    {[...Array(7)].map((__, j) => (
                                        <TableCell key={j} className="p-2 px-6">
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-red-500 p-4">
                                    Ma‘lumotlarni yuklashda xatolik yuz berdi.
                                </TableCell>
                            </TableRow>
                        ) : filteredApps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center p-4">
                                    Murojaatlar topilmadi
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredApps.map((app) => (
                                <TableRow
                                    key={app.id}
                                    className={app.status === "checked" ? "hover:bg-slate-50 cursor-pointer" : "cursor-default"}
                                    onClick={() => openModalWithApp(app)}
                                >
                                    <TableCell className="p-2 px-6 whitespace-nowrap">{app.id}</TableCell>
                                    <TableCell className="p-2 px-6 whitespace-nowrap">{app.owner?.email}</TableCell>
                                    <TableCell className="p-2 px-6 whitespace-nowrap">{app.device_model}</TableCell>
                                    <TableCell className="p-2 px-6 whitespace-nowrap">
                                        {app.issue_type === "hardware" ? "Qurilma" : "Dasturiy ta'minot"}
                                    </TableCell>
                                    <TableCell className="p-2 px-6 whitespace-nowrap">{getStatus(app.status)}</TableCell>
                                    <TableCell className="p-2 px-6 whitespace-nowrap">
                                        {formatDate(app.created_at)}
                                    </TableCell>
                                    <TableCell className="p-2 px-6 whitespace-nowrap">
                                        {app.status === "in_progress" ? (
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    completeMutation.mutate(app);
                                                }}
                                                className="cursor-pointer bg-blue-500 hover:bg-blue-600"
                                                disabled={completeMutation.isPending}
                                            >
                                                Tugatish
                                            </Button>
                                        ) : "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ApplicationModal
                open={open}
                setOpen={setOpen}
                selectedApp={selectedApp}
                refetch={() => queryClient.invalidateQueries({ queryKey: ["applications"] })}
            />
        </div>
    );
}
