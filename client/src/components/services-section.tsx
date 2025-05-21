import { Smartphone, Laptop, Tablet, Cpu, Clock, Shield, type LucideIcon } from "lucide-react"

type ServiceItem = {
    Icon: LucideIcon
    title: string
    desc: string
}

const services: ServiceItem[] = [
    { Icon: Smartphone, title: "Smartfon ta'miri", desc: "Ekran, batareya, suvdan shikastlanish va boshqalar" },
    { Icon: Laptop, title: "Noutbuk ta'miri", desc: "Ekran, klaviatura va ichki qismlar ta'miri" },
    { Icon: Tablet, title: "Planshet ta'miri", desc: "Zaryad porti, ekran va dasturiy muammolar" },
    { Icon: Cpu, title: "Komponent almashtirish", desc: "Sifatli zaxira qismlar bilan ta'mirlash" },
    { Icon: Clock, title: "Tez xizmat", desc: "Aksar ta'mirlar 24-48 soat ichida" },
    { Icon: Shield, title: "Kafolat", desc: "Har bir ta'mirga 90 kunlik kafolat" },
]

export function ServicesSection() {
    return (
        <section className="bg-gray-50 py-12">
            <div className="mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Xizmatlarimiz</h2>
                <p className="mt-2 text-gray-600">Biz barcha elektron qurilmalaringiz uchun professional xizmatlar ko'rsatamiz</p>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid 
                    grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                    {services.map(({ Icon, title, desc }, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col justify-center items-center rounded-lg bg-white p-6 shadow hover:shadow-md transition duration-200 text-left"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                <Icon className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                            <p className="mt-2 text-sm text-gray-600 text-center">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <span id="faq"/>
        </section>
    )
}
