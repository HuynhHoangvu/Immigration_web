import { create } from 'zustand'

interface EditModeState {
  isEditMode: boolean
  pendingChanges: Record<string, string>
  toggle: () => void
  enable: () => void
  disable: () => void
  setChange: (key: string, value: string) => void
  clearChanges: () => void
  changeCount: () => number
}

export const useEditModeStore = create<EditModeState>((set, get) => ({
  isEditMode: false,
  pendingChanges: {},

  toggle: () => set(s => ({ isEditMode: !s.isEditMode })),
  enable: () => set({ isEditMode: true }),
  disable: () => set({ isEditMode: false }),

  setChange: (key, value) =>
    set(s => ({ pendingChanges: { ...s.pendingChanges, [key]: value } })),

  clearChanges: () => set({ pendingChanges: {} }),

  changeCount: () => Object.keys(get().pendingChanges).length,
}))
