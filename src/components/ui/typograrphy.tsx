export const Section = ({ title, children }) => {
  return (
    <section className="my-6 border-2 border-fetch-primary rounded-3xl p-4 pt-2">
      <h1 className="font-medium text-medium text-black/80 border-b-[1px]">
        {title}
      </h1>
      {children}
    </section>
  )
}

export const P = ({ children }) => {
  return <p className="my-4 text-sm text-black/70 w-full">{children}</p>
}

export const Note = ({ variant = "neutral", children }) => {
  const classes = {
    neutral: "bg-zinc-300/50 border-zinc-300 text-zinc-700",
    green: "bg-emerald-300/50 border-emerald-300 text-emerald-700",
    orange: "bg-yellow-300/50 border-yellow-300 text-yellow-700",
    red: "bg-rose-200/50 border-rose-200 text-rose-600"
  }

  return (
    <p
      className={`my-2 border-[1px] text-sm rounded-2xl py-1 px-2 ${classes[variant]}`}>
      {children}
    </p>
  )
}
