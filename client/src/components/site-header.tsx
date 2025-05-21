import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/useSession"
import { Link } from "react-router-dom"

export function SiteHeader() {
    const { session } = useSession()
    let redirectPath = "/auth/login"

    if (session && session.user.role === "user") {
        redirectPath = "/profile"
    }
    if (session && (session.user.role === "manager" || session.user.role === "master")) {
        redirectPath = "/dashboard"
    }

    return (
        <header className="bg-white shadow sticky top-0 z-30">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <a href="/" className="flex items-center">
                        <span className="text-xl font-bold text-green-600">DernSupport</span>
                    </a>
                </div>
                <nav className="hidden space-x-8 md:flex">
                    <a href="/#services" className="text-base font-medium text-gray-500 hover:text-gray-900">
                        Xizmatlar
                    </a>
                    <a href="/#faq" className="text-base font-medium text-gray-500 hover:text-gray-900">
                        Tez so'raladigan savollar
                    </a>
                    <a href="/#testimonials" className="text-base font-medium text-gray-500 hover:text-gray-900">
                        Mijozlar fikri
                    </a>
                </nav>
                <div>
                    <Button asChild>
                        <Link to={redirectPath}>Kirish</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
