"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LogoIcon } from "../Icon/Icon";
import { useUser } from "@/src/context/UserContext";
import { authService } from "@/src/services/auth.service";
import { SideMenu } from "./components/SideMenu";

export default function HeaderSection() {
  const { isAuthenticated, clearUserData, userData } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    authService.logout();
    clearUserData();
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background mb-[69px] px-6 py-4 shadow-[0_2px_4px_0_rgba(0,0,0,0.16)]">
       <div className={!isAuthenticated ?`flex flex-row justify-center max-w-5xl mx-auto` : "hidden"}>
        <Link href="/" className={`flex flex-row items-center gap-2`}>
          <LogoIcon className="-translate-y-1" />
          <p className={`text-20 md:text-32 text-custom-light-purple font-bold text-text-primary`}>
            POMODORO
          </p>
        </Link>
        </div>


       <div className={isAuthenticated ? "flex flex-row justify-between max-w-5xl mx-auto" : "hidden"}>
            <Link href="/pomodoro" className="flex flex-row items-center gap-2">
              <LogoIcon className="-translate-y-1" />
              <p className="text-20 text-custom-light-purple font-bold text-text-primary">
                POMODORO
              </p>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => router.push(`/perfil/@${userData?.username}`)}
                className="text-off-white hover:text-custom-light-purple transition-colors font-semibold text-14"
              >
                MEU PERFIL
              </button>
              <button
                onClick={handleLogout}
                className="text-off-white hover:text-custom-light-purple transition-colors font-semibold text-14"
              >
                SAIR
              </button>
            </div>

            <button
              onClick={toggleMenu}
              className="md:hidden cursor-pointer z-40 text-off-white"
              aria-label="Abrir menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </header>
      {isAuthenticated && <SideMenu isOpen={menuOpen} onClose={toggleMenu} />}
    </>
  );
}
