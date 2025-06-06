export const ViewNotes = ({ notes }: { notes: string[] }) => {
  return (
    <div className='bg-violet-300 w-full h-full p-4 rounded-lg shadow-lg mt-6'>
      <ul data-testid="notes_list" className='flex flex-col gap-4'>
        {notes.map((note, index) => (
          <li className='p-2 bg-white border border-amber-600 rounded-2xl' key={index}>{note}</li>
        ))}
      </ul>
    </div>
  )
}