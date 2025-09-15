import { create } from 'zustand'

// Función para inicializar el tema
const initializeTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('darkMode')
    const isDark = savedTheme === 'true' || savedTheme === null
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    return isDark
  }
  return true
}

interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  darkMode: boolean
  loading: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapsed: () => void
  setDarkMode: (dark: boolean) => void
  toggleDarkMode: () => void
  setLoading: (loading: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: typeof window !== 'undefined' ? 
    localStorage.getItem('sidebarCollapsed') === 'true' : 
    false,
  darkMode: initializeTheme(),
  loading: false,

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarCollapsed: (collapsed: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', collapsed.toString())
    }
    set({ sidebarCollapsed: collapsed })
  },
  
  toggleSidebarCollapsed: () => set((state) => {
    const newCollapsed = !state.sidebarCollapsed
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', newCollapsed.toString())
    }
    return { sidebarCollapsed: newCollapsed }
  }),
  
  setDarkMode: (dark: boolean) => {
    if (typeof window !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      // Guardar preferencia en localStorage
      localStorage.setItem('darkMode', dark.toString())
    }
    set({ darkMode: dark })
  },
  
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.darkMode
    if (typeof window !== 'undefined') {
      if (newDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      // Guardar preferencia en localStorage
      localStorage.setItem('darkMode', newDarkMode.toString())
    }
    return { darkMode: newDarkMode }
  }),
  
  setLoading: (loading: boolean) => set({ loading })
}))