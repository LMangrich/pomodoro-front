"use client";

import { useUser } from "@/src/context/UserContext";
import { LoadingSplash } from "../LoadingSplash/LoadingSplash";

interface AuthCheckerProps {
  children: React.ReactNode;
}

export const AuthChecker = ({ children }: AuthCheckerProps) => {
  const { isLoading } = useUser();

  if (isLoading) {
    return <LoadingSplash />;
  }

  return <>{children}</>;
};
