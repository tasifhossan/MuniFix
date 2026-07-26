import React from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function CtaBanner() {
  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-xl relative overflow-hidden">
        {/* Background vector circles */}
        <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] bg-brand-teal/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-white tracking-tight">Ready to make a difference?</h2>
          <p className="text-slate-350 text-sm sm:text-base leading-relaxed font-medium">
            Join thousands of Chattogram residents working together to improve our city's infrastructure one report at a time.
          </p>
        </div>
        <div className="relative z-10 pt-2">
          <Link href="/register">
            <Button variant="primary" className="bg-brand-teal hover:bg-brand-teal-hover py-3.5 px-8 rounded-full shadow-lg shadow-brand-teal/20 text-sm font-semibold">
              Report Your First Issue Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
