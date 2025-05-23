import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const ApplicationDetail = ({ tLoading, rLoading, application, open, onClose, handleAprove, handleReject }) => {
    return (
        <div
            role="dialog"
            aria-modal="true"
            data-open={open}
            className="fixed inset-0 opacity-0 pointer-events-none bg-black/50 bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300
            data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto"
            onClick={onClose}
        >
            <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                        Murojat tafsilotlari
                    </h1>
                    <Button variant="destructive" className="cursor-pointer">
                        <X />
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <p className="text-sm text-gray-500">Model:</p>
                        <p className="font-medium text-gray-800">{application?.device_model || "-"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Muammo turi:</p>
                        <p className="font-medium text-gray-800">
                            {application?.issue_type === "hardware" ? "Qurilma" : application?.issue_type === "software" ? "Dasturiy ta'minot" : "-"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Muammo nuqtasi:</p>
                        <p className="font-medium text-gray-800">{application?.problem_area || "-"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Muammo nuqtasi:</p>
                        <p className="font-medium text-gray-800">{application?.problem_area || "-"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Murojat egasi:</p>
                        <a href={`mailto:${application?.owner?.email}`} className="font-medium text-blue-500">{application?.owner?.email || "-"}</a>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Manzil:</p>
                        <p className="font-medium text-gray-800">{application?.location || "-"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Murojat vaqti:</p>
                        <p className="font-medium text-gray-800">{application?.created_at ? new Date(application?.created_at).toLocaleString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Foydalanuvchi email:</p>
                        <p className="font-medium text-gray-800">{application?.owner?.email || "-"}</p>
                    </div>

                    <div className="sm:col-span-2">
                        <p className="text-sm text-gray-500">Tavsif:</p>
                        <p className="font-medium text-gray-800 text-justify max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mb-1">
                            {application?.description || "-"}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={rLoading}
                        className="cursor-pointer"
                    >
                        {rLoading ? "Kutib turing..." : "Rad etish"}
                    </Button>
                    <Button
                        onClick={handleAprove}
                        disabled={tLoading}
                        className="cursor-pointer"
                    >
                        {tLoading ? "Kutib turing..." : "Tasdiqlash"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ApplicationDetail
