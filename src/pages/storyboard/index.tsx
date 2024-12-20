import { Collapsible, Content, Toggle } from "~components/ui/collapsible"

export default function Page() {
  return (
    <div className="bg-red-100 border rounded-md">
      <Collapsible>
        <Toggle>Clock</Toggle>
        <Content>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
        </Content>
      </Collapsible>
    </div>
  )
}
