import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import useApi from "@/hooks/useApi";
import { toast } from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { Application } from "@/types/application";
import { getStatus } from "@/components/get-status";
import { STATUS_OPTIONS } from "@/lib/const";
import { formatDate } from "@/lib/utils";

export default function Applications() {
  const api = useApi();
  const [application, setApplication] = useState<Application | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFromUrl = searchParams.get("status") || "all";
  const [statusFilter, setStatusFilter] = useState(statusFromUrl);

  useEffect(() => {
    if (statusFilter && statusFilter !== "all") {
      setSearchParams({ status: statusFilter });
    } else {
      setSearchParams({});
    }
  }, [statusFilter, setSearchParams]);

  const { data: applications = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => api.get("/repair-requests"),
    select: (data) => data.data as Application[],
  });

  const approve = useMutation({
    mutationFn: (id: number) => api.post(`/repair-requests/${id}/as-checked`),
    onSuccess: () => {
      toast.success("Murojaat muvaffaqiyatli qabul qilindi");
      setIsOpen(false);
      refetch();
    },
    onError: () => {
      toast.error("Murojaatni qabul qilishda xatolik yuz berdi");
    },
  });

  const reject = useMutation({
    mutationFn: (id: number) => api.post(`/repair-requests/${id}/as-rejected`),
    onSuccess: () => {
      toast.success("Murojaat rad etildi");
      setIsOpen(false);
      refetch();
    },
    onError: () => {
      toast.error("Murojaatni rad etishda xatolik yuz berdi");
    },
  });

  const handleRowClick = (app: Application) => {
    if (app.status === "created") {
      setIsOpen(true);
      setApplication(app);
    }
  };

  const handleApprove = () => {
    if (application?.id) {
      approve.mutate(application.id);
    } else {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleReject = () => {
    if (application?.id) {
      reject.mutate(application.id);
    } else {
      toast.error("Xatolik yuz berdi");
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  });

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Barcha murojaatlar</h2>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 cursor-pointer">
            <SelectValue placeholder="Holat bo‘yicha filtr" />
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

      <div className="flex-1 overflow-auto rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead className="p-2 px-6">ID</TableHead>
              <TableHead className="p-2 px-6">Email</TableHead>
              <TableHead className="p-2 px-6">Model</TableHead>
              <TableHead className="p-2 px-6">Muammo turi</TableHead>
              <TableHead className="p-2 px-6">Manzil</TableHead>
              <TableHead className="p-2 px-6">Holat</TableHead>
              <TableHead className="p-2 px-6 max-w-xs">Tavsif</TableHead>
              <TableHead className="p-2 px-6 min-w-48">Yaratilgan vaqt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  {[...Array(8)].map((__, j) => (
                    <TableCell key={j} className="p-2 px-6">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-500 p-4">
                  Ma‘lumotlarni yuklashda xatolik yuz berdi.
                </TableCell>
              </TableRow>
            ) : filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center p-4">
                  Murojaatlar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((app) => (
                <TableRow
                  key={app.id}
                  className={app.status === "created" ? "hover:bg-slate-50 cursor-pointer" : "cursor-default"}
                  onClick={() => handleRowClick(app)}
                >
                  <TableCell className="p-2 px-6 whitespace-nowrap">{app.id}</TableCell>
                  <TableCell className="p-2 px-6 whitespace-nowrap">{app.owner.email}</TableCell>
                  <TableCell className="p-2 px-6 whitespace-nowrap">{app.device_model}</TableCell>
                  <TableCell className="p-2 px-6 whitespace-nowrap">
                    {app.issue_type === "hardware" ? "Qurilma" : "Dasturiy ta'minot"}
                  </TableCell>
                  <TableCell className="p-2 px-6 whitespace-nowrap">{app.location}</TableCell>
                  <TableCell className="p-2 px-6 whitespace-nowrap">{getStatus(app.status)}</TableCell>
                  <TableCell className="p-2 px-6 max-w-xs overflow-auto whitespace-nowrap scrollbar-none">
                    {app.description}
                  </TableCell>
                  <TableCell className="p-2 px-6 min-w-48">
                    {formatDate(app.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg w-full bg-white p-4 rounded-lg shadow-lg">
          <header className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Murojaat ID: {application?.id}
            </h3>
            <button
              aria-label="Yopish"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {application && (
            <section className="mb-4 p-2 rounded bg-slate-100 space-y-2">
              <p>
                <span className="font-semibold">Murojat egasi:</span>{" "}
                {application.owner.email || "Noma'lum"}
              </p>
              <p>
                <span className="font-semibold">Model:</span> {application.device_model}
              </p>
              <p>
                <span className="font-semibold">Muammo turi:</span>{" "}
                {application.issue_type === "hardware" ? "Qurilma" : "Dasturiy ta'minot"}
              </p>
              <p>
                <span className="font-semibold">Manzil:</span> {application.location}
              </p>
              {application.description && (
                <p>
                  <span className="font-semibold">Tavsif:</span> {application.description}
                </p>
              )}
              <p>
                <span className="font-semibold">Yaratilgan vaqt:</span>{" "}
                {new Date(application.created_at).toLocaleString("uz-UZ", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </section>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={approve.isPending || reject.isPending}
              className="cursor-pointer"
            >
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={approve.isPending || reject.isPending}
              className="cursor-pointer"
            >
              {reject.isPending ? "Rad etilmoqda..." : "Rad etish"}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={approve.isPending || reject.isPending}
              className="cursor-pointer bg-blue-500 hover:bg-blue-600"
            >
              {approve.isPending ? "Qabul qilinmoqda..." : "Qabul qilish"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}