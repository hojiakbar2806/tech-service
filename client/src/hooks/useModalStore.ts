import { create } from "zustand";

type DrawerStore = {
  sideBar:boolean
  multiStepForm: boolean;
  filterbar: boolean;
  open: (type: keyof Omit<DrawerStore, "open" | "close">) => void;
  close: (type: keyof Omit<DrawerStore, "open" | "close">) => void;
};

const useDrawerStore = create<DrawerStore>((set) => ({
  multiStepForm: false,
  sideBar:false,
  filterbar: false,
  open: (type) => set({ [type]: true }),
  close: (type) => set({ [type]: false }),
}));

export default useDrawerStore;
