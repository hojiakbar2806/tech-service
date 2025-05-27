"use client"

import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Check,
    User,
    Settings,
    ArrowLeft,
    ArrowRight,
    Loader2,
    Mail,
    Smartphone,
    MapPin,
    FileText,
    AlertCircle,
    Sparkles,
} from "lucide-react"
import useDrawerStore from "@/hooks/useModalStore"
import api from "@/lib/api"

const schemaStep1 = z.object({
    first_name: z.string().min(1, "Ism kiriting"),
    last_name: z.string().min(1, "Familiya kiriting"),
    email: z.string().email("Email noto'g'ri"),
})

const schemaStep2 = z.object({
    device_model: z.string().min(1, "Qurilma modeli kiritilishi shart"),
    issue_type: z.enum(["hardware", "software"]),
    problem_area: z.string().min(1, "Muammo sohasi kiritilishi shart"),
    description: z.string().min(5, "Tavsif kamida 5 ta belgidan iborat bo'lishi kerak"),
    location: z.string().min(1, "Joylashuv kiritilishi shart"),
    termsAccepted: z.boolean().refine((val) => val === true, "Foydalanish shartlariga rozilik kerak"),
})

type Step1Data = z.infer<typeof schemaStep1>
type Step2Data = z.infer<typeof schemaStep2>
type FormData = {
    user_data: Step1Data;
    repair_request: Step2Data;
}

