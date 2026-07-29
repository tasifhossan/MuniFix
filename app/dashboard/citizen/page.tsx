"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Fallback: if somehow landed here, go to the citizen dashboard
export default function CitizenDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}
