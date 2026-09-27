import Image from "next/image";

type AboutProfilePhotoProps = {
  name: string;
  role: string;
};

// Retrato do fundador (foto real, sem edição da imagem). Recorte 4:5 centrado
// no rosto, borda fina e legenda sobre um degradê escuro na base — apresenta
// o fundador, sem cara de foto de currículo. Estático: sem animação contínua.
export function AboutProfilePhoto({ name, role }: AboutProfilePhotoProps) {
  return (
    <figure className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-2xl border border-border-strong bg-surface-strong shadow-[0_30px_80px_-40px_rgba(2,6,23,0.8)]">
      <Image
        src="/projects/profile.jpeg"
        alt={name}
        fill
        sizes="(min-width: 1024px) 384px, 90vw"
        className="object-cover object-[center_22%]"
      />
      {/* Degradê fixo (independe do tema) para a legenda ficar legível. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/75 via-black/30 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-base font-semibold tracking-tight text-white">{name}</p>
        <p className="mt-0.5 text-sm text-white/80">{role}</p>
      </figcaption>
    </figure>
  );
}
