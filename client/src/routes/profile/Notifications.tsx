import { useQuery } from "@tanstack/react-query"
import { Bell } from "lucide-react"
import useApi from "@/hooks/useApi"

interface Notification {
    id: string
    title: string
    message: string
    created_at: string
}

export default function NotificationsPage() {
    const api = useApi()

    const { data, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => api.get<Notification[]>("/notifications"),
    })

    const notifications = data?.data ?? []

    return (
        <div className="space-y-4 px-4">
            <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold tracking-tight">Bildirishnomalar</h2>
            </div>

            {notifications.length === 0 && !isLoading && (
                <p className="text-muted-foreground text-sm">
                    Sizda hozircha hech qanday bildirishnoma yo‘q.
                </p>
            )}

            <div className="flex flex-col gap-2">
                {notifications.map((notif) => (
                    <div className="flex flex-col gap-1 border shadow-md p-4 rounded-lg">
                        <h2 className="font-semibold text-lg">{notif.title}</h2>
                        <p className="text-muted-foreground">{notif.message}</p>
                        <p className="text-end">{notif.created_at}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
