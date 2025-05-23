import { getStatus } from "@/components/get-status"
import { useSearchParams } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import useApi from "@/hooks/useApi"
import { useEffect, useState } from "react"
import ApplicationDetail from "@/components/application-details"
import toast from "react-hot-toast"
import type { Application } from "@/types/application"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { STATUS_OPTIONS } from "@/lib/const"

const Applications = () => {
  const api = useApi()
  const [application, setApplication] = useState<Application | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()


  const statusFromUrl = searchParams.get("status") || "all"
  const [statusFilter, setStatusFilter] = useState(statusFromUrl)

  useEffect(() => {
    if (statusFilter && statusFilter !== "all") {
      setSearchParams({ status: statusFilter })
    } else {
      setSearchParams({})
    }
  }, [statusFilter, setSearchParams])

  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => api.get("/repair-requests"),
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
      toast.success("Murojaat rad etildi")
      setIsOpen(false)
      refetch()
    }
  })

  const handleRowClick = (app: Application) => {
    if (app.status === "created") {
      setIsOpen(true)
      setApplication(app)
    }
  }

  const handleAprove = () => {
    if (application?.id) approve.mutate(application.id)
    else toast.error("Xatolik yuz berdi")
  }

  const handleReject = () => {
    if (application?.id) reject.mutate(application.id)
    else toast.error("Xatolik yuz berdi")
  }

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === "all") return true
    return app.status === statusFilter
  })

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Filter holati" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-auto border rounded-xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 sticky top-0 z-10">
              <th className="p-2 px-6 text-left border-b">ID</th>
              <th className="p-2 px-6 text-left border-b">Email</th>
              <th className="p-2 px-6 text-left border-b">Model</th>
              <th className="p-2 px-6 text-left border-b min-w-48">Muammo turi</th>
              <th className="p-2 px-6 text-left border-b">Manzil</th>
              <th className="p-2 px-6 text-left border-b">Holat</th>
              <th className="p-2 px-6 text-left border-b max-w-xs">Tavsif</th>
              <th className="p-2 px-6 text-left border-b">Manzil</th>
              <th className="p-2 px-6 text-left border-b min-w-48">Amal</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="text-center p-4">Yuklanmoqda...</td>
              </tr>
            ) : filteredApplications.length > 0 ? (
              filteredApplications.map((app: Application) => (
                <tr
                  key={app.id}
                  className={app.status === "created" ? "cursor-pointer hover:bg-gray-50" : "cursor-default"}
                  onClick={() => handleRowClick(app)}
                >
                  <td className="p-2 px-6 border-b whitespace-nowrap">{app.id}</td>
                  <td className="p-2 px-6 border-b whitespace-nowrap">{app.owner.email}</td>
                  <td className="p-2 px-6 border-b whitespace-nowrap">{app.device_model}</td>
                  <td className="p-2 px-6 border-b whitespace-nowrap">{app.issue_type === "hardware" ? "Qurilma" : "Dasturiy ta'minot"}</td>
                  <td className="p-2 px-6 border-b whitespace-nowrap">{app.location}</td>
                  <td className="p-2 px-6 border-b whitespace-nowrap">{getStatus(app.status)}</td>
                  <td className="p-2 px-6 border-b max-w-xs overflow-auto whitespace-nowrap scrollbar-none">{app.description}</td>
                  <td className="p-2 px-6 border-b whitespace-nowrap">{app.location}</td>
                  <td className="p-2 px-6 border-b min-w-60">
                    {app.status === "created" ? (
                      <Button className="cursor-pointer">Ko‘rish</Button>
                    ) : (
                      new Date(app.created_at).toLocaleString("uz-UZ", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-4">Murojaatlar mavjud emas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
