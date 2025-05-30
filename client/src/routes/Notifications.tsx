import { useMutation, useQuery } from "@tanstack/react-query"
import useApi from "@/hooks/useApi"
import { Button } from "@/components/ui/button"
import { CheckCheck } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton" // Skeleton componenti kerak

interface Notification {
    id: number
    title: string
    message: string
    created_at: string
    seen: boolean
}

export default function NotificationsPage() {
    const api = useApi()

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => api.get<Notification[]>("/notifications"),
    })

    const markAsRead = useMutation({
        mutationFn: (data: number[]) => api.post(`/notifications/as-read`, data),
        onSettled: () => {
            refetch()
        },
    })

    const notifications = data?.data ?? []

    const handleMarkAsRead = async () => {
        const unSeenMsgId = notifications.filter((notif) => !notif.seen).map((notif) => notif.id)
        if (unSeenMsgId.length > 0) {
            await markAsRead.mutateAsync(unSeenMsgId)
        }
    }

    return (
        <div className="space-y-4 h-full">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Bildirishnomalar</h2>
                {notifications.some((notif) => !notif.seen) && (
                    <Button
                        className="cursor-pointer"
                        onClick={handleMarkAsRead}
                        disabled={markAsRead.isPending}
                    >
                        {markAsRead.isPending ? "Yuklanmoqda..." : "O'qilgan deb belgilash"}
                    </Button>
                )}
            </div>

            {isLoading && (
                <div className="flex flex-col gap-2">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-[60px] w-full rounded-md" />
                    ))}
                </div>
            )}

            {notifications.length === 0 && !isLoading && (
                <p className="text-muted-foreground text-sm">
                    Sizda hozircha hech qanday bildirishnoma yo‘q.
                </p>
            )}

            <div className="flex flex-col gap-2">
                {notifications.map((notif) => (
                    <div
                        data-seen={notif.seen}
                        key={notif.id}
                        className="flex flex-col gap-1 border shadow-md p-4 rounded-lg data-[seen=true]:opacity-50"
                    >
                        <div className="flex justify-between items-end cursor-pointer">
                            <div>
                                <h2 className="font-semibold text-lg">{notif.title}</h2>
                                <p className="text-muted-foreground">{notif.message}</p>
                            </div>
                            {!notif.seen && (
                                <Button
                                    onClick={async () => {
                                        await markAsRead.mutateAsync([notif.id])
                                    }}
                                    disabled={markAsRead.isPending}
                                    className="cursor-pointer"
                                >
                                    <CheckCheck />
                                </Button>
                            )}
                        </div>
                        <p className="text-end text-sm text-muted-foreground">
                            {new Date(notif.created_at).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
