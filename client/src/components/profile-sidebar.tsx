import { cn } from "@/lib/utils"
import { LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Link, useLocation, useNavigate } from 'react-router'
import api from "@/lib/api"
import toast from "react-hot-toast"
import { useSession } from "@/hooks/useSession"

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
    items: {
        href: string
        title: string
        icon: React.ComponentType<{ className?: string }>
    }[]
}

export default function Sidebar({ items }: SidebarNavProps) {
    const { pathname } = useLocation()
    const { setSession } = useSession()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await toast.promise(
            api.post("/auth/logout"),
            {
                loading: "Kutilmoqda...",
                success: "Chiqish muvaffaqiyatli amalga oshirildi",
                error: "Chiqish muvaffaqiyatli amalga oshirilmadi"
            },
        )
        navigate("/")
        setSession(null)
        localStorage.clear()
    }

    return (
        <div className="hidden md:flex flex-col border-r w-[280px]">
            <div className="p-5">
                <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                    Shaxsiy kabinet
                </h2>
                <div className="space-y-1">
                    {items.map((item) => (
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
            <div className="mt-auto p-5">
                <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 cursor-pointer text-lg"
                    onClick={handleLogout}>
                    <LogOut className="size-6" />
                    Chiqish
                </Button>
            </div>
        </div>
    )
}
