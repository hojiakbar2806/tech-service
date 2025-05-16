import { BellDot, ClipboardType, ComputerIcon, ContactRound } from "lucide-react";

export const API_URL = "http://localhost:8000"

export const navlinks = [
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
]