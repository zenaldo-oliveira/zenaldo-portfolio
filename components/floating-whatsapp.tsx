"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsapp() {
  return (
    <Link
      href="https://wa.me/5565992832422"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-[#25D366]
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]
      "
    >
      <MessageCircle size={26} strokeWidth={2.5} />
    </Link>
  );
}
