
export function SiteFooter() {
    return (
        <footer className="bg-gray-800">
            <div className="mx-auhref px-4 py-12 sm:px-6 lg:px-8">
                <div id="contact" className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Biz haqimizda</h3>
                        <p className="mt-4 text-base text-gray-300">
                            Biz barcha elektron qurilmalaringiz uchun tez va sifatli ta’mirlash xizmatlarini taqdim etamiz.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Xizmatlar</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <a href="/#services" className="text-base text-gray-300 hover:text-white">
                                    Smartfon ta’miri
                                </a>
                            </li>
                            <li>
                                <a href="/#services" className="text-base text-gray-300 hover:text-white">
                                    Noutbuk ta’miri
                                </a>
                            </li>
                            <li>
                                <a href="/#services" className="text-base text-gray-300 hover:text-white">
                                    Planshet ta’miri
                                </a>
                            </li>
                            <li>
                                <a href="/#services" className="text-base text-gray-300 hover:text-white">
                                    Komponentlarni almashtirish
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Aloqa</h3>
                        <ul className="mt-4 space-y-4">
                            <li className="text-base text-gray-300">123 Repair ko‘chasi</li>
                            <li className="text-base text-gray-300">Shahar, Viloyat 12345</li>
                            <li className="text-base text-gray-300">info@DernSupport.com</li>
                            <li className="text-base text-gray-300">(123) 456-7890</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8">
                    <p className="text-base text-gray-400">
                        &copy; {new Date().getFullYear()} DernSupport. Barcha huquqlar himoyalangan.
                    </p>
                </div>
            </div>
        </footer>
    )
}
