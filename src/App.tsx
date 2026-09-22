import { SideBar } from './components/SideBar'
import { NoteList } from './components/NoteList'
// import { RestoreNotePage } from './components/RestoreNotePage'
// import { SelectNotePage } from './components/SelectNotePage'
import { NoteDetail } from './components/NoteDetail'

function App() {

  return (
    <>
     <main className='flex h-screen'>
      <SideBar />
      <NoteList />
      <NoteDetail />
      {/* <SelectNotePage /> */}
      {/* <RestoreNotePage /> */}
     </main>
    </>
  )
}

export default App
