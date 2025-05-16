import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle2, Clock4, Ban } from "lucide-react"
import { useNavigate } from "react-router-dom"
import useApi from "@/hooks/useApi"

interface Application {
  id: string
  device_model: string
  issue_type: string
  problem_area: string
  description: string
  location: string
  status: string
  created_at: string
  estimated_completion?: number
  master: {
    id: string
    name: string
    email: string
  }
  end_time: string
}

export default function ProfilePage() {
  const api = useApi()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => api.get<Application[]>("/repair-requests/me"),
  })

  const apps = data?.data ?? []

  const countByStatus = (status: string) =>
    apps.filter((a) => a.status === status).length

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

  const inProgressApps = apps.filter((app) => app.status === "in_progress")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Jarayondagi murojaatlar</h3>
        <Button onClick={() => navigate("/profile/applications")}>Barcha murojaatlar</Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/10">
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead>Joylashuv</TableHead>
              <TableHead>Sana</TableHead>
              <TableHead>Taxminiy tugash</TableHead>
              <TableHead>Tugash sanasi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inProgressApps.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.device_model}</TableCell>
                <TableCell>{app.location}</TableCell>
                <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {app.estimated_completion
                    ? formatDuration(app.estimated_completion)
                    : "Belgilanmagan"}
                </TableCell>
                <TableCell>{new Date(app.end_time).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {inProgressApps.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Hozircha jarayondagi murojaatlar yo‘q
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
