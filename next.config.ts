import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Páginas do antigo portfólio pessoal: a capacidade técnica real foi para
  // /about#tecnologias. Redirecionamento permanente (308) preserva links e
  // indexação existentes.
  async redirects() {
    return [
      { source: "/skills", destination: "/about#tecnologias", permanent: true },
      { source: "/certificates", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
