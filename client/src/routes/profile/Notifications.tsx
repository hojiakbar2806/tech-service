import { useQuery } from "@tanstack/react-query"
import { Bell, CheckCircle, Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useApi from "@/hooks/useApi"
import clsx from "clsx"

interface Notification {
    id: string
    title: string
    message: string
    created_at: string
    read: boolean
}

export default function NotificationsPage() {
    const api = useApi()

    const { data, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => api.get<Notification[]>("/notifications/me"),
    })

    const notifications = data?.data ?? []

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Bildirishnomalar</h2>
            </div>

            {notifications.length === 0 && !isLoading && (
                <p className="text-muted-foreground">Sizda hozircha hech qanday bildirishnoma yo‘q.</p>
            )}

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <Card
                        key={notif.id}
                        className={clsx(
                            "transition duration-200 border",
                            notif.read ? "opacity-70" : "border-blue-500"
                        )}
                    >
                        <CardHeader className="flex flex-row justify-between items-center">
                            <div>
                                <CardTitle className="text-lg font-semibold">{notif.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{notif.message}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {notif.read ? (
                                    <Badge variant="secondary">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        O‘qilgan
                                    </Badge>
                                ) : (
                                    <Badge variant="default">
                                        <Circle className="w-4 h-4 mr-1 fill-blue-600" />
                                        Yangi
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-right text-muted-foreground">
                                {new Date(notif.created_at).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
