"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkerDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/worker");
  }, [router]);
  return null;
}
