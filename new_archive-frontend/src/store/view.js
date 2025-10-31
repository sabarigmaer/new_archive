import { create } from "zustand";

const useView = create((set) => ({
  view: "grid",
  toggleView: () =>
    set((state) => ({ view: state.view === "grid" ? "full" : "grid" })),
}));

export default useView;
