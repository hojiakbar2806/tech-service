import { Label } from "@radix-ui/react-label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Controller } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Textarea } from "./ui/textarea"
import { Button } from "react-day-picker"
import api from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { isAxiosError } from "axios"

const sendRequestForm = () => {

    const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

    const mutation = useMutation({
        mutationFn: (data: FormData) => api.post("/repair-requests", data),
        onSuccess: (res) => {
            toast.success(res?.data?.message || "So‘rov muvaffaqiyatli yuborildi")
            reset()
        },
        onError: (error: unknown) => {
            if (isAxiosError(error)) {
                toast.error(error?.response?.data?.details || "Xatolik yuz berdi")
            } else {
                toast.error("So‘rov yuborishda xatolik yuz berdi")
            }
        },
    })

    const onSubmit = (data: FormData) => mutation.mutate(data)


    return (
        <Card className="w-full">

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="device_model">Qurilma modeli</Label>
                        <Input
                            id="device_model"
                            placeholder="Masalan: MacBook Pro 2021"
                            {...register("device_model")}
                            disabled={isSubmitting}
                        />
                        {errors.device_model && <p className="text-red-600 text-sm">{errors.device_model.message}</p>}
                    </div>

                    <Controller
                        name="issue_type"
                        control={control}
                        rules={{ required: "Muammo turi kiritilishi shart" }}
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="hardware" id="hardware" />
                                    <Label htmlFor="hardware">Hardware</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="software" id="software" />
                                    <Label htmlFor="software">Software</Label>
                                </div>
                            </RadioGroup>
                        )}
                    >
                    </Controller>

                    <div className="space-y-2">
                        <Label htmlFor="problem_area">Muammo sohasi</Label>
                        <Input
                            id="problem_area"
                            placeholder="Masalan: Displey, Klaviatura"
                            {...register("problem_area")}
                            disabled={isSubmitting}
                        />
                        {errors.problem_area && <p className="text-red-600 text-sm">{errors.problem_area.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Tavsif</Label>
                        <Textarea
                            id="description"
                            placeholder="Muammo haqida batafsil yozing"
                            className="min-h-[120px]"
                            {...register("description")}
                            disabled={isSubmitting}
                        />
                        {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Joylashuv</Label>
                        <Input
                            id="location"
                            placeholder="Masalan: Ofis 101"
                            {...register("location")}
                            disabled={isSubmitting}
                        />
                        {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
                    </div>

                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Yuborilmoqda..." : "So'rov yuborish"}
                    </Button>
                </CardContent>
            </form>
        </Card>
    )
}

export default sendRequestForm
