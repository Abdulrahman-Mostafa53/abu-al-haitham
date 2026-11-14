import { useOutletContext } from "react-router-dom";

/** Values the layout shares with every portal page (via <Outlet context>) */
export interface PortalOutletContext {
  query: string;
}

export const usePortalContext = () => useOutletContext<PortalOutletContext>();
