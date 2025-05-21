import type { Application } from "@/types/application";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedApp: Application | null;
    onSubmit: (data: { price: number; end_time: string }) => void;
};

const ApplicationModal = ({ open, setOpen, selectedApp, onSubmit }: Props) => {
    const [price, setPrice] = useState("");
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (open) {
            setPrice("");
            setEndDate(null);
        }
    }, [open]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        if (open) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, setOpen]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!endDate) return;

        onSubmit({
            price: Number(price),
            end_time: endDate.toISOString().split("T")[0]
        });
        setOpen(false);
    };

    return (
        <>
            <div
                data-open={open}
                className="fixed inset-0 flex justify-center items-center bg-black/50 bg-opacity-50 backdrop-blur-sm z-40 transition-all duration-300
                data-[open=false]:opacity-0 data-[open=false]:pointer-events-none
                data-[open=true]:opacity-100"
                onClick={() => setOpen(false)}
            />

            <div
                data-open={open}
                className="max-w-xl w-full absolute opacity-100 bg-white left-1/2 -top-5 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded shadow-lg transition-all duration-300 
                data-[open=true]:top-1/2
                data-[open=false]:opacity-0
                data-[open=false]:pointer-events-none">
                <header className="flex justify-between items-center mb-4">
                    <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                        Murojaat ID: {selectedApp?.id}
                    </h3>
                    <button
                        aria-label="Yopish"
                        className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
                        onClick={() => setOpen(false)}
                    >
                        &#10005;
                    </button>
                </header>
                <section className="mb-6 flex flex-col gap-2 p-2 rounded bg-slate-100">
                    <p>
                        <span className="font-semibold">Murojat egasi: </span>
                        {selectedApp?.owner?.email || "Noma'lum"}
                    </p>
                    <p>
                        <span className="font-semibold">Model: </span>
                        {selectedApp?.device_model}
                    </p>
                    <p>
                        <span className="font-semibold">Muammo turi: </span>
                        {selectedApp?.issue_type === "hardware" ? "Qurilma" : "Dasturiy ta'minot"}
                    </p>
                    <p>
                        <span className="font-semibold">Holati: </span>
                        {selectedApp?.status}
                    </p>
                    <p>
                        <span className="font-semibold">Yaratilgan vaqti: </span>
                        {selectedApp?.created_at}
                    </p>
                    {selectedApp?.description && (
                        <p>
                            <span className="font-semibold">Tavsif: </span>
                            {selectedApp?.description}
                        </p>
                    )}
                </section>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Narx
                        </label>
                        <input
                            min="0"
                            id="price"
                            placeholder="Narx kiriting"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            required
                        />
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <label
                                htmlFor="endDate"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Tugash sanasi
                            </label>
                            <DatePicker
                                id="endDate"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="yyyy-MM-dd HH:mm"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2
                                shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                placeholderText="Sanani va vaqtni tanlang"
                                required
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                        >
                            Bekor qilish
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Saqlash
                        </button>
                    </div>
                </form>
            </div>

        </>
    );
};

export default ApplicationModal;
