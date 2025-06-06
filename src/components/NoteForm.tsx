import { useState } from "react"

export const NoteForm = ({ setNotes }: { setNotes: React.Dispatch<React.SetStateAction<string[]>> }) => {
  const [note, setNote] = useState<string>("")
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = note.trim()
    if (!value) return
    setNotes(prevNotes => [...prevNotes, value])
    setNote("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='w-full flex gap-4 items-center justify-center'>
        <input className='border-1 border-black rounded-2xl p-1' value={note} onChange={(e) => setNote(e.target.value)} type="text" placeholder="Note Title" />
        <button disabled={note.length === 0} className='bg-blue-300 border border-amber-600  rounded-2xl p-2' type="submit">Add Note</button>
      </div>
    </form>
  )
}