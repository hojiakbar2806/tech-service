import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/useSession"
import { Link } from "react-router-dom"
import { UserDropdown } from "./user-drop-down"

export function SiteHeader() {
    const { session } = useSession()

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
                    {session ? (
                        <UserDropdown />
                    ) : (
                        <>
                            <Button asChild>
                                <Link to={"/auth/login"}>Kirish</Link>
                            </Button>
                            <Button asChild className="ml-2">
                                <Link to={"/auth/register"}>Ro'yxatdan o'tish</Link>
                            </Button>
                        </>
                    )
                    }

                </div>
            </div>
        </header>
    )
}
