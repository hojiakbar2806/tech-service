import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const ApplicationDetail = ({ tLoading, rLoading, application, open, onClose, handleAprove, handleReject }) => {

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl w-full">
                <DialogHeader>
                    <DialogTitle>Murojat tafsilotlari</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Model:</p>
                        <p className="font-medium">{application?.device_model}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Muammo turi:</p>
                        <p className="font-medium">{application?.issue_type}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Muammo nuqtasi:</p>
                        <p className="font-medium">{application?.problem_area}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Manzil:</p>
                        <p className="font-medium">{application?.location}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <p className="text-sm text-muted-foreground">Tavsif:</p>
                        <p className="font-medium text-justify">{application?.description}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <p className="text-sm text-muted-foreground">Foydalanuvchi email:</p>
                        <p className="font-medium">{application?.owner?.email}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="destructive" onClick={handleReject}
                        disabled={rLoading}>
                        {rLoading ? "Kutib turing..." : "Rad etish"}
                    </Button>
                    <Button onClick={handleAprove} disabled={tLoading}>
                        {tLoading ? "Kutib turing..." : "Tasdiqlash"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default ApplicationDetail