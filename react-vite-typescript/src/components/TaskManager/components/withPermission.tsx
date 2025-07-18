import React from "react";
import { Navigate } from "react-router-dom";
import { hasPermissions, isAllowAccessForRoles } from "../auth.util";
import { useAuthStore } from "../auth.store";
import type { PermissionCheckMode } from "../auth.type";

const withPermissions = (permissions: string[], mode: PermissionCheckMode = "ANY") => {
  return function <P extends object>(Component: React.ComponentType<P>) {
    return function WithPermissionComponent(props: P) {
      const { user } = useAuthStore();

      if (!user) return <Navigate to="/login" replace />;

      const userRoles = user.roles;
      if (isAllowAccessForRoles(userRoles, ["root", "admin"])) {
        return <Component {...props} />;
      }

      const hasRequiredPermissions = hasPermissions(user.permissions, permissions, mode);
      if (!hasRequiredPermissions) return <Navigate to="/unauthorized" replace />;

      return <Component {...props} />;
    };
  };
};

export default withPermissions;
