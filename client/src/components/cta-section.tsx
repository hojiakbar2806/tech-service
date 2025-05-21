import SendRequestForm from "./send-request-form";

export function CtaSection() {
    return (
        <section className="bg-green-700 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-4xl font-bold sm:text-5xl mb-4">
                    Qurilmangiz nosozmi?
                </h2>
                <p className="text-lg sm:text-xl mb-8">
                    Biz telefon, planshet, noutbuk va boshqa qurilmalarni tez va sifatli ta’mirlaymiz. Hozir so‘rov yuboring — biz siz bilan tez orada bog‘lanamiz!
                </p>

                <SendRequestForm />
            </div>
        </section>
    )
}
