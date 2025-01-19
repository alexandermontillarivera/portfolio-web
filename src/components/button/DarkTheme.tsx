import styles from "@/css/button/DarkTheme.module.css"
import { DARK_THEME_CLASS_NAME, THEME, THEME_STORAGE_NAME } from '@/constants'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

export function ButtonDarkTheme() {
  const [isDark, setIsDark] = useState(() =>
    document.body.classList.contains(DARK_THEME_CLASS_NAME)
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(THEME_STORAGE_NAME)) {
        setIsDark(e.matches)
        document.body.classList.toggle(DARK_THEME_CLASS_NAME, e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev
      document.body.classList.toggle(DARK_THEME_CLASS_NAME, newValue)
      localStorage.setItem(THEME_STORAGE_NAME, newValue ? THEME.DARK : THEME.LIGHT)
      return newValue
    })
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles.button}
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
    >
      {isDark ? <IconSun className={styles.icon} /> : <IconMoon className={styles.icon} />}
    </button>
  )
}