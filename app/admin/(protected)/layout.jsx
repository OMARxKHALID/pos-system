"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart3,
  Package,
  LogOut,
  Menu,
  Users,
  ClipboardList,
  Home,
  Settings,
  Tag,
} from "lucide-react";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/hooks/zustand/use-user-store";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { capitalizeFirst, extractInitials } from "@/utils/string-utils";
import { filterNavLinksByPermissions } from "@/utils/permission-utils";

const NAV_LINKS = [
  { href: "/", label: "POS", icon: Home },
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: BarChart3,
    prefetch: true,
    permission: "dashboard",
  },
  {
    href: "/admin/menu",
    label: "Menu",
    icon: Package,
    permission: "menu",
  },
  {
    href: "/admin/category",
    label: "Categories",
    icon: Tag,
    permission: "category",
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ClipboardList,
    permission: "orders",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    permission: "users",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    permission: "settings",
  },
];

const NavLink = ({ href, label, icon: Icon, prefetch = false }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-200",
        isActive
          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
      prefetch={prefetch}
    >
      <Icon
        className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400")}
      />
      <span>{label}</span>
    </Link>
  );
};

const SidebarContent = () => {
  const { user } = useUserStore();
  const { data: session } = useSession();
  const { status } = useSession();
  const isLoading = status === "loading";

  // Filter navigation links based on user permissions using centralized utility
  const filteredNavLinks = filterNavLinksByPermissions(
    NAV_LINKS,
    session?.user
  );

  return (
    <div className="flex flex-col h-full ">
      {/* User Profile */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <>
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src="/placeholder-user.jpg"
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="font-semibold text-blue-600 bg-blue-100">
                  {user?.name ? extractInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {user?.name || "Unknown User"}
                </h2>
                <p className="text-sm text-gray-500">
                  {user?.role ? capitalizeFirst(user.role) : "Role"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <form action="/api/auth/signout" method="post">
          <Button
            type="submit"
            variant="ghost"
            className="justify-start w-full gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
        </form>
      </div>
    </div>
  );
};

export default function AdminLayout({ children }) {
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useAdminSidebarStore();

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <Sidebar
          className="hidden bg-white border-r shadow-sm md:flex"
          collapsible="offcanvas"
        >
          <SidebarContent />
        </Sidebar>

        {/* Mobile Sidebar Trigger */}
        <div className="fixed z-50 top-4 left-4 md:hidden">
          <SidebarTrigger className="p-2 bg-white border rounded-lg shadow-md">
            <Menu className="w-5 h-5" />
          </SidebarTrigger>
        </div>

        {/* Main Content */}
        <SidebarInset className="flex-1">
          <div className="min-h-screen">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
