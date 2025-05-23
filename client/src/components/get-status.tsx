export function getStatus(status: string) {
    const colors: Record<string, string> = {
        created: "bg-gray-500 text-white",
        checked: "bg-blue-500 text-white",
        approved: "bg-green-500 text-white",
        in_progress: "bg-yellow-500 text-white",
        completed: "bg-purple-500 text-white",
        rejected: "bg-red-500 text-white",
    };

    const text: Record<string, string> = {
        created: "Yaratildi",
        checked: "Tekshirildi",
        approved: "Tasdiqlandi",
        in_progress: "Jarayonda",
        completed: "Yakunlandi",
        rejected: "Rad etildi",
    }

    const colorClass = colors[status] || "bg-gray-300 text-black";

    return (
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${colorClass}`}>
            {text[status]}
        </span>
    );
}