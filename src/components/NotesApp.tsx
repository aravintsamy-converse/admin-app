'use client'
import React, { useState } from 'react'
import { NoteForm } from './NoteForm'
import { ViewNotes } from './ViewNotes'

const NotesApp = () => {
  const [notes, setNotes] = useState<string[]>([])
  return (
    <div className='bg-red-100 w-full h-full p-4 rounded-lg shadow-lg flex flex-col items-center justify-center'>

      <h1 className='text-2xl font-bold'>Notes</h1>
      <div className='w-full p-4 mt-8'>
        <NoteForm setNotes={setNotes} />
        <ViewNotes notes={notes} />
      </div>
    </div>
  )
}

export default NotesApp