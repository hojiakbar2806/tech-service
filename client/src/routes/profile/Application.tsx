import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import useApi from "@/hooks/useApi"
import type { User } from "@/types/user"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    BadgeAlert, BadgeInfo, Info, Laptop, MapPin, UserIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface Application {
    id: string
    device_model: string
    issue_type: string
    problem_area: string
    description: string
    location: string
    status: string
    created_at: string
    master: User
}

const STATUS_OPTIONS = [
    { value: "All", label: "Barchasi" },
    { value: "created", label: "Yaratilgan" },
    { value: "approved", label: "Tasdiqlangan" },
    { value: "in_progress", label: "Jarayonda" },
    { value: "completed", label: "Bajarilgan" },
    { value: "rejected", label: "Rad etilgan" },
]

export default function ApplicationsPage() {
    const apiClient = useApi()
    const { data = null, isLoading } = useQuery({
        queryKey: ["my-applications"],
        queryFn: () => apiClient.get<Application[]>("/repair-requests/me"),
    })

    const [statusFilter, setStatusFilter] = useState("")

    const filteredApps = data?.data.filter((app) =>
        statusFilter ? app.status === statusFilter|| statusFilter === "All" : true
    ) ?? []

    return (
        <>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h2 className="text-2xl font-bold">Sizning Murojatlaringiz</h2>
                <Select onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Status bo‘yicha filtrlash" />
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
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        <span className="font-medium">Joylashuv:</span> {app.location}
                                    </span>
                                </div>
                                <div className="pt-2 border-t mt-2">
                                    <span className="block font-medium mb-1">Tavsif:</span>
                                    <blockquote className="text-muted-foreground text-sm italic border-l-4 pl-3 border-muted">
                                        {app.description}
                                    </blockquote>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </>
    )
}
