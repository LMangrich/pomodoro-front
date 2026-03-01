"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import { LoadingSplash } from "@/src/components/LoadingSplash/LoadingSplash";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  redirectTo = "/login" 
}: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading splash while checking authentication
  if (isLoading) {
    return <LoadingSplash />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
