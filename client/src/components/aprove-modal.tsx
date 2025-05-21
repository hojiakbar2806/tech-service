import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ApproveModal = ({ open, onClose, masters, selectedMaster, setSelectedMaster, price, setPrice, onSubmit }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Murojatni tasdiqlash</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Usta tanlang</label>
                        <Select value={selectedMaster} onValueChange={setSelectedMaster}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Usta tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                {masters?.map(master => (
                                    <SelectItem key={master.id} value={master.id.toString()}>
                                        {master.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Narx</label>
                        <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Narx kiriting" />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
                    <Button onClick={onSubmit}>Tasdiqlash</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApproveModal;
