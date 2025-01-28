import PrimaryLogo from "~components/ui/svgs/primary"

export default function FetchLogo({ linkable = false }) {
  if (linkable)
    return (
      <a
        className="flex gap-2"
        href="#"
        target="_blank"
        rel="noopener noreferrer">
        <PrimaryLogo className="h-full" />
        <span className="font-bold">Fetch</span>
      </a>
    )

  return (
    <>
      <PrimaryLogo className="h-full" />
      <span className="font-bold">Fetch</span>
    </>
  )
}