export default function MultiStepDialogForm() {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
    const { open, close, multiStepForm } = useDrawerStore()

    const step1Form = useForm<Step1Data>({
        mode: "onSubmit",
        resolver: zodResolver(schemaStep1),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
        },
    })

    const step2Form = useForm<Step2Data>({
        mode: "onSubmit",
        resolver: zodResolver(schemaStep2),
        defaultValues: {
            device_model: "",
            issue_type: "hardware",
            problem_area: "",
            description: "",
            location: "",
            termsAccepted: false,
        },
    })

    const submitForm = async (data: FormData) => {
        setIsLoading(true)
        try {
            await api.post('/repair-requests/create-with-user', data)
            step1Form.reset()
            step2Form.reset()
            setStep1Data(null)
            setStep(1)
            close("multiStepForm")
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const onNext = async () => {
        const valid = await step1Form.trigger()
        if (valid) {
            setStep1Data(step1Form.getValues())
            step2Form.reset(step2Form.getValues(), { keepValues: true })
            setStep(2)
        }
    }

    const onBack = () => {
        step2Form.reset(step2Form.getValues(), { keepValues: true })
        setStep(1)
    }

    const onSubmit = async (step2Data: Step2Data) => {
        const valid = await step2Form.trigger()
        if (valid && step1Data) {
            const fullData: FormData = {
                user_data: step1Data,
                repair_request: step2Data,
            }
            submitForm(fullData)
        }
    }

    return (
        <Dialog
            open={multiStepForm}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    step1Form.reset()
                    step2Form.reset()
                    setStep1Data(null)
                    setStep(1)
                    close("multiStepForm")
                } else {
                    open("multiStepForm")
                }
            }}
        >
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    className="cursor-pointer"
                    onClick={() => open("multiStepForm")}
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Texnik yordam so'rovi
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0 bg-white">
                <div className="relative h-full">
                    <div className="relative bg-primary p-8 text-white">
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <h2 className="w-full text-center text-xl font-bold mb-2">
                                    {step === 1 ? "Shaxsiy ma'lumotlaringizni kiriting" : "Muammo haqida ma'lumot bering"}
                                </h2>
                            </div>

                            <div className="flex items-center justify-center space-x-8">
                                <div className="flex items-center space-x-4">
                                    <div className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${step >= 1 ? "bg-white text-primary shadow-lg" : "bg-white/20 text-white/60"}`}>
                                        <User className="w-6 h-6" />
                                        {step > 1 && (
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div
                                    className={`h-1 w-20 rounded-full transition-all duration-300 ${step > 1 ? "bg-white" : "bg-white/30"}`}
                                />

                                <div className="flex items-center space-x-4">
                                    <div
                                        className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${step >= 2 ? "bg-white text-primary shadow-lg" : "bg-white/20 text-white/60"}`}
                                    >
                                        <Settings className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
                        {step === 1 && (
                            <form onSubmit={step1Form.handleSubmit(onNext)} className="space-y-6">
                                <div className="space-y-6 animate-in slide-in duration-300">
                                    <div className="grid gap-6">
                                        <div className="group">
                                            <Label htmlFor="first_name" className="text-sm font-semibold text-gray-700 mb-2 block">
                                                Ism
                                            </Label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <Input
                                                    id="first_name"
                                                    placeholder="Ismingizni kiriting"
                                                    className={`pl-12 h-14 text-lg border-2 rounded-xl transition-all duration-300 ${step1Form.formState.errors.first_name
                                                        ? "border-red-300 bg-red-50 focus:border-red-500"
                                                        : "border-gray-200 focus:border-primary focus:bg-white hover:border-primary/50"}`}
                                                    {...step1Form.register("first_name")}
                                                />
                                            </div>
                                            {step1Form.formState.errors.first_name && (
                                                <div className="flex items-center gap-2 mt-2 text-red-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="text-sm">{step1Form.formState.errors.first_name.message}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="group">
                                            <Label htmlFor="last_name" className="text-sm font-semibold text-gray-700 mb-2 block">
                                                Familiya
                                            </Label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <Input
                                                    id="last_name"
                                                    placeholder="Familiyangizni kiriting"
                                                    className={`pl-12 h-14 text-lg border-2 rounded-xl transition-all duration-300 ${step1Form.formState.errors.last_name
                                                        ? "border-red-300 bg-red-50 focus:border-red-500"
                                                        : "border-gray-200 focus:border-primary focus:bg-white hover:border-primary/50"}`}
                                                    {...step1Form.register("last_name")}
                                                />
                                            </div>
                                            {step1Form.formState.errors.last_name && (
                                                <div className="flex items-center gap-2 mt-2 text-red-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="text-sm">{step1Form.formState.errors.last_name.message}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="group">
                                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                                                Email manzil
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="example@email.com"
                                                    className={`pl-12 h-14 text-lg border-2 rounded-xl transition-all duration-300 ${step1Form.formState.errors.email
                                                        ? "border-red-300 bg-red-50 focus:border-red-500"
                                                        : "border-gray-200 focus:border-primary focus:bg-white hover:border-primary/50"}`}
                                                    {...step1Form.register("email")}
                                                />
                                            </div>
                                            {step1Form.formState.errors.email && (
                                                <div className="flex items-center gap-2 mt-2 text-red-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="text-sm">{step1Form.formState.errors.email.message}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-gray-200">
                                    <Button
                                        type="submit"
                                        className="cursor-pointer"
                                    >
                                        Keyingi
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={step2Form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-6 animate-in slide-in duration-300">
                                    <div className="grid gap-6">
                                        <div className="group">
                                            <Label htmlFor="device_model" className="text-sm font-semibold text-gray-700 mb-2 block">
                                                Qurilma modeli
                                            </Label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <Input
                                                    id="device_model"
                                                    placeholder="iPhone 14, Samsung Galaxy S23"
                                                    className={`pl-12 h-14 text-lg border-2 rounded-xl transition-all duration-300 ${step2Form.formState.errors.device_model
                                                        ? "border-red-300 bg-red-50 focus:border-red-500"
                                                        : "border-gray-200 focus:border-primary focus:bg-white hover:border-primary/50"}`}
                                                    {...step2Form.register("device_model")}
                                                />
                                            </div>
                                            {step2Form.formState.errors.device_model && (
                                                <div className="flex items-center gap-2 mt-2 text-red-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="text-sm">{step2Form.formState.errors.device_model.message}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="group">
                                            <Label className="text-sm font-semibold text-gray-700 mb-4 block">Muammo turi</Label>
                                            <Controller
                                                control={step2Form.control}
                                                name="issue_type"
                                                render={({ field }) => (
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="grid grid-cols-2 gap-4"
                                                    >
                                                        <div className="relative">
                                                            <RadioGroupItem value="hardware" id="hardware" className="peer sr-only" />
                                                            <Label
                                                                htmlFor="hardware"
                                                                className={`flex items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${field.value === "hardware"
                                                                    ? "border-primary bg-primary/10 text-primary"
                                                                    : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"}`}
                                                            >
                                                                <div className="text-center">
                                                                    <Settings className="w-8 h-8 mx-auto mb-2" />
                                                                    <span className="font-semibold">Hardware</span>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                        <div className="relative">
                                                            <RadioGroupItem value="software" id="software" className="peer sr-only" />
                                                            <Label
                                                                htmlFor="software"
                                                                className={`flex items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${field.value === "software"
                                                                    ? "border-primary bg-primary/10 text-primary"
                                                                    : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"}`}
                                                            >
                                                                <div className="text-center">
                                                                    <FileText className="w-8 h-8 mx-auto mb-2" />
                                                                    <span className="font-semibold">Software</span>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                    </RadioGroup>
                                                )}
                                            />
                                        </div>

                                        <div className="group">
                                            <Label htmlFor="problem_area" className="text-sm font-semibold text-gray-700 mb-2 block">
                                                Muammo sohasi
                                            </Label>
                                            <Input
                                                id="problem_area"
                                                placeholder="Ekran, Batareya, Dastur..."
                                                className={`h-14 text-lg border-2 rounded-xl transition-all duration-300 ${step2Form.formState.errors.problem_area
                                                    ? "border-red-300 bg-red-50 focus:border-red-500"
                                                    : "border-gray-200 focus:border-primary focus:bg-white hover:border-primary/50"}`}
                                                {...step2Form.register("problem_area")}
                                            />
                                            {step2Form.formState.errors.problem_area && (
                                                <div className="flex items-center gap-2 mt-2 text-red-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="text-sm">{step2Form.formState.errors.problem_area.message}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="group">
                                            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
                                                Muammo tavsifi
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Muammoni batafsil tasvirlab bering..."
                                                className={`min-h-[120px] text-lg border-2 rounded-xl transition-all duration-300 resize-none ${step2Form.formState.errors.description
                                                    ? "border-red-300 bg-red-50 focus:border-red-500"
                                                    : "border-gray-200 focus:border-primary focus:bg-white hover:border-primary/50"}`}
                                                {...step2Form.register("description")}
                                            />
                                            {step2Form.formState.errors.description && (
                                                <div className="flex items-center gap-2 mt-2 text-red-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="text-sm">{step2Form.formState.errors.description.message}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="group">
                                            <Label htmlFor="location" className="text-sm font-semibold text-gray-700 mb-2 block">
                                                Joylashuv
                                            </Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <Input
                                                    id="location"
                                                    placeholder="Shahar, tuman"
                                                    className={`pl-12 h-14 text-lg border-2 rounded-xl transition-all duration-300 ${step2Form.formState.errors.location
                                                        ? "border-red-300 bg-red-50 focus:border-red-500"
                                                        : "border-gray-200 focus:border-primary focus:bg-white hover:border-primary/50"}`}
                                                    {...step2Form.register("location")}
                                                />
                                            </div>
                                            {step2Form.formState.errors.location && (
                                                <div className="flex items-center gap-2 mt-2 text-red-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="text-sm">{step2Form.formState.errors.location.message}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="group">
                                            <Controller
                                                control={step2Form.control}
                                                name="termsAccepted"
                                                render={({ field }) => (
                                                    <div className="flex items-start space-x-4 p-6 border-2 border-gray-200 rounded-xl transition-all duration-300 hover:border-primary/50">
                                                        <Checkbox
                                                            id="termsAccepted"
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="mt-1 border-primary data-[state=checked]:bg-primary"
                                                        />
                                                        <Label
                                                            htmlFor="termsAccepted"
                                                            className="text-sm leading-relaxed cursor-pointer text-gray-700"
                                                        >
                                                            Foydalanish shartlari va maxfiylik siyosatiga roziman
                                                        </Label>
                                                    </div>
                                                )}
                                            />
                                            {step2Form.formState.errors.termsAccepted && (
                                                <div className="flex items-center gap-2 mt-2 text-red-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="text-sm">{step2Form.formState.errors.termsAccepted.message}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onBack}
                                        className="cursor-pointer"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Orqaga
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Yuborilmoqda...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Yuborish
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}