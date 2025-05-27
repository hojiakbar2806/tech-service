import { BellDot, CalendarCheck, ClipboardType, ComputerIcon, ContactRound, LayoutDashboard, Settings2, User2Icon } from "lucide-react";

export const API_URL = "https://computer-service.hojiakbar.me/api"


export const STATUS_OPTIONS = [
    { value: "all", label: "Hammasi" },
    { value: "created", label: "Yaratilgan" },
    { value: "approved", label: "Tasdiqlangan" },
    { value: "checked", label: "Tekshirilgan" },
    { value: "in_progress", label: "Jarayonda" },
    { value: "completed", label: "Yakunlangan" },
    { value: "rejected", label: "Rad etilgan" },
  ]


export const navlinks = {
    "user":[
        {
            href: "/profile",
            title: "Shaxsiy kabinet",
            icon: ContactRound
        },
        {
            href: "/profile/applications",
            title: "Murojatlar",
            icon: ComputerIcon
        },
        {
            href: "/profile/send-request",
            title: "So'rov yuborish",
            icon: ClipboardType
        },
        {
            href: "/profile/notifications",
            title: "Bildirishnomalar",
            icon: BellDot
        }
    ],
    "manager":[
        {
            href: "/dashboard/manager",
            title: "Boshqaruv oynasi",
            icon: LayoutDashboard
        },
        {
            href: "/dashboard/manager/users",
            title: "Foydalanuvchilar",
            icon: User2Icon
        },
        {
            href: "/dashboard/manager/applications",
            title: "Barcha Murojatlar",
            icon: ComputerIcon
        },
        {
            href: "/dashboard/manager/notifications",
            title: "Bildirishnomalar",
            icon: BellDot
        },
        {
            href: "/dashboard/manager/settings",
            title: "Sozlamalar",
            icon: Settings2
        }

    ],
    "master":[
        {
            href: "/dashboard/master/applications",
            title: "Murojatlar",
            icon: CalendarCheck
        },
        {
            href: "/dashboard/master/notifications",
            title: "Bildirishnomalar",
            icon: BellDot
        },
        {
            href: "/dashboard/master/components",
            title: "Komponentlar",
            icon: ComputerIcon
        },
        {
            href: "/dashboard/master",
            title: "Sozlamalar",
            icon: Settings2
        }
    ]
}