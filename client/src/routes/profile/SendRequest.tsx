import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "react-hot-toast"
import useApi from "@/hooks/useApi"

export default function SendRequestPage() {
    const api = useApi()
    const mutation = useMutation({
        mutationFn: (data: any) => api.post("/repair-requests", data),
        onSuccess: () => toast.success("Murojaat muvaffaqiyatli yuborildi"),
        onError: (error: any) =>
            toast.error(error?.response?.data?.error || "Murojaat yuborishda xatolik yuz berdi"),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const data = Object.fromEntries(new FormData(form)) as any
        mutation.mutate(data)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Texnik yordam so'rovi</CardTitle>
                <CardDescription>Formani to‘ldirib yuboring.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="device_model">Qurilma modeli</Label>
                        <Input
                            id="device_model"
                            name="device_model"
                            placeholder="Masalan: MacBook Pro 2021"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Muammo turi</Label>
                        <RadioGroup defaultValue="hardware" name="issue_type" className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hardware" id="hardware" />
                                <Label htmlFor="hardware" className="cursor-pointer">Kompyuter jihoz</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="software" id="software" />
                                <Label htmlFor="software" className="cursor-pointer">Dasturiy ta'minot</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="problem_area">Muammo sohasi</Label>
                        <Input
                            id="problem_area"
                            name="problem_area"
                            placeholder="Masalan: Displey, Klaviatura"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Tavsif</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Muammo haqida batafsil yozing"
                            className="min-h-[120px]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Joylashuv</Label>
                        <Input
                            id="location"
                            name="location"
                            placeholder="Masalan: Ofis 101"
                            required
                        />
                    </div>

                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? "Yuborilmoqda..." : "So'rov yuborish"}
                    </Button>
                </CardContent>
            </form>
        </Card>
    )
}
