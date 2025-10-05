import { useState } from 'react'
import UserForm from './components/UserForm'

function App() {
  

  return (
    <div>
     <header style={{ padding: 12, borderBottom: '1px solid #ddd'}}>
        <h1 style={{ margin:0 }}>Dev Connect (MERN)</h1>
      </header>
      <main>
        <UserForm />
      </main>
    </div>
  );
}

export default App
