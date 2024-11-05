export default function Page() {
  return (
    <div className="flex items-center justify-center bg-[#272727] h-screen gap-2">
      <div className="flex flex-col gap-2 items-center justify-center ">
        <div className="middle-btn-3 p-1 rounded-lg w-[272px] text-white h-[80px]">
          hey
        </div>
        <div className="middle-btn-3 p-1 rounded-lg w-[132px] text-white h-[80px]">
          hey
        </div>
        <div className="middle-btn-3 p-1 rounded-lg w-[80px] text-white h-[180px]">
          hey
        </div>
      </div>
      {/** For normal hover */}
      {/* <div className="flex flex-col gap-2 items-center justify-center ">
        <div className="relative w-[272px] h-[80px] group text-white">
          <div className="z-10 absolute w-full h-full top-0 left-0 middle-btn-static transition-all duration-300 rounded-lg">
            Hey
          </div>
          <div className="z-10 absolute w-full h-full top-0 left-0 middle-btn-hover transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-lg">
            Hey
          </div>
        </div>
        <div className="relative w-[132px] h-[80px] group text-white">
          <div className="z-10 absolute w-full h-full top-0 left-0 middle-btn-static transition-all duration-300 rounded-lg">
            Hey
          </div>
          <div className="z-10 absolute w-full h-full top-0 left-0 middle-btn-hover transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-lg">
            Hey
          </div>
        </div>
        <div className="relative w-[80px] h-[180px] group text-white">
          <div className="z-10 absolute w-full h-full top-0 left-0 middle-btn-static transition-all duration-300 rounded-lg">
            Hey
          </div>
          <div className="z-10 absolute w-full h-full top-0 left-0 middle-btn-hover transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-lg">
            Hey
          </div>
        </div>
      </div> */}
    </div>
  )
}
