"use client";

export const LoadingSplash = () => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-border"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-custom-light-purple border-r-custom-light-purple animate-spin"></div>
        </div>
        {/* Text */}
        <p className="text-off-white text-14 font-semibold">Carregando...</p>
      </div>
    </div>
  );
};
