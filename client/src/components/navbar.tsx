import { UserDropdown } from "./user-drop-down";

export function Navbar() {


    return (
        <header className="bg-white shadow">
            <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <a href="/" className="flex items-center">
                        <span className="text-xl font-bold text-green-600">DernSupport</span>
                    </a>
                </div>
                <UserDropdown />
            </div>
        </header>
    );
}
