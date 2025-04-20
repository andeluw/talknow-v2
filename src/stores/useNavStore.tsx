import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { produce } from 'immer';
import { create } from 'zustand';

type NavStoreType = {
  active: string;
  setActive: (name: string) => void;
};

const useNavStoreBase = create<NavStoreType>((set) => ({
  active: 'home',
  setActive: (name) =>
    set(
      produce<NavStoreType>((state) => {
        state.active = name;
      })
    ),
}));

const useNavStore = createSelectorHooks(useNavStoreBase);

export default useNavStore;
