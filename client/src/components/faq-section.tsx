import { useState } from "react";

const faqs = [
    {
        question: "Qanday qilib ta’mirlash buyurtmasini berish mumkin?",
        answer: "Siz saytimizda ro‘yxatdan o‘tgach, 'Buyurtma berish' bo‘limidan o‘z qurilmangizni tanlab, kerakli ma’lumotlarni to‘ldirib buyurtma berishingiz mumkin."
    },
    {
        question: "Ta’mirlash qancha vaqt davom etadi?",
        answer: "Oddiy ta’mirlash ishlari odatda 1-3 ish kuni ichida bajariladi, murakkab holatlar uchun vaqt uzayishi mumkin."
    },
    {
        question: "Kafolat berasizmi?",
        answer: "Ha, barcha ta’mirlash ishlarimizga 3 oylik kafolat beramiz."
    },
    {
        question: "To‘lov qanday amalga oshiriladi?",
        answer: "To‘lovni naqd pul yoki plastik karta orqali amalga oshirishingiz mumkin."
    },
];

export function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        if (openIndex === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex(index);
        }
    };

    return (
        <section id="faq" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Tez-tez so‘raladigan savollar</h2>
            <p className="text-gray-600 text-center mb-6">Bizning saytimizda tez-tez so‘raladigan savollar haqida ma'lumot olishingiz mumkin</p>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg">
                        <button
                            className="w-full flex justify-between items-center p-4 text-left text-gray-700 font-medium focus:outline-none"
                            onClick={() => toggleFaq(index)}
                        >
                            <span>{faq.question}</span>
                            <svg
                                className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {openIndex === index && (
                            <div className="p-4 pt-0 text-gray-600">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <span id='testimonials' />
        </section>
    );
}
