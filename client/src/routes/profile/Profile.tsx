import { useMutation, useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, Clock4, Ban } from "lucide-react"
import useApi from "@/hooks/useApi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useSearchParams } from "react-router"
import type { Application } from "@/types/application"
import { getStatus } from "@/components/get-status"
import { STATUS_OPTIONS } from "@/lib/const"
import { Button } from "@/components/ui/button"


export default function ProfilePage() {
  const api = useApi()
  const [loadingItem, setLoadingItem] = useState<number | null>(null)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => api.get<Application[]>("/repair-requests/me"),
    select: (data) => data.data,
  })

  const countByStatus = (status: string) =>
    data?.filter((a) => a.status === status).length || 0

  const stats = [
    {
      title: "Jarayonda",
      value: countByStatus("in_progress"),
      icon: <Clock4 className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Bajarilgan",
      value: countByStatus("completed"),
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Rad etilgan",
      value: countByStatus("rejected"),
      icon: <Ban className="w-6 h-6 text-red-600" />,
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Yaratilgan",
      value: countByStatus("created"),
      icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
      color: "bg-yellow-100 text-yellow-800",
    },
  ]

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours} soat ${minutes} daqiqa`
  }
  const [searchParams, setSearchParams] = useSearchParams()

  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  )
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setSearchParams({ status: value })
  }

  const filteredApps = data?.filter((app) =>
    statusFilter === "all" ? true : app.status === statusFilter
  ) ?? []

  const approve = useMutation({
    mutationFn: (id: number) => api.post(`/repair-requests/${id}/as-in-progress`),
  })

  const handleApprove = async (id: number) => {
    setLoadingItem(id)
    await approve.mutateAsync(id)
    await refetch()
    setLoadingItem(null)
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4  gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={`${stat.color} shadow-md`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Sizning murojaatlar</h3>
        <Select onValueChange={handleStatusChange} value={statusFilter}>
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Barchasi" />
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

      <div className="w-full h-full border rounded-xl shadow overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 sticky top-0 z-10">
              <th className="p-2 px-6 text-left border-b">Model</th>
              <th className="p-2 px-6 text-left border-b">Joylashuv</th>
              <th className="p-2 px-6 text-left border-b">Sana</th>
              <th className="p-2 px-6 text-left border-b">Taxminiy tugash</th>
              <th className="p-2 px-6 text-left border-b">Tugash sanasi</th>
              <th className="p-2 px-6 text-left border-b">Holat</th>
              {filteredApps.find((app) => app.status === "approved") && (
                <th className="p-2 px-6 text-left border-b">Amal</th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">Yuklanmoqda...</td>
              </tr>
            ) : filteredApps.length > 0 ? (
              filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="p-2 px-6 border-b whitespace-nowrap">{app.device_model}</td>
                  <td className="p-2 px-6 border-b whitespace-nowrap">{app.location}</td>
                  <td className="p-2 px-6 border-b whitespace-nowrap">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="p-2 px-6 border-b whitespace-nowrap">
                    {app.estimated_completion
                      ? formatDuration(app.estimated_completion)
                      : "Belgilanmagan"}
                  </td>
                  <td className="p-2 px-6 border-b whitespace-nowrap">{new Date(app.end_time).toLocaleDateString()}</td>
                  <td className="p-2 px-6 border-b whitespace-nowrap">{getStatus(app.status)}</td>
                  {app.status === "approved" && (
                    <td className="p-2 px-6 border-b whitespace-nowrap">
                      <Button
                        onClick={() => handleApprove(app.id)}
                        className="cursor-pointer"
                        disabled={loadingItem === app.id}
                      >
                        {loadingItem === app.id ? "Yuklanmoqda..." : "Tasdiqlash"}
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4">Murojaatlar mavjud emas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
