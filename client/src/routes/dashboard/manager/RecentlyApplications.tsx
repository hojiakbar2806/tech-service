import ApplicationDetail from "@/components/application-details"
import { getStatus } from "@/components/get-status"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableCell, TableRow } from "@/components/ui/table"
import useApi from "@/hooks/useApi"
import type { Application } from "@/types/application"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"

const Applications = () => {
    const api = useApi()
    const [application, setApplication] = useState<Application | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const { data: applications = null, isLoading, refetch } = useQuery({
        queryKey: ["applications"],
        queryFn: async () => api.get("/repair-requests?status=created"),
        select: (data) => data.data
    })

    const approve = useMutation({
        mutationFn: (id: number) => api.post(`/repair-requests/${id}/as-checked`),
        onSuccess: () => {
            toast.success("Murojaat muvaffaqiyatli qabul qilindi")
            setIsOpen(false)
            refetch()
        }
    })
    const reject = useMutation({
        mutationFn: (id: number) => api.post(`/repair-requests/${id}/as-rejected`),
        onSuccess: () => {
            toast.success("Murojaat muvaffaqiyatli qabul qilindi")
            setIsOpen(false)
            refetch()
        }
    })


    const handleAprove = async () => {
        if (application?.id) approve.mutate(application?.id)
        else toast.error("Xatolik yuz berdi")
    }

    const handleReject = async () => {
        if (application?.id) reject.mutate(application?.id)
        else toast.error("Xatolik yuz berdi")
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-2 sm:mb-0">Kelgan murojatlar</h2>
            </div>

            {
                applications?.length > 0 ? (
                    <Table>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Murojat egasi</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell>Muammo turi</TableCell>
                            <TableCell>Muammo nuqtasi</TableCell>
                            <TableCell>Holati</TableCell>
                            <TableCell>Tavfsif</TableCell>
                            <TableCell>Manzil</TableCell>
                            <TableCell>Yaratilgan vaqti</TableCell>
                        </TableRow>

                        {
                            isLoading && (
                                <>
                                    <TableRow>
                                        <TableCell colSpan={10}>
                                            <Skeleton className="h-8" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={10}>
                                            <Skeleton className="h-8" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={10}>
                                            <Skeleton className="h-8" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={10}>
                                            <Skeleton className="h-8" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={10}>
                                            <Skeleton className="h-8" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={10}>
                                            <Skeleton className="h-8" />
                                        </TableCell>
                                    </TableRow>
                                </>
                            )
                        }

                        {
                            applications?.map((app) => (
                                <TableRow key={app.id}
                                    onClick={() => {
                                        setIsOpen(true)
                                        setApplication(app)
                                    }}
                                    className="cursor-pointer">
                                    <TableCell>{app.id}</TableCell>
                                    <TableCell>{app.owner.email}</TableCell>
                                    <TableCell>{app.device_model}</TableCell>
                                    <TableCell>{app.issue_type === "hardware" ? "Qurilma " : "Dasturiy ta'minot"}</TableCell>
                                    <TableCell>{app.location}</TableCell>
                                    <TableCell>{getStatus(app.status)}</TableCell>
                                    <TableCell className="max-w-lg overflow-hidden">{app.description}</TableCell>
                                    <TableCell>{app.location}</TableCell>
                                    <TableCell>{app.created_at}</TableCell>
                                </TableRow>
                            ))
                        }

                    </Table>
                ) : (
                    <div className="text-center py-4">
                        <h2 className="text-2xl font-semibold">Murojatlar mavjud emas</h2>
                    </div>
                )
            }
            <ApplicationDetail
                tLoading={approve.isPending}
                rLoading={reject.isPending}
                open={isOpen}
                application={application}
                handleAprove={handleAprove}
                handleReject={handleReject}
                onClose={() => setIsOpen(false)}
            />
        </div>
    )
}

export default Applications
