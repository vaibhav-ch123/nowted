import { SideBar } from './components/SideBar'
import { NoteList } from './components/NoteList'
import { NoteDetail } from './components/NoteDetail'

function App() {

  return (
    <>
     <main className='flex h-screen'>
      <SideBar />
      <NoteList />
      <NoteDetail />
     </main>
    </>
  )
}

export default App
