interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-16 w-auto sm:h-18" }: LogoProps) {
  return (
    <img
      src="/logo/logo.png"
      alt="Meza"
      className={`object-contain ${className}`}
    />
  );
}