import { useEffect, useState } from "react";
import { isAdminIdentity } from "@/lib/sellerProfiles";

export function useAdminAccess(clerkUserId?: string, email?: string | null) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(Boolean(clerkUserId));

  useEffect(() => {
    let isMounted = true;

    async function checkAdmin() {
      if (!clerkUserId) {
        if (isMounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const result = await isAdminIdentity(clerkUserId, email);

      if (!isMounted) return;

      setIsAdmin(result);
      setLoading(false);
    }

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [clerkUserId, email]);

  return { isAdmin, loading };
}
