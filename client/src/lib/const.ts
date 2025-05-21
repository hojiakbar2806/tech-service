import { BellDot, CalendarCheck, ClipboardType, Clock12Icon, ComputerIcon, ContactRound, LayoutDashboard, User2Icon, UserPlus } from "lucide-react";

export const API_URL = "https://computer-service.hojiakbar.me/api"

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
            href: "/dashboard/manager/users-list",
            title: "Barcha Foydalanuvchilar",
            icon: User2Icon
        },
        {
            href: "/dashboard/manager/users-add",
            title: "Foydalanuvchi qo'shish",
            icon: UserPlus
        },
        {
            href: "/dashboard/manager/recently-applications",
            title: "Yaqinda kelgan Murojatlar",
            icon: Clock12Icon
        },
        {
            href: "/dashboard/manager/all-applications",
            title: "Barcha Murojatlar",
            icon: ComputerIcon
        },
        {
            href: "/dashboard/manager/notifications",
            title: "Bildirishnomalar",
            icon: BellDot
        },

    ],
    "master":[
        {
            href: "/dashboard/master",
            title: "Shaxsiy kabinet",
            icon: ContactRound
        },
        {
            href: "/dashboard/master/new-applications",
            title: "Yangi Murojatlar",
            icon: ComputerIcon
        },
        {
            href: "/dashboard/master/received-applications",
            title: "Qabul qilingan Murojatlar",
            icon: ComputerIcon
        },
        {
            href: "/dashboard/master/completed-applications",
            title: "Yakunlangan Murojatlar",
            icon: CalendarCheck
        },
        {
            href: "/dashboard/master/notifications",
            title: "Bildirishnomalar",
            icon: BellDot
        },
    ]
}