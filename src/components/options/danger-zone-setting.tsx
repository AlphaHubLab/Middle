import { Section } from "~components/ui/typograrphy"
import { useDraft } from "~contexts/draft-context"
import { usePersist } from "~contexts/persist-context"

export default function DangerZoneSetting() {
  const { setDrafts } = useDraft()
  const { setTasks, setHistory } = usePersist()

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
