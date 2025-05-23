import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMutation, useQuery } from "@tanstack/react-query"
import useApi from "@/hooks/useApi"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    BadgeAlert, BadgeInfo, DollarSign, Info, Laptop, MapPin, UserIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "react-router-dom"
import type { Application } from "@/types/application"
import { STATUS_OPTIONS } from "@/lib/const"


export default function ApplicationsPage() {
    const api = useApi()
    const { data = null, isLoading, refetch } = useQuery({
        queryKey: ["my-applications"],
        queryFn: () => api.get<Application[]>("/repair-requests/me"),
    })

    const approve = useMutation({
        mutationFn: (id: number) => api.post(`/repair-requests/${id}/as-in-progress`),
    })


    const [searchParams, setSearchParams] = useSearchParams()
    const statusFromParams = searchParams.get("status") || "all"
    const [statusFilter, setStatusFilter] = useState(statusFromParams)


    useEffect(() => setStatusFilter(statusFromParams), [statusFromParams])


    const onStatusChange = (value: string) => {
        setStatusFilter(value)
        if (value === "all") {
            searchParams.delete("status")
            setSearchParams(searchParams)
        } else {
            setSearchParams({ status: value })
        }
    }


    const filteredApps = data?.data.filter((app) => statusFilter === "all" ? true : app.status === statusFilter) ?? []

    const handleApprove = async (id: number) => {
        await approve.mutateAsync(id)
        await refetch()
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h2 className="text-2xl font-bold">Sizning Murojatlaringiz</h2>
                <Select onValueChange={onStatusChange} value={statusFilter}>
                    <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Filter" className="cursor-pointer" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                            <SelectItem className="cursor-pointer" key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="pb-2 space-y-2">
                                <Skeleton className="h-5 w-1/2" />
                                <Skeleton className="h-4 w-1/3" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-16 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredApps.length === 0 ? (
                <Alert variant="default" className="mt-4">
                    <Info className="w-4 h-4 mr-2" />
                    <AlertTitle>Ma’lumot topilmadi</AlertTitle>
                    <AlertDescription>
                        {statusFilter === "all"
                            ? "Hozircha murojaatlar mavjud emas."
                            : "Tanlangan statusga mos murojaatlar topilmadi."}
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {filteredApps.map((app) => (
                        <Card key={app.id} className="overflow-hidden border rounded-xl shadow-sm hover:shadow-md transition">
                            <CardHeader className="pb-1">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Laptop className="w-4 h-4 text-muted-foreground" />
                                        {app.device_model}
                                    </CardTitle>
                                    <Badge
                                        className="text-xs capitalize"
                                        variant={app.status === "in_progress" ? "default" : "secondary"}
                                    >
                                        {app.status.replace("_", " ")}
                                    </Badge>
                                </div>
                                <CardDescription className="text-xs text-muted-foreground">
                                    Yaratilgan sana: {new Date(app.created_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        <span className="font-medium">Texnik mas'ul:</span>{" "}
                                        {app.master?.email ?? "Aniqlanmagan"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BadgeAlert className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        <span className="font-medium">Muammo turi:</span>{" "}
                                        {app.issue_type === "hardware" ? "Kompyuter jihoz" : "Dasturiy ta'minot"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BadgeInfo className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        <span className="font-medium">Sohasi:</span> {app.problem_area}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        <span className="font-medium">Price:</span> {app.price ?? "Qo'yilmagan"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        <span className="font-medium">Joylashuv:</span> {app.location}
                                    </span>
                                </div>
                                <div className="pt-2 border-t mt-2">
                                    <span className="block font-medium mb-1">Tavsif:</span>
                                    <div className="flex justify-between gap-2" >
                                        <blockquote className="text-muted-foreground text-sm italic border-l-4 pl-3 border-muted">
                                            {app.description}
                                        </blockquote>
                                        {app.status === "approved" && (
                                            <Button variant="default" size="sm" disabled={approve.isPending} className="cursor-pointer hover:bg-primary/60 active:bg-primary"
                                                onClick={() => handleApprove(app.id)}>
                                                {approve.isPending ? "Kutib turing..." : "Tasdiqlash"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </>
    )
}
