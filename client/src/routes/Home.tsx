import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Navbar } from "../components/navbar"
import { ComputerIcon, WrenchIcon, ClockIcon, PackageCheck } from "lucide-react"
import { Button } from "../components/ui/button"
import { Link } from "react-router"

export default function HomePage() {

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow">
                <section className="py-12 md:py-20 bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Kompyuter ta'mirlash xizmati</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Barcha turdagi kompyuter va texnik muammolarni tez va sifatli hal qilish uchun bizga murojaat qiling
                        </p>
                        <Button size="lg" className="px-8 py-6 text-lg">
                            <Link to="/profile/send-request">Murojaat yuborish</Link>
                        </Button>
                    </div>
                </section>

                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Bizning xizmatlar</h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2">
                                    <ComputerIcon className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Kompyuter jihozi ta'mirlash</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600">
                                        Kompyuter, noutbuk va boshqa qurilmalarni ta'mirlash xizmati
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2">
                                    <WrenchIcon className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Dasturiy ta'minot</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600">
                                        Operatsion tizim va dasturiy ta'minot bilan bog'liq muammolarni hal qilish
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2">
                                    <ClockIcon className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Tezkor xizmat</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600">
                                        Shoshilinch muammolarni tezkor hal qilish xizmati
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2">
                                    <PackageCheck className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Yetkzib berish</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600">
                                        Barcha xizmatlar uchun kafolat va sifat nazorati
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-primary/5">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">Hoziroq murojaat qiling</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Texnik muammolaringizni hal qilish uchun murojaat yuborish tugmasini bosing
                        </p>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>© 2025 TechService. Barcha huquqlar himoyalangan.</p>
                </div>
            </footer>
        </div>
    )
}
