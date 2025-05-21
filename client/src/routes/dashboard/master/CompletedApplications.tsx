import { useQuery } from "@tanstack/react-query"
import useApi from "@/hooks/useApi"

import { getStatus } from "@/components/get-status"
import type { Application } from "@/types/application"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const CompletedApplications = () => {
    const api = useApi()
    const { data: applications = [], isLoading } = useQuery({
        queryKey: ["applications"],
        queryFn: async () => await api.get("/repair-requests?status=completed"),
        select: (data) => data.data
    })

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

        </>
    )
}

export default CompletedApplications
