"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsapp() {
  return (
    <Link
      href="https://wa.me/5565992832422"
      target="_blank"
      aria-label="WhatsApp"
      className="
        fixed
        bottom-6
        right-6
        z-30
        flex
        items-center
        justify-center
        rounded-full
        bg-[#25D366]
        p-3
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]

        sm:gap-2
        sm:px-4
      "
    >
      <MessageCircle size={22} />

      <span className="hidden sm:block text-sm font-semibold">Fale comigo</span>
    </Link>
  );
}
