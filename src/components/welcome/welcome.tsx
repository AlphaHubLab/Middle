import { useState } from "react"
import { PiXLogo } from "react-icons/pi"

import Fade from "~components/fade/fade"

const steps = 6
export default function Welcome({ isDev = false }) {
  const [page, setPage] = useState(0)
  const [action, setAction] = useState("next")
  const [follow, setFollow] = useState(false)
  const [wallet, setWallet] = useState("")
  const [plan, setPlan] = useState("free")

  const next = () => {
    if (page + 1 > steps) return
    setPage(page + 1)
    setAction("next")
  }

  const prev = () => {
    if (page === 0) return
    setPage(page - 1)
    setAction("prev")
  }

  const jumpToStep = (step: number) => {
    setPage(step)
    if (step > page) setAction("next")
    else setAction("prev")
  }

  const onStart = () => {
    const index_url = "/tabs/start.html"
    if (!isDev) {
      chrome.tabs.create({
        url: index_url
      })
    } else {
      window.open("/dev-1", "_blank")
    }
  }

  //   const register
  return (
    <div className="relative overflow-hidden w-screen h-screen flex items-center justify-center">
      <Fade show={page === 0} type={action}>
        <StepsLayout onNext={next}>
          <div className="w-full h-full">
            <div className="h-1/3 flex items-center justify-center text-black/90">
              <h1 className="text-4xl font-medium">Welcome</h1>
            </div>
            <div className="h-2/3 flex justify-center text-black/70">
              <p className="text-sm">Some intruduction</p>
            </div>
          </div>
        </StepsLayout>
      </Fade>
      <Fade show={page === 1} type={action}>
        <StepsLayout onNext={next} onPrev={prev}>
          <div className="w-full h-full">
            <div className="h-1/3 flex flex-col items-center justify-center text-black/90">
              <h1 className="text-4xl font-medium">Fetch</h1>
              <h1 className="text-2xl">The Best thing ever happened</h1>
            </div>
            <div className="h-2/3 flex justify-center text-black/70">
              <p className="text-sm">Some intruduction</p>
            </div>
          </div>
        </StepsLayout>
      </Fade>
      <Fade show={page === 2} type={action}>
        <StepsLayout
          onNext={plan === "free" ? () => jumpToStep(4) : next}
          onPrev={prev}>
          <div className="w-full h-full">
            <div className="h-1/3 flex flex-col items-center justify-center text-black/90">
              <h1 className="text-4xl font-medium">Choose your plan</h1>
            </div>
            <div className="h-2/3 flex justify-center items-center">
              <div className="flex w-full justify-around gap-2">
                <div
                  onClick={() => setPlan("free")}
                  className={`${plan === "free" ? "border-fetch-primary bg-violet-50" : "hover:bg-slate-50 hover:cursor-pointer"} basis-1/2 px-1 rounded-2xl border border-balck/15`}>
                  <h1 className="mt-2 text-center border-b-[1px] font-medium text-black/90">
                    Free for Ever
                  </h1>
                  <div className="text-black/50">
                    <div className="py-2 w-full">
                      <p className="text-sm font-medium text-center w-full text-black/70">
                        Storage: Local
                      </p>
                      <p className="text-xs text-center h-16">
                        Without regular backups, your data may be lost if you
                        uninstall your browser or clear your storage.
                      </p>
                    </div>
                    <div className="py-2 w-full">
                      <p className="text-sm font-medium text-center w-full text-black/70">
                        Backup: Manual
                      </p>
                      <p className="text-xs text-center h-10">
                        For a small fee, you can back up your data whenever you
                        want
                      </p>
                    </div>
                    <div className="py-2 w-full">
                      <p className="text-sm font-medium text-center w-full text-black/70">
                        Share accross devices: Manually
                      </p>
                      <p className="text-xs text-center h-10">
                        You can share your data between devices using your
                        backups
                      </p>
                    </div>
                    <div className="py-2 w-full">
                      <p className="text-sm font-medium text-center w-full text-black/70">
                        No Regsitration needed
                      </p>
                      <p className="text-xs text-center h-10">
                        All your check-in points will be stored on blockchain.
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setPlan("premium")}
                  className={`${plan === "premium" ? "border-fetch-primary bg-violet-50" : "hover:bg-slate-50 hover:cursor-pointer"} basis-1/2 px-1 rounded-2xl border border-balck/15`}>
                  <h1 className="mt-2 text-center border-b-[1px] font-medium text-black/90">
                    Premium
                  </h1>
                  <div className="text-black/50">
                    <div className="py-2 w-full">
                      <p className="text-sm font-medium text-center w-full text-black/70">
                        Storage: Cloud & Local
                      </p>
                      <p className="text-xs text-center h-16">
                        No need to worry—we store your tasks for you.
                      </p>
                    </div>
                    <div className="py-2 w-full">
                      <p className="text-sm font-medium text-center w-full text-black/70">
                        Backup: Automatic
                      </p>
                      <p className="text-xs text-center h-10">
                        No need for manual backups, but you can create one if
                        you want.
                      </p>
                    </div>
                    <div className="py-2 w-full">
                      <p className="text-sm font-medium text-center w-full text-black/70">
                        Share accross devices: Automatic
                      </p>
                      <p className="text-xs text-center h-10">
                        Your tasks are shared across all devices where you're
                        logged in.
                      </p>
                    </div>
                    <div className="py-2 w-full">
                      <p className="text-sm font-medium text-center w-full text-black/70">
                        Regsitration needed
                      </p>
                      <p className="text-xs text-center h-10">
                        Check-in points stored on blockchain. 2x on check-in
                        points.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-1/2 flex items-center"></div>
            </div>
          </div>
        </StepsLayout>
      </Fade>
      <Fade show={page === 3} type={action}>
        <StepsLayout onNext={next} onPrev={prev} nextLabel={"Next"}>
          <div className="w-full h-full">
            <div className="h-1/3 flex flex-col items-center justify-center text-black/90">
              <h1 className="text-4xl font-medium">Register</h1>
            </div>
            <div className="h-2/3 flex items-center flex-col justify-center text-black/70">
              <p className="text-sm h-1/2 flex text-center">
                Register on Fetch.wtf and come back here. You can log in to your
                account on the extension page later.
              </p>
              <div className="h-1/2 flex items-center">
                <a
                  href="https://x.com/intent/follow?screen_name=fetch_wtf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 items-center justify-center py-3 px-2 rounded-xl text-sm w-44 bg-black/90 hover:bg-black/70 text-white/90">
                  Regsiter on Fetch.wtf
                </a>
              </div>
            </div>
          </div>
        </StepsLayout>
      </Fade>
      <Fade show={page === 4} type={action}>
        <StepsLayout
          onNext={next}
          onPrev={plan === "free" ? () => jumpToStep(2) : prev}
          nextLabel={!follow ? "Follow" : "Next"}
          nextDisable={!follow ? true : false}>
          <div className="w-full h-full">
            <div className="h-1/3 flex flex-col items-center justify-center text-black/90">
              <h1 className="text-4xl font-medium">Just one more step</h1>
            </div>
            <div className="h-2/3 flex items-center flex-col justify-center text-black/70">
              <p className="text-sm h-1/2 flex-items-center">
                You can get more info and...
              </p>
              <div className="h-1/2 flex items-center">
                <a
                  onClick={() => setFollow(true)}
                  href="https://x.com/intent/follow?screen_name=fetch_wtf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 items-center justify-center py-3 px-2 rounded-xl text-sm w-44 bg-black/90 hover:bg-black/70 text-white/90">
                  Follow Fetch{"( )"} on <PiXLogo />
                </a>
              </div>
            </div>
          </div>
        </StepsLayout>
      </Fade>
      <Fade show={page === 5} type={action}>
        <StepsLayout onNext={onStart} onPrev={prev} nextLabel="Let's go!">
          <div className="w-full h-full">
            <div className="h-1/2 flex flex-col items-center justify-center text-black/90">
              <h1 className="text-4xl font-medium">Are you ready?</h1>
            </div>
            <div className="h-1/2 flex justify-center text-black/70">
              <p className="text-sm">Some intruduction</p>
            </div>
          </div>
        </StepsLayout>
      </Fade>
    </div>
  )
}

const StepsLayout = ({
  children,
  onNext = null,
  nextLabel = "Next",
  nextDisable = false,
  onPrev = null,
  prevLabel = "Back",
  prevDisable = false
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center absolute top-0 left-0">
      <div className="w-full max-w-[600px] h-full max-h-[800px] px-2">
        <div className="w-full h-[calc(100%-60px)]">{children}</div>
        <div className="w-full h-[60px] flex p-2">
          <div className="w-1/2 flex justify-start">
            {onPrev && (
              <button
                className="disabled:text-white disabled:bg-inherit disabled:text-black/20 w-36 rounded-xl hover:bg-black/5 text-black/50"
                disabled={prevDisable}
                onClick={onPrev}>
                {prevLabel}
              </button>
            )}
          </div>
          <div className="w-1/2 flex justify-end">
            {onNext && (
              <button
                className="disabled:text-white disabled:bg-zinc-300 w-36 rounded-xl bg-fetch-primary text-white/90 hover:bg-violet-800"
                disabled={nextDisable}
                onClick={onNext}>
                {nextLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
