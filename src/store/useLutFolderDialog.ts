import { create } from 'zustand';

interface LutFolderDialogState {
  isOpen: boolean;
  name: string;
  revision: number;
  open: () => void;
  close: () => void;
  setName: (name: string) => void;
  markCreated: () => void;
}

export const useLutFolderDialog = create<LutFolderDialogState>((set) => ({
  isOpen: false,
  name: '',
  revision: 0,
  open: () => set({ isOpen: true, name: '' }),
  close: () => set({ isOpen: false }),
  setName: (name) => set({ name }),
  markCreated: () => set((state) => ({ revision: state.revision + 1 })),
}));
