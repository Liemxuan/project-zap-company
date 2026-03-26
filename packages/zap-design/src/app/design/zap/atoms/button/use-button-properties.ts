import { create } from 'zustand';
import { ButtonState } from './schema';

interface ButtonPropertiesStore extends ButtonState {
  setVisualStyle: (visualStyle: ButtonState['visualStyle']) => void;
  setVariant: (variant: ButtonState['variant']) => void;
  setSize: (size: ButtonState['size']) => void;
  setPlatform: (platform: ButtonState['platform']) => void;
  reset: () => void;
}

const initialState: ButtonState = {
  visualStyle: 'solid',
  variant: 'flat',
  size: 'medium',
  color: 'primary',
  platform: 'agnostic',
};

export const useButtonProperties = create<ButtonPropertiesStore>((set) => ({
  ...initialState,
  setVisualStyle: (visualStyle) => set({ visualStyle }),
  setVariant: (variant) => set({ variant }),
  setSize: (size) => set({ size }),
  setPlatform: (platform) => set({ platform }),
  reset: () => set(initialState),
}));
