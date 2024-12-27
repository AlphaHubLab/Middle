import { Section } from "~components/ui/text"
import { useDraftContext } from "~contexts/draft-context"
import { usePersistContext } from "~contexts/persisting-context"

export default function DangerZoneSetting() {
  const { setDrafts } = useDraftContext()
  const { setTasks, setHistory } = usePersistContext()

  return (
    <Section title="Danger zone!">
      <div>
        <button onClick={() => setDrafts([])}>Delete Drafts!</button>
      </div>
      <div>
        <button onClick={() => setHistory([])}>Delete History!</button>
      </div>
      <div>
        <button onClick={() => setTasks([])}>Delete Tasks!</button>
      </div>
    </Section>
  )
}
