import React from "react";

export default function AuthBackground() {
  return (
    <>
      <div className="absolute top-[-10%] left-[-15%] w-[450px] sm:w-[500px] h-[450px] sm:h-[500px] bg-teal-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[550px] sm:w-[600px] h-[550px] sm:h-[600px] bg-amber-100/25 rounded-full blur-[120px] pointer-events-none" />
    </>
  );
}
