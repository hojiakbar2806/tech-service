import { useSession } from "@/hooks/useSession"
import { LaptopIcon,  User2Icon } from "lucide-react"
import { Link } from "react-router"

const ProfileNavbar = () => {
    const { session } = useSession()
    return (
        <nav className="flex item-center justify-between px-6 py-4 border-b border-gray-300">
            <Link to="/" className="flex items-center space-x-2">
                <LaptopIcon className="size-8 text-primary" />
                <span className="text-xl font-bold text-primary">TechService</span>
            </Link>

            <div className="flex gap-2">

                <div className="flex items-center space-x-2">
                    <h2>{session?.user.email}</h2>
                </div>

                <div className="rounded-full size-12 bg-primary grid place-items-center cursor-pointer">
                    <User2Icon className="text-white" />
                </div>

            </div>
        </nav>
    )
}

export default ProfileNavbar
