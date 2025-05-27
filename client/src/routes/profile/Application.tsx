import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import useApi from "@/hooks/useApi";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    BadgeAlert,
    BadgeInfo,
    DollarSign,
    Info,
    Laptop,
    MapPin,
    UserIcon,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Application } from "@/types/application";
import { STATUS_OPTIONS } from "@/lib/const";
import { getStatus } from "@/components/get-status";
import { formatDate } from "@/lib/utils";


export default function ApplicationsPage() {
    const api = useApi();
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["my-applications"],
        queryFn: () => api.get("/repair-requests/me"),
        select: (data) => data.data as Application[],
    });

    const approve = useMutation({
        mutationFn: (id: number) => api.post(`/repair-requests/${id}/as-in-progress`),
        onSuccess: () => {
            toast.success("Murojaat tasdiqlandi");
            refetch();
        },
        onError: () => {
            toast.error("Tasdiqlashda xatolik");
        },
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const statusFromParams = searchParams.get("status") || "all";
    const [statusFilter, setStatusFilter] = useState(statusFromParams);

    useEffect(() => {
        setStatusFilter(statusFromParams);
    }, [statusFromParams]);

    const onStatusChange = (value: string) => {
        setStatusFilter(value);
        if (value === "all") {
            searchParams.delete("status");
        } else {
            searchParams.set("status", value);
        }
        setSearchParams(searchParams);
    };

    const filteredApps = data?.filter((app) =>
        statusFilter === "all" ? true : app.status === statusFilter
    );

    const handleApprove = async (id: number) => {
        await approve.mutateAsync(id);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-gray-900">Murojaatlaringiz</h2>
                <Select onValueChange={onStatusChange} value={statusFilter}>
                    <SelectTrigger className="w-48 border border-gray-300 shadow-sm">
                        <SelectValue placeholder="Holat filtri" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="rounded-xl border shadow animate-pulse bg-gray-50">
                            <CardHeader className="p-4 bg-white border-b">
                                <Skeleton className="h-5 w-3/4 mb-1" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                {[...Array(5)].map((_, j) => (
                                    <Skeleton key={j} className="h-4 w-full" />
                                ))}
                                <Skeleton className="h-8 w-1/2 mt-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredApps?.length === 0 ? (
                <Alert className="mt-6 border border-gray-200 bg-white">
                    <Info className="w-5 h-5 mr-2 text-blue-500" />
                    <AlertTitle className="text-gray-900">Ma’lumot yo‘q</AlertTitle>
                    <AlertDescription className="text-gray-600">
                        {statusFilter === "all"
                            ? "Murojaatlar mavjud emas."
                            : "Bu holatda murojaat topilmadi."}
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
                    {filteredApps?.map((app) => (
                        <Card key={app.id} className="rounded-xl shadow hover:shadow-lg transition bg-white border">
                            <CardHeader className="p-4 bg-gray-50 border-b">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <Laptop className="w-5 h-5 text-blue-500" />
                                        {app.device_model}
                                    </CardTitle>
                                    {getStatus(app.status)}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {formatDate(app.created_at)}
                                </p>
                            </CardHeader>
                            <CardContent className="p-4 text-sm space-y-3 text-gray-700">
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-4 h-4 text-gray-400" />
                                    <span><strong>Texnik:</strong> {app.master?.email ?? "Ma’lumot kiritilmagan"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BadgeAlert className="w-4 h-4 text-gray-400" />
                                    <span><strong>Muammo:</strong> {app.issue_type === "hardware" ? "Qurilma" : "Dasturiy ta'minot"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BadgeInfo className="w-4 h-4 text-gray-400" />
                                    <span><strong>Soha:</strong> {app.problem_area ?? "Ma’lumot kiritilmagan"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                    <span><strong>Narx:</strong> {app.price ?? "Ma’lumot kiritilmagan"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span><strong>Manzil:</strong> {app.location ?? "Ma’lumot kiritilmagan"}</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Tavsif:</p>
                                    <p className="text-gray-600 mt-1">{app.description ?? "Ma’lumot kiritilmagan"}</p>
                                </div>

                                {app.status === "approved" && (
                                    <div className="flex justify-end">
                                        <Button
                                            size="sm"
                                            onClick={() => handleApprove(app.id)}
                                            disabled={approve.isPending}
                                            className="cursor-pointer"
                                        >
                                            {approve.isPending ? "Kutib turing..." : "Tasdiqlash"}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
