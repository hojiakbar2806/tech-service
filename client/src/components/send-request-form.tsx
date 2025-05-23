import { z } from 'zod'
import api from '@/lib/api'
import { Label } from './ui/label'
import { Input } from './ui/input'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card, CardContent } from './ui/card'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'

const schema = z.object({
    device_model: z.string().min(1, "Qurilma modeli kiritilishi shart"),
    email: z.string().email("Email formati noto'g'ri"),
    issue_type: z.enum(["hardware", "software"]),
    problem_area: z.string().min(1, "Muammo sohasi kiritilishi shart"),
    description: z.string().min(5, "Tavsif kamida 5 ta belgidan iborat bo‘lishi kerak"),
    location: z.string().min(1, "Joylashuv kiritilishi shart"),
})

type FormData = z.infer<typeof schema>

const SendRequestForm = () => {

    const { control, register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

    const mutation = useMutation({
        mutationFn: ({ email, ...data }: { email: string } & FormData) => api.post(`/repair-requests/${email}/create`, data),
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

                        />
                        {errors.device_model && <p className="text-red-600 text-sm">{errors.device_model.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="device_model">Email manzilingizni kiriting</Label>
                        <Input
                            id="device_model"
                            placeholder="example@gmail.com"
                            {...register("email")}

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

                        />
                        {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Joylashuv</Label>
                        <Input
                            id="location"
                            placeholder="Masalan: Ofis 101"
                            {...register("location")}

                        />
                        {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
                    </div>

                    <Button className='w-full cursor-pointer' type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? "Yuborilmoqda..." : "So'rov yuborish"}
                    </Button>
                </CardContent>
            </form>
        </Card>
    )
}

export default SendRequestForm 
