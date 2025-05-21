import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/useSession";
import api from "@/lib/api";
import {
  User2,
  LogOut,
  UserCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export function UserDropdown() {
  const { session, setSession } = useSession();
  const fallbackText = session?.user?.email?.slice(0, 2)?.toUpperCase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/");
    await toast.promise(api.post("/auth/logout"), {
      loading: "Kutilmoqda...",
      success: "Chiqish muvaffaqiyatli amalga oshirildi",
      error: "Chiqishda xatolik yuz berdi",
    });
    setSession(null);
    localStorage.clear();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="size-12 cursor-pointer">
            <AvatarFallback className="text-lg font-bold">
              {session?.user ? fallbackText : <User2 className="text-slate-500" />}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {session?.user ? (
          session.user.role === "user" ? (
            <>
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer"
              >
                <UserCircle className="size-4 md:size-5" />
                <span className="text-sm md:text-lg">Shaxsiy kabinet</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="size-4 md:size-5" />
                <span className="text-sm md:text-lg">Tizimdan chiqish</span>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer"
              >
                <UserCircle className="size-4 md:size-5" />
                <span className="text-sm md:text-lg">Boshqaruv panel</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="size-4 md:size-5" />
                <span className="text-sm md:text-lg">Tizimdan chiqish</span>
              </DropdownMenuItem>
            </>
          )
        ) : (
          <>
            <h3 className="p-1 text-lg font-semibold border-b">Kirish</h3>

            <DropdownMenuItem
              onClick={() => navigate("/auth/login?role=user")}
              className="cursor-pointer"
            >
              <span className="text-sm md:text-lg">Foydalanuvchi</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigate("/auth/login?role=manager&master")}
              className="cursor-pointer"
            >
              <span className="text-sm md:text-lg">Manager & Usta</span>
            </DropdownMenuItem>

          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
