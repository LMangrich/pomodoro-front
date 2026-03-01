"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { XIcon } from "lucide-react";
import { LogoIcon } from "../../Icon/Icon";
import { useUser } from "@/src/context/UserContext";
import { authService } from "@/src/services/auth.service";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const SideMenu = ({
  isOpen,
  onClose,
  className,
}: SideMenuProps) => {
  const router = useRouter();
  const { clearUserData } = useUser();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleLogout = () => {
    authService.logout();
    clearUserData();
    onClose();
    router.push("/login");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 bg-background text-off-white overflow-y-auto w-1/3",
        isOpen ? "translate-x-0" : "translate-x-full",
        "transform transition-transform duration-300 ease-in-out",
        className
      )}>
        <button
          onClick={onClose}
          className="cursor-pointer z-40"
          aria-label="Fechar menu"
        >
          <XIcon size={24} className="absolute right-7 text-off-white" />
        </button>

        <div className="flex flex-col items-center h-full p-6 gap-4">
          <button onClick={() => handleNavigation("/perfil")}
            className="w-full text-left px-4 py-3 rounded-md hover:bg-light-gray/10 transition-colors text-off-white font-semibold text-16"
          >
            MEU PERFIL
          </button>

          <button onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-md hover:bg-light-gray/10 transition-colors text-off-white font-semibold text-16"
          >
            SAIR
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}
    </>
  );
};

