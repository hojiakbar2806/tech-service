import { useState } from "react"
import useApi from "@/hooks/useApi"
import { useMutation, useQuery } from "@tanstack/react-query"

import toast from "react-hot-toast"
import { getStatus } from "@/components/get-status"
import type { Application } from "@/types/application"
import ApplicationModal from "@/components/application-modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const NewApplications = () => {
    const api = useApi()
    const [open, setOpen] = useState(false)
    const [selectedApp, setSelectedApp] = useState<Application | null>(null)
    const { data: applications = [], isLoading } = useQuery({
        queryKey: ["applications"],
        queryFn: async () => await api.get("/repair-requests?status=checked"),
        select: (data) => data.data
    })
    const mutation = useMutation({
        mutationFn: (data) => api.patch(`/repair-requests/${selectedApp?.id}/personalize-order`, data),
        onSuccess: (res) => toast.success(res?.data?.message || "Murojaat muvaffaqiyatli qabul qilindi"),
        onError: () => toast.error("Murojaat qabul qilishda xatolik yuz berdi")
    })


    const onSubmit = (data) => mutation.mutate(data)

    const openModalWithApp = (app: Application) => {
        setSelectedApp(app)
        setOpen(true)
    }

    return (
        <>
            <div>
                <h2 className="text-xl font-semibold mb-4">Kelgan murojaatlar</h2>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id</TableHead>
                            <TableHead>Murojat egasi</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead>Muammo turi</TableHead>
                            <TableHead>Holati</TableHead>
                            <TableHead>Yaratilgan vaqti</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center p-4">
                                    Yuklanmoqda...
                                </TableCell>
                            </TableRow>
                        ) : (
                            applications.map((app: Application) => (
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
                onSubmit={onSubmit}
            />
        </>
    )
}

export default NewApplications
