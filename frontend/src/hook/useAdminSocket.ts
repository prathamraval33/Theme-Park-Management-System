import { useEffect } from "react";
import { socket } from "../socket";

export const useAdminSocket = (callback: () => void) => {

  useEffect(() => {

    socket.on("adminUpdated", callback);

    return () => {
      socket.off("adminUpdated", callback);
    };

  }, [callback]);

};