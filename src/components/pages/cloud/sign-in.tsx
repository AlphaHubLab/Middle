import ButtonFull from "~components/ui/buttons/full-w-buttons"
import { Section } from "~components/ui/typograrphy"

const fetchUrl = process.env.PUBLIC_PLASMO_FETCH_URL || "http://localhost:3000"

export default function SignIn() {
  return (
    <Section title="Log in">
      <div className="h-[500px]">
        <div className="h-1/2 flex flex-col justify-center">
          <h2 className="w-full text-center font-medium text-xl">
            Log in to your cloud space
          </h2>
          <p className="text-black/50 w-full text-center">
            Manage your backups, share task with the world, and more!
          </p>
        </div>
        <div className="h-1/2 flex flex-col justify-end">
          <ButtonFull
            variant="primary"
            onClick={() =>
              chrome.windows.create({
                url: `${fetchUrl}/auth`,
                type: "popup",
                width: 400,
                height: 600
              })
            }>
            Sign in with ethereum
          </ButtonFull>
        </div>
      </div>
    </Section>
  )
}
