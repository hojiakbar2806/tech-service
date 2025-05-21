import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import useApi from "@/hooks/useApi"

import { getStatus } from "@/components/get-status"
import type { Application } from "@/types/application"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const ReceivedApplications = () => {
    const api = useApi()
    const { data: applications = [], isLoading } = useQuery({
        queryKey: ["applications"],
        queryFn: async () => await api.get("/repair-requests/master"),
        select: (data) => data.data,
    })

    const [selectedStatus, setSelectedStatus] = useState<string>("all")

    const filteredApplications =
        selectedStatus === "all"
            ? applications
            : applications.filter((app) => app.status === selectedStatus)

    return (
        <>
            <div className="flex flex-col">

                <div className="w-ful flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold mb-4">Kelgan murojaatlar</h2>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger >
                            <SelectValue placeholder="Holatni tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Holat</SelectLabel>
                                <SelectItem value="all">Hammasi</SelectItem>
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
                            filteredApplications.map((app: Application) => (
                                <TableRow key={app.id} className="cursor-pointer hover:bg-gray-100">
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

export default ReceivedApplications
