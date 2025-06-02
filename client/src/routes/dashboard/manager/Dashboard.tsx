import { useQuery } from "@tanstack/react-query";
import useApi from "@/hooks/useApi";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Application } from "@/types/application";
import { Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from "chart.js";

import { Clock4, CheckCircle2, Ban, AlertTriangle } from "lucide-react";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);


type ApplicationStats = {
    total: number;
    created: number;
    checked: number;
    rejected: number;
    hardware: number;
    software: number;
    in_progress: number;
    completed: number;
};

type LocationStats = {
    [key: string]: number;
};

export default function Dashboard() {
    const api = useApi();

    const { data: applications = [], isLoading, isError } = useQuery({
        queryKey: ["applications"],
        queryFn: () => api.get("/repair-requests"),
        select: (data) => data.data as Application[],
    });


    const appStats: ApplicationStats = {
        total: applications?.length,
        created: applications?.filter((a) => a.status === "created").length,
        checked: applications?.filter((a) => a.status === "checked").length,
        rejected: applications?.filter((a) => a.status === "rejected").length,
        hardware: applications?.filter((a) => a.issue_type === "hardware").length,
        software: applications?.filter((a) => a.issue_type === "software").length,
        in_progress: applications?.filter((a) => a.status === "in_progress").length,
        completed: applications?.filter((a) => a.status === "completed").length,
    };

    const locationStats: LocationStats = applications.reduce((acc, app) => {
        const location = app.location || "Noma'lum";
        acc[location] = (acc[location] || 0) + 1;
        return acc;
    }, {} as LocationStats);

    const stats = [
        {
            title: "Jarayonda",
            value: appStats.in_progress,
            icon: <Clock4 className="w-6 h-6 text-blue-600" />,
            color: "bg-blue-100 text-blue-800",
        },
        {
            title: "Bajarilgan",
            value: appStats.completed,
            icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
            color: "bg-green-100 text-green-800",
        },
        {
            title: "Rad etilgan",
            value: appStats.rejected,
            icon: <Ban className="w-6 h-6 text-red-600" />,
            color: "bg-red-100 text-red-800",
        },
        {
            title: "Yaratilgan",
            value: appStats.created,
            icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
            color: "bg-yellow-100 text-yellow-800",
        },
    ];

    const issueTypeChartData = {
        labels: ["Qurilma", "Dasturiy ta'minot"],
        datasets: [
            {
                data: [appStats.hardware, appStats.software],
                backgroundColor: ["#3b82f6", "#10b981"],
                borderColor: "#ffffff",
                borderWidth: 2,
            },
        ],
    };

    const appStatusChartData = {
        labels: ["Yangi", "Qabul qilingan", "Rad etilgan"],
        datasets: [
            {
                label: "Murojaatlar soni",
                data: [appStats.created, appStats.checked, appStats.rejected],
                backgroundColor: ["#3b82f6", "#10b981", "#ef4444"],
                borderColor: ["#2563eb", "#059669", "#dc2626"],
                borderWidth: 1,
            },
        ],
    };

    const locationChartData = {
        labels: Object.keys(locationStats),
        datasets: [
            {
                label: "Murojaatlar soni",
                data: Object.values(locationStats),
                backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
                borderColor: ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed"],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="w-full flex flex-col h-full">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Bildirishnomalar</h2>

            {isError ? (
                <div className="text-center text-red-500 p-4">
                    Ma‘lumotlarni yuklashda xatolik yuz berdi.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardHeader>
                                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-10 bg-gray-200 rounded w-1/2" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            stats.map((stat, index) => (
                                <Card key={index} className={`p-4 ${stat.color}`}>
                                    <div className="flex items-center space-x-4">
                                        {stat.icon}
                                        <div>
                                            <p className="text-sm font-medium">{stat.title}</p>
                                            <p className="text-xl font-bold">{stat.value}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    <div className="w-full flex flex-col gap-5 flex-wrap">
                        <div className="flex flex-col lg:flex-row gap-5">
                            <Card className="flex-1 min-w-[300px]">
                                <CardHeader>
                                    <CardTitle className="text-center text-lg font-semibold text-gray-900">
                                        Muammo turlari
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Pie className="m-auto"
                                        data={issueTypeChartData}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { position: "top", labels: { color: "#1f2937" } },
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="flex-1 min-w-[300px]">
                                <CardHeader>
                                    <CardTitle className="text-center text-lg font-semibold text-gray-900">
                                        Murojaat holatlari
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Bar className="w-full"
                                        data={appStatusChartData}
                                        options={{
                                            responsive: true,
                                            plugins: { legend: { display: false }, title: { display: false } },
                                            scales: {
                                                y: { beginAtZero: true, ticks: { color: "#1f2937" }, grid: { color: "#e5e7eb" } },
                                                x: { ticks: { color: "#1f2937" }, grid: { display: false } },
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center text-lg font-semibold text-gray-900">
                                    Murojaatlar manzillari
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Bar className="w-full"
                                    data={locationChartData}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { display: false }, title: { display: false } },
                                        scales: {
                                            y: { beginAtZero: true, ticks: { color: "#1f2937" }, grid: { color: "#e5e7eb" } },
                                            x: { ticks: { color: "#1f2937" }, grid: { display: false } },
                                        },
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
