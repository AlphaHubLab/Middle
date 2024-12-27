import { Space_Grotesk } from "next/font/google"

import OptionMain from "~components/pages/options"

const S = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"]
})

export default function Otions() {
  return (
    <div className={S.className}>
      <OptionMain isDev={true} />
    </div>
  )
}
