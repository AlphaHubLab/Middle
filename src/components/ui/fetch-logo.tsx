import PrimaryLogo from "~components/ui/svgs/primary"
import LogoType from "./svgs/logo-type"
export default function FetchLogo({ linkable = false }) {
  if (linkable)
    return (
      <a
        className="flex gap-2"
        href="#"
        target="_blank"
        rel="noopener noreferrer">
        <LogoType className="" />
      </a>
    )

  return (
    <>
      <LogoType className="h-[120px]" />
    </>
  )
}
