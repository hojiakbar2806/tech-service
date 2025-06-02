import { MenuIcon } from "lucide-react"
import { Button } from "./ui/button"
import { UserDropdown } from "./user-drop-down"
import useDrawerStore from "@/hooks/useModalStore"

const ProfileNavbar = () => {
    const { open } = useDrawerStore()
    return (
        <header className="bg-white shadow">
            <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Button
                        onClick={() => open("sideBar")}
                        className="md:hidden flex items-center mr-2 cursor-pointer"
                    >
                        <span className="icon-burger"><MenuIcon /></span>
                    </Button>
                    <a href="/" className="flex items-center">
                        <span className="text-xl font-bold text-green-600">DernSupport</span>
                    </a>
                </div>
                <UserDropdown />
            </div>
        </header>
    )
}

export default ProfileNavbar
