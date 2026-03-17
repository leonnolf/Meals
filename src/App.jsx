import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

function HomePage() {
  return (
    <section>
      <h1>Home</h1>
      <p>Welkom in je simpele React Router project.</p>
    </section>
  )
}

function AboutPage() {
  return (
    <section>
      <h1>About</h1>
      <p>Deze pagina toont hoe routing werkt met een aparte URL.</p>
    </section>
  )
}

function ContactPage() {
  return (
    <section>
      <h1>Contact</h1>
      <p>Contacteer ons via contact@example.com.</p>
    </section>
  )
}

function App() {
  return (
    <main className="container">
      <nav className="nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </main>
  )
}

export default App
