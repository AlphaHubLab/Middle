import "../style.css"

import { Space_Grotesk } from "next/font/google"

import Layout from "./Layout"

// import Main from "~components/main"

// const SG = Space_Grotesk({
//   weight: ["300", "400", "500", "600", "700"],
//   subsets: ["latin"]
// })

export default function Page() {
  return (
    <Layout>
      <div className="flex h-screen">
        <div role="content" className="flex w-full md:w-[calc(100%-350px)] bg-green-200">
          a
        </div>
        <div
          role="sidebar"
          className="flex hidden md:flex w-[350px] bg-green-200">
          b
        </div>
      </div>
    </Layout>
  )
}
