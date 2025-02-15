export default function Page() {
  return (
    <>
      <button className="relative after:absolute after:content-[''] after:w-1/3 after:h-[calc(100%-4px)] after:top-[2px] after:left-[2px] after:rounded-l-2xl after:bg-gradient-to-r after:from-white/70 after:to-white/10 bg-gradient-to-l from-lime-200 to-emerald-300 shadow-md hover:shadow-lg shodow-emerald-200 transition-all duration-200 hover:rotate-[5deg] hover:scale-[1.05] w-[54px] h-[54px] rounded-2xl text-white">
        A
      </button>
      <button className="relative after:absolute after:content-[''] after:w-1/2 after:h-[calc(100%-4px)] after:top-[2px] after:left-[2px] after:rounded-l-2xl after:bg-gradient-to-r after:from-white/50 after:to-white/10 bg-gradient-to-l from-violet-600 to-fetch-primary shadow-md hover:shadow-lg shodow-emerald-200 transition-all duration-200 hover:rotate-[5deg] hover:scale-[1.05] w-[54px] h-[54px] rounded-2xl text-white">
        A
      </button>

      <button className="relative after:absolute after:content-[''] after:w-1/3 after:h-[calc(100%-4px)] after:top-[2px] after:left-[2px] after:rounded-l-2xl after:bg-gradient-to-r after:from-white/70 after:to-white/10 bg-gradient-to-l from-lime-200 to-emerald-300 shadow-md hover:shadow-lg shodow-emerald-200 transition-all duration-200 hover:rotate-[5deg] hover:scale-[1.05] w-[54px] h-[54px] rounded-2xl text-white">
        A
      </button>
      <button className="relative border-t border-t-violet-200 border-violet-100 outline outline-blue-zinc-100 after:absolute after:content-[''] after:h-3/5 after:w-[calc(100%-6px)] after:top-[2px] after:left-[3px] after:rounded-xl after:bg-gradient-to-t after:from-white/0 after:to-white/60 bg-gradient-to-t from-violet-500 to-fetch-primary shadow-md hover:shadow-lg shodow-emerald-200 transition-all duration-200 hover:rotate-[5deg] hover:scale-[1.05] w-[54px] h-[54px] rounded-2xl text-white">
        A
      </button>
      <button className="relative border-t border-t-violet-200 border-violet-100 outline outline-blue-zinc-100 after:absolute after:content-[''] after:h-3/5 after:w-[calc(100%-6px)] after:top-[2px] after:left-[3px] after:rounded-xl after:bg-gradient-to-t after:from-white/0 after:to-white/60 bg-gradient-to-t from-lime-200 to-emerald-500 shadow-md hover:shadow-lg shodow-emerald-200 transition-all duration-200 hover:rotate-[5deg] hover:scale-[1.05] w-[54px] h-[54px] rounded-2xl text-white">
        A
      </button>
      <button
        style={{ boxShadow: "inset 0px -10px 20px 10px white" }}
        className="relative border-t border-t-violet-200 border-violet-100 bg-gradient-to-t from-violet-500 to-fetch-primary shadow-md hover:shadow-lg shodow-emerald-200 transition-all duration-200 hover:rotate-[5deg] hover:scale-[1.05] w-[54px] h-[54px] rounded-2xl text-white">
        A
      </button>
      <button
        style={{ boxShadow: "inset 1px 20px 25px 1px rgb(75, 0, 180)" }}
        className="relative border-t border-t-violet-200 border-violet-100 bg-gradient-to-l from-pink-500/90 to-violet-200 shadow-md hover:shadow-lg shodow-emerald-200 transition-all duration-200 hover:rotate-[5deg] hover:scale-[1.05] w-[54px] h-[54px] rounded-2xl text-white">
        A
      </button>
      <button
        style={{ boxShadow: "inset 1px 1px 10px 1px rgb(0, 184, 6)" }}
        className="relative border-t border-t-violet-200 border-violet-100 bg-gradient-to-l from-emerald-500/90 to-lime-200 shadow-md hover:shadow-lg shodow-emerald-200 transition-all duration-200 hover:rotate-[5deg] hover:scale-[1.05] w-[54px] h-[54px] rounded-2xl text-white">
        A
      </button>
    </>
  )
}
