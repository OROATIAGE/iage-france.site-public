import { useEffect } from "react"

export default function ThemeSwitcher() {
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Apply dark mode by default only if the system prefers it AND it's not Safari
    if (prefersDark && !isSafari) {
      document.documentElement.classList.add("dark")
    } else {
      // Ensure light mode is set otherwise (or if it's Safari)
      document.documentElement.classList.remove("dark")
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