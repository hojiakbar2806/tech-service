import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import useApi from "@/hooks/useApi"
import { Controller } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const schema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string({ required_error: "Email majburiy", }).email("Email formati noto'g'ri"),
    password: z.string({ required_error: "Parol majburiy", }).min(6, "Kamida 6 ta belgi bo'lishi kerak"),
    role: z.string(),
})


type FormData = z.infer<typeof schema>

export default function AddUser() {
    const api = useApi()

    const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const mutation = useMutation({
        mutationFn: (data: FormData) => api.post("/users", data),
        onSuccess: () => {
            toast.success("Foydalanuvchi muvaffaqiyatli yaratildi!")
            reset()
        },
        onError: () => {
            toast.error("So'rov yuborishda xatolik yuz berdi")
        },
    })

    const onSubmit = (data: FormData) => mutation.mutate(data)

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Foydalanuvchi qo'shish</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    <div>
                        <Label className="mb-2" htmlFor="first_name">Ism</Label>
                        <Input
                            id="first_name"
                            placeholder="Ismingizni kiriting"
                            {...register("first_name")}
                            disabled={mutation.isPending}
                            aria-invalid={errors.first_name ? "true" : "false"}
                        />
                        {errors.first_name && (
                            <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label className="mb-2" htmlFor="last_name">Familiya</Label>
                        <Input
                            id="last_name"
                            placeholder="Familiyangizni kiriting"
                            {...register("last_name")}
                            disabled={mutation.isPending}
                            aria-invalid={errors.last_name ? "true" : "false"}
                        />
                        {errors.last_name && (
                            <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label className="mb-2" htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Emailingizni kiriting"
                            {...register("email")}
                            disabled={mutation.isPending}
                            aria-invalid={errors.email ? "true" : "false"}
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <Label className="mb-2" htmlFor="password">Parol</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Kamida 6 ta belgi"
                            {...register("password")}
                            disabled={mutation.isPending}
                            aria-invalid={errors.password ? "true" : "false"}
                        />
                        {errors.password && (
                            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <Label className="mb-2" htmlFor="role">Rol</Label>
                        <Controller
                            name="role"
                            control={control}
                            rules={{ required: "Rol majburiy" }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={mutation.isPending}
                                    >
                                        <SelectTrigger id="role" className="w-full">
                                            <SelectValue placeholder="Rolni tanlang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="master">Texnik</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && (
                                        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                                    )}
                                </>
                            )}
                        />
                        {errors.role && (
                            <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={mutation.isPending} className="w-full">
                        {mutation.isPending ? "Yaratilmoqda..." : "Foydalanuvchi yaratish"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
