type Testimonial = {
    name: string
    rating: number
    text: string
}

const testimonials: Testimonial[] = [
    {
        name: "Sarah Johnson",
        rating: 5,
        text: "Mening iPhonemning ekrani to‘liq singan edi, lekin ular bir necha soat ichida tuzatib berdi. Endi yangidek ko‘rinadi!",
    },
    {
        name: "Michael Chen",
        rating: 5,
        text: "Ular mening noutbukning bukilishi va klaviaturasini almashtirishdi. A’lo xizmat va munosib narxlar!",
    },
    {
        name: "Emily Rodriguez",
        rating: 5,
        text: "Mening planshetim zaryad olmayotgan edi, ular muammoni tezda aniqlashdi. Zaryadlash portini tuzatishdi va endi mukammal ishlaydi!",
    },
]

function Star({ filled }: { filled: boolean }) {
    return (
        <svg
            className={`h-5 w-5 ${filled ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    )
}

export function TestimonialsSection() {
    return (
        <section className="bg-gray-50 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Mijozlarimiz fikrlari</h2>
                    <p className="mt-2 text-gray-600">
                        So‘zlarimizga ishonmang, mamnun mijozlarimizning fikrlarini tinglang
                    </p>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map(({ name, rating, text }, idx) => (
                        <div key={idx} className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-gray-900">{name}</h3>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} filled={i < rating} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600">{`"${text}"`}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
