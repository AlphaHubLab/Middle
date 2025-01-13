import { useState } from "react"

export default function Otions() {
  const [state, setState] = useState({}) // does rerender
  const [store, setStore] = useState({ a: "abc", b: { c: "cba" } })
  const [copy, setCopy] = useState({})

  const handleStoreChnage = () => {}
  
  return (
    <div className="*-block">
      <button onClick={() => setState({})}>Rerender With empty object</button>
      <button onClick={() => setCopy(store)}>copy</button>
      <input />
    </div>
  )
}
