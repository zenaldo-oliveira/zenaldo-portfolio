import type { ReactNode } from "react";

type ContainerSize = "sm" | "md" | "lg" | "xl";

const SIZES: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
};

type ContainerProps = {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
};

export function Container({
  children,
  size = "xl",
  className = "",
}: ContainerProps) {
  return (
    <div className={`mx-auto w-full ${SIZES[size]} ${className}`}>
      {children}
    </div>
  );
}
