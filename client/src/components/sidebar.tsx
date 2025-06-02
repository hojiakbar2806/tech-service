import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from 'react-router'
import { useSession } from "@/hooks/useSession"
import { navlinks } from "@/lib/const"
import useDrawerStore from "@/hooks/useModalStore"

export default function Sidebar() {
    const { session } = useSession()
    const { pathname } = useLocation()
    const { sideBar, close } = useDrawerStore()
    if (!session) return null
    const links = navlinks[session.user.role]

    return (
        <div className="relative">

            <div
                className={cn(
                    "fixed top-0 left-0 border-t h-full bg-white border-r w-[280px] p-5 transition-all duration-300 md:block z-50",
                    sideBar ? "block" : "hidden",
                    "md:static md:w-[280px] md:border-r md:p-5"
                )}
            >
                <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                    {session.user.role === "user" && "Shaxsiy kabinet"}
                    {session.user.role === "manager" && "Manager kabinet"}
                    {session.user.role === "master" && "Master kabinet"}
                </h2>
                <div className="space-y-1">
                    {links?.map((item) => (
                        <Button
                            key={item.href}
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-2",
                                pathname === item.href
                                    ? "bg-primary/10 hover:bg-primary/20"
                                    : ""
                            )}
                            asChild
                        >
                            <Link to={item.href}>
                                <item.icon className="h-5 w-5" />
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            {sideBar && (
                <div
                    className="fixed cursor-pointer top-0 left-0 w-full h-full bg-black opacity-40 z-10"
                    onClick={() => close("sideBar")}
                />
            )}
        </div>
    )
}
