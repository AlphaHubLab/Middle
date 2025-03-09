import { useEffect, useState } from "react"

export default function CookieTest() {
  const getSession = async () => {
    const res = await fetch(`http://localhost:3000/api/auth/session`, {
      method: "GET",
      credentials: "include"
    })

    if (res.ok) {
      alert("ok")
      setAuthorized(true)
    } else {
      alert("error")
      setAuthorized(false)
    }
  }

  const signOut = async () => {
    const res = await fetch(`http://localhost:3000/api/auth/signout`, {
      method: "GET",
      credentials: "include"
    })

    if (res.ok) {
      alert("signed out")
      setAuthorized(false)
    } else {
      alert("error")
    }
  }

  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    ;(async () => await getSession())()
  }, [])

  if (!authorized)
    return (
      <div>
        <button
          onClick={() =>
            chrome.windows.create({
              url: `http://localhost:3000/auth?id=${chrome.runtime.id}`,
              type: "popup",
              width: 400,
              height: 500
            })
          }>
          Sign in with ethereum
        </button>
      </div>
    )
    
  return <div>Authorized!</div>
}
