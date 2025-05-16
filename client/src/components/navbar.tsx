import { Button } from "@/components/ui/button"
import { LaptopIcon } from "lucide-react"
import { Link } from "react-router"

export function Navbar() {
    return (
        <header className="bg-white border-b sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <LaptopIcon className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold text-primary">TechService</span>
                        </Link>
                    </div>
                    <div>
                        <Button asChild className="cursor-pointer">
                            <Link to="/profile">Shaxsiy kabinet</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
