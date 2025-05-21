import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMutation, useQuery } from "@tanstack/react-query"
import useApi from "@/hooks/useApi"
import type { User } from "@/types/user"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    BadgeAlert, BadgeInfo, DollarSign, Info, Laptop, MapPin, UserIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

interface Application {
    id: number
    device_model: string
    issue_type: string
    problem_area: string
    price: number
    description: string
    location: string
    status: string
    created_at: string
    master: User
}

const STATUS_OPTIONS = [
    { value: "created", label: "Yaratilgan" },
    { value: "approved", label: "Tasdiqlangan" },
    { value: "in_progress", label: "Jarayonda" },
    { value: "completed", label: "Bajarilgan" },
    { value: "rejected", label: "Rad etilgan" },
]

export default function ApplicationsPage() {
    const api = useApi()
    const { data = null, isLoading, refetch } = useQuery({
        queryKey: ["my-applications"],
        queryFn: () => api.get<Application[]>("/repair-requests/me"),
    })

    const approve = useMutation({
        mutationFn: (id: number) => api.post(`/repair-requests/${id}/as-in-progress`),
    })
    const reject = useMutation({
        mutationFn: (id: number) => api.post(`/repair-requests/${id}/as-rejected`),
    })

    const [statusFilter, setStatusFilter] = useState("approved")

    const filteredApps = data?.data.filter((app) => statusFilter ? app.status === statusFilter : true
    ) ?? []

    const handleApprove = async (id: number) => {
        await approve.mutateAsync(id)
        await refetch()
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h2 className="text-2xl font-bold">Sizning Murojatlaringiz</h2>
                <Select onValueChange={setStatusFilter}>
                    <SelectTrigger >
                        <SelectValue placeholder="Filter" />
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
                        {statusFilter
                            ? "Tanlangan statusga mos murojaatlar topilmadi."
                            : "Hozircha sizda hech qanday qabul qilingan murojaatlar yo‘q."}
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
