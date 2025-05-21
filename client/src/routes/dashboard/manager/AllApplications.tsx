import { getStatus } from "@/components/get-status"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableCell, TableRow } from "@/components/ui/table"
import useApi from "@/hooks/useApi"
import { useQuery } from "@tanstack/react-query"


const AllApplications = () => {
  const api = useApi()
  const { data: applications = null, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => api.get("/repair-requests"),
    select: (data) => data.data
  })
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
    </div>
  )
}

export default AllApplications
