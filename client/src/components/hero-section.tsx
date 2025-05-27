import { Button } from "@/components/ui/button"
import useDrawerStore from "@/hooks/useModalStore"

export function HeroSection() {
    const { open } = useDrawerStore()

    return (
        <div className="relative bg-white overflow-hidden my-10">
            <div className="mx-auto max-w-7xl">
                <div className="relative z-10 bg-white lg:max-w-2xl lg:w-full py-10">
                    <svg
                        className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white lg:block"
                        fill="currentColor"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <polygon points="50,0 100,0 50,100 0,100" />
                    </svg>

                    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Professional ta’mirlash</span>{" "}
                                <span className="block text-green-600 xl:inline">barcha qurilmalar uchun</span>
                            </h1>
                            <p className="mt-3 max-w-md text-base text-gray-500 sm:mx-auto sm:mt-5 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl lg:mx-0">
                                Tezda bog‘lanish uchun email manzilingizni qoldiring — biz siz bilan albatta bog‘lanamiz!                            </p>
                            <Button className="cursor-pointer mt-2"
                                onClick={() => open("multiStepForm")}>
                                So'rov yuborish
                            </Button>
                        </div>
                    </main>
                </div>
            </div>

            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <img
                    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
                    src="/computer-service.jpg"
                    alt="Qurilma ta’miri"
                />
            </div>
            <span id="services" />
        </div>
    )
}
