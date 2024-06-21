import Link from "next/link";
import clsx from "clsx";

const baseStyles = {
  solid:
    "group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
  outline:
    "group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none",
};

const variantStyles = {
  solid: {
    primary:
      "bg-primary text-white md:hover:bg-primary-dark active:bg-primary-dark focus-visible:outline-primary dark:bg-primary-dark dark:text-foreground-dark md:hover:dark:bg-primary active:dark:bg-primary focus-visible:dark:outline-primary-dark",
    secondary:
      "bg-secondary text-white md:hover:bg-secondary-dark active:bg-secondary-dark focus-visible:outline-secondary dark:bg-secondary-dark dark:text-foreground-dark md:hover:dark:bg-secondary active:dark:bg-secondary focus-visible:dark:outline-secondary-dark",
    accent:
      "bg-accent text-white md:hover:bg-accent-dark active:bg-accent-dark focus-visible:outline-accent dark:bg-accent-dark dark:text-foreground-dark md:hover:dark:bg-accent active:dark:bg-accent focus-visible:dark:outline-accent-dark",
    white:
      "bg-white text-foreground-light md:hover:bg-gray-100 active:bg-gray-200 focus-visible:outline-white dark:bg-background-dark dark:text-foreground-dark md:hover:dark:bg-background-light active:dark:bg-background-light focus-visible:dark:outline-foreground-dark",
  },
  outline: {
    primary:
      "ring-primary text-primary md:hover:ring-primary-dark active:ring-primary-dark focus-visible:outline-primary dark:ring-primary-dark dark:text-foreground-dark md:hover:dark:ring-primary active:dark:ring-primary focus-visible:dark:outline-primary-dark",
    secondary:
      "ring-secondary text-secondary md:hover:ring-secondary-dark active:ring-secondary-dark focus-visible:outline-secondary dark:ring-secondary-dark dark:text-foreground-dark md:hover:dark:ring-secondary active:dark:ring-secondary focus-visible:dark:outline-secondary-dark",
    accent:
      "ring-accent text-accent md:hover:ring-accent-dark active:ring-accent-dark focus-visible:outline-accent dark:ring-accent-dark dark:text-foreground-dark md:hover:dark:ring-accent active:dark:ring-accent focus-visible:dark:outline-accent-dark",
    white:
      "ring-foreground-light text-foreground-light md:hover:ring-gray-400 active:ring-gray-600 focus-visible:outline-white dark:ring-foreground-dark dark:text-foreground-dark md:hover:dark:ring-gray-600 active:dark:ring-gray-800 focus-visible:dark:outline-foreground-dark",
  },
};

export function Button({
  variant = "solid",
  color = "primary",
  className,
  href,
  ...props
}: {
  variant?: "solid" | "outline";
  color?: "primary" | "secondary" | "accent" | "white";
  className?: string;
  href?: string;
  [key: string]: any;
}) {
  className = clsx(
    baseStyles[variant],
    (variantStyles[variant] as { [key: string]: string })[color],
    className
  );

  return href ? (
    <Link href={href} className={className} {...props} />
  ) : (
    <button className={className} {...props} />
  );
}
