import PrimaryLogo from "~components/ui/svgs/primary"

export default function FetchLogo({ linkable = false }) {
  if (linkable)
    return (
      <a
        className="flex gap-2"
        href="#"
        target="_blank"
        rel="noopener noreferrer">
        <span className="font-bold">Fetch</span>
        <PrimaryLogo className="h-full" />
      </a>
    )

  return (
    <>
      <span className="text-2xl font-semibold text-fetch-primary pl-2">Fetch</span>
      <PrimaryLogo className="h-full" />
    </>
  )
}
