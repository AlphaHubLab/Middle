import { LiaExternalLinkAltSolid } from "react-icons/lia"

export default function Link({ element, attributes, children }) {
  return (
    <a
      href={element.url}
      {...attributes}
      className="text-blue-600"
      target="_blank"
      rel="noopener noreferrer">
      {children}
      {/* <div className="bg-red-100">
        <LiaExternalLinkAltSolid />
      </div> */}
    </a>
  )
}
