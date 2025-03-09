import type { ReactNode } from "react";

export const Section = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={`my-4 border-fetch-primary bg-white rounded-3xl px-4 pt-2 pb-4 ${className}`}
    >
      <h1 className="font-semibold mb-2 text-black/90 border-b-[1px]">
        {title}
      </h1>
      {children}
    </section>
  );
};

export const SubSection = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`bg-fetch-secondary/40 my-4 last:mb-0 last:mb-0 px-4 pt-3 pb-4 rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
};

export const P = ({ children }: { children: ReactNode }) => {
  return <p className="my-4 text-sm text-black/70 w-full">{children}</p>;
};

export const Note = ({
  variant = "neutral",
  children,
}: {
  variant: "neutral" | "green" | "orange" | "red";
  children: ReactNode;
}) => {
  const classes = {
    neutral: "bg-zinc-300/30 border-zinc-300 text-black/90",
    green: "bg-emerald-300/30 border-emerald-300/90 text-emerald-700/90",
    orange: "bg-yellow-300/30 border-yellow-300/90 text-yellow-700/90",
    red: "bg-rose-200/50 border-rose-200/90 text-rose-600/90",
  };

  return (
    <p
      className={`my-2 border-[1px] text-sm rounded-2xl px-3 py-2 ${classes[variant]}`}
    >
      {children}
    </p>
  );
};
