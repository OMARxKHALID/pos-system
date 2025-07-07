"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/utils/permission-utils";
import { AlertTriangle, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEFAULT_REDIRECT_PATH = "/admin/dashboard";

const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

const AuthCard = ({ title, children, icon: Icon = Shield }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-red-600" />
        </div>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">{children}</CardContent>
    </Card>
  </div>
);

/**
 * Permission Guard Component
 *
 * Wraps content that requires specific permissions to access.
 * Provides a fallback UI when user lacks required permissions.
 */
export function PermissionGuard({
  requiredPermission,
  children,
  fallback = null,
  showFallback = true,
  redirectOnDeny = false,
  redirectPath = DEFAULT_REDIRECT_PATH,
}) {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hasCheckedParams, setHasCheckedParams] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Clear permission error params from URL
  useEffect(() => {
    if (hasCheckedParams || status === "loading") return;

    const error = searchParams.get("error");
    const requiredPerm = searchParams.get("required_permission");

    if (
      error === "insufficient_permissions" &&
      requiredPerm === requiredPermission
    ) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      newUrl.searchParams.delete("required_permission");
      window.history.replaceState({}, "", newUrl.toString());
    }

    setHasCheckedParams(true);
  }, [searchParams, status, hasCheckedParams, requiredPermission]);

  // Handle redirect when permission is denied
  useEffect(() => {
    if (
      redirectOnDeny &&
      session?.user &&
      !hasPermission(session.user, requiredPermission) &&
      !isRedirecting
    ) {
      setIsRedirecting(true);
      router.push(redirectPath);
    }
  }, [
    redirectOnDeny,
    session,
    requiredPermission,
    isRedirecting,
    router,
    redirectPath,
  ]);

  // Loading state
  if (status === "loading") {
    return <LoadingSpinner message="Checking permissions..." />;
  }

  // Not authenticated
  if (!session?.user) {
    return (
      <AuthCard title="Authentication Required">
        <p className="text-gray-600 mb-4">
          You need to be logged in to access this page.
        </p>
        <Button onClick={() => router.push("/admin/login")} className="w-full">
          Go to Login
        </Button>
      </AuthCard>
    );
  }

  const hasAccess = hasPermission(session.user, requiredPermission);

  // User has permission
  if (hasAccess) {
    return <>{children}</>;
  }

  // Redirecting
  if (redirectOnDeny && isRedirecting) {
    return <LoadingSpinner message="Redirecting..." />;
  }

  // Don't show fallback
  if (!showFallback) {
    return null;
  }

  // Custom fallback
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default access denied UI
  return (
    <AuthCard title="Access Denied">
      <p className="text-gray-600 mb-4">
        You don't have permission to access this page. Please contact your
        administrator if you believe this is an error.
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
        <AlertTriangle className="w-4 h-4" />
        <span>Required permission: {requiredPermission}</span>
      </div>
      <div className="space-y-2">
        <Button
          onClick={() => router.push(redirectPath)}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <Button
          onClick={() => router.push("/admin/login")}
          variant="ghost"
          className="w-full"
        >
          Switch Account
        </Button>
      </div>
    </AuthCard>
  );
}

/**
 * Higher-order component for protecting pages
 */
export function withPermission(Component, requiredPermission) {
  const PermissionProtectedComponent = (props) => (
    <PermissionGuard requiredPermission={requiredPermission}>
      <Component {...props} />
    </PermissionGuard>
  );

  // Set display name for debugging
  PermissionProtectedComponent.displayName = `withPermission(${
    Component.displayName || Component.name
  })`;

  return PermissionProtectedComponent;
}
