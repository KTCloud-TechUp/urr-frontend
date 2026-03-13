"use client";

import {
  createContext,
  useReducer,
  useCallback,
  useContext,
} from "react";
import type { ReactNode } from "react";

// --- Types ---
interface LayoutState {
  sidebarState: "expanded" | "collapsed";
  expandedArtistIds: Set<string>;
}

type LayoutAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR"; payload: "expanded" | "collapsed" }
  | { type: "TOGGLE_ARTIST"; payload: string }
  | { type: "EXPAND_ARTIST"; payload: string }
  | { type: "COLLAPSE_ARTIST"; payload: string };

export interface LayoutContextValue {
  state: LayoutState;
  toggleSidebar: () => void;
  setSidebar: (state: "expanded" | "collapsed") => void;
  toggleArtist: (artistId: string) => void;
  expandArtist: (artistId: string) => void;
  collapseArtist: (artistId: string) => void;
  isSidebarExpanded: boolean;
  isArtistExpanded: (artistId: string) => boolean;
}

// --- Initial state ---
const initialState: LayoutState = {
  sidebarState: "expanded",
  expandedArtistIds: new Set<string>(),
};

// --- Reducer ---
function layoutReducer(state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        sidebarState: state.sidebarState === "expanded" ? "collapsed" : "expanded",
      };
    case "SET_SIDEBAR":
      return { ...state, sidebarState: action.payload };
    case "TOGGLE_ARTIST": {
      const next = new Set(state.expandedArtistIds);
      if (next.has(action.payload)) {
        next.delete(action.payload);
      } else {
        next.add(action.payload);
      }
      return { ...state, expandedArtistIds: next };
    }
    case "EXPAND_ARTIST": {
      if (state.expandedArtistIds.has(action.payload)) return state;
      const next = new Set(state.expandedArtistIds);
      next.add(action.payload);
      return { ...state, expandedArtistIds: next };
    }
    case "COLLAPSE_ARTIST": {
      if (!state.expandedArtistIds.has(action.payload)) return state;
      const next = new Set(state.expandedArtistIds);
      next.delete(action.payload);
      return { ...state, expandedArtistIds: next };
    }
    default:
      return state;
  }
}

// --- Context ---
export const LayoutContext = createContext<LayoutContextValue | null>(null);

// --- Provider ---
export function LayoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(layoutReducer, initialState);

  const toggleSidebar = useCallback(() => dispatch({ type: "TOGGLE_SIDEBAR" }), []);
  const setSidebar = useCallback(
    (s: "expanded" | "collapsed") => dispatch({ type: "SET_SIDEBAR", payload: s }),
    [],
  );
  const toggleArtist = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_ARTIST", payload: id }),
    [],
  );
  const expandArtist = useCallback(
    (id: string) => dispatch({ type: "EXPAND_ARTIST", payload: id }),
    [],
  );
  const collapseArtist = useCallback(
    (id: string) => dispatch({ type: "COLLAPSE_ARTIST", payload: id }),
    [],
  );

  const value: LayoutContextValue = {
    state,
    toggleSidebar,
    setSidebar,
    toggleArtist,
    expandArtist,
    collapseArtist,
    isSidebarExpanded: state.sidebarState === "expanded",
    isArtistExpanded: (id: string) => state.expandedArtistIds.has(id),
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

// --- Hook ---
export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
}
