import { Command } from "cmdk"
import { useEffect, useState } from "react"

export const CommandMenu = () => {
  const [open, setOpen] = useState(true)

  // Toggle the menu when ⌘K is pressed
  // useEffect(() => {
  //   const down = (e) => {
  //     if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault()
  //       setOpen((open) => !open)
  //     }
  //   }

  //   document.addEventListener("keydown", down)
  //   return () => document.removeEventListener("keydown", down)
  // }, [])

  return (
    <div>
      <p>Search (test)</p>
      {/* <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"> */}
      <Command>
        <Command.Input />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          {/* <Command.Group heading="Letters"> */}
          <Command.Item>a</Command.Item>
          <Command.Item>b</Command.Item>
          {/* <Command.Separator /> */}
          <Command.Item>c</Command.Item>
          {/* </Command.Group> */}

          <Command.Item>Apple</Command.Item>
        </Command.List>
      </Command>
      {/* </Command.Dialog> */}
    </div>
  )
}
