import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"

import useApi from "@/hooks/useApi"
import { getStatus } from "@/components/get-status"
import type { Application } from "@/types/application"
import ApplicationModal from "@/components/application-modal"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel,
    SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const Applications = () => {
    const api = useApi()
    const [open, setOpen] = useState(false)
    const [selectedApp, setSelectedApp] = useState<Application | null>(null)
    const [searchParams, setSearchParams] = useSearchParams()

    const selectedStatus = searchParams.get("status") || "all"

    const { data: applications = [], isLoading, refetch } = useQuery({
        queryKey: ["applications"],
        queryFn: async () => {
            const checked = await api.get("/repair-requests?status=checked")
            const other = await api.get("/repair-requests/master")
            return [...checked.data, ...other.data]
        }
    })

    const mutation = useMutation({
        mutationFn: (data) => api.patch(`/repair-requests/${selectedApp?.id}/personalize-order`, data),
        onSuccess: (res) => {
            toast.success(res?.data?.message || "Murojaat muvaffaqiyatli qabul qilindi")
            refetch()
        },
        onError: () => toast.error("Murojaat qabul qilishda xatolik yuz berdi")
    })

    const handleComplete = async (app: Application) => {
        try {
            await api.patch(`/repair-requests/${app.id}/as-completed`)
            toast.success("Murojaat tugatildi")
            refetch()
        } catch {
            toast.error("Tugatishda xatolik yuz berdi")
        }
    }

    const filteredApps = selectedStatus === "all"
        ? applications
        : applications.filter(app => app.status === selectedStatus)

    const openModalWithApp = (app: Application) => {
        if (app.status === "checked") {
            setSelectedApp(app)
            setOpen(true)
        }
    }


    const onSubmit = async (data) => {
        await mutation.mutateAsync(data)
        await refetch()
    }

    return (
        <div className="flex flex-col">
            <div className="w-full flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold mb-4">Kelgan murojaatlar</h2>
                <Select value={selectedStatus} onValueChange={(value) => setSearchParams({ status: value })}>
                    <SelectTrigger className="cursor-pointer">
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

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Murojat egasi</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Muammo turi</TableHead>
                        <TableHead>Holati</TableHead>
                        <TableHead>Yaratilgan vaqti</TableHead>
                        <TableHead>Amal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center p-4">
                                Yuklanmoqda...
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredApps.map((app: Application) => (
                            <TableRow
                                key={app.id}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => openModalWithApp(app)}
                            >
                                <TableCell>{app.id}</TableCell>
                                <TableCell>{app.owner?.email}</TableCell>
                                <TableCell>{app.device_model}</TableCell>
                                <TableCell>{app.issue_type === "hardware" ? "Qurilma" : "Dasturiy ta'minot"}</TableCell>
                                <TableCell>{getStatus(app.status)}</TableCell>
                                <TableCell>{new Date(app.created_at).toLocaleString()}</TableCell>
                                <TableCell>
                                    {app.status === "in_progress" && (
                                        <Button className="cursor-pointer" size="sm" onClick={(e) => { e.stopPropagation(); handleComplete(app) }}>
                                            Tugatish
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <ApplicationModal
                isLoading={mutation.isPending}
                open={open}
                setOpen={setOpen}
                selectedApp={selectedApp}
                onSubmit={onSubmit}
            />
        </div>
    )
}

export default Applications