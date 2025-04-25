import { useEffect } from "react"

export default function ThemeSwitcher() {
  useEffect(() => {
    // Par défaut, suit la préférence système
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
  }

  return (
    <button onClick={toggleTheme} className="ml-4 p-2" aria-label="Changer le thème">
      <span role="img" aria-label="Changer le thème">🌓</span>
    </button>
  )
} 