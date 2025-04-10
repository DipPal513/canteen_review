import { DuLogo } from "@/components/du-logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Providers } from "@/src/context/Provider";
import axios from "axios";
import { Home, LogOut, Menu, Plus, Star, User, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import toast from "react-hot-toast";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
      if (res?.status == 200) {
        toast.success("Successfully Logged out!");
      }
    } catch (error) {
      toast.error("Failed to logout!");
    }
  };
  return (
    <div className="min-h-dvh flex flex-col">
     

      <div className="flex flex-1">
        <aside className="w-64 border-r border-gray-200 hidden md:block">
          <nav className="p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-[#2E1A73]"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/reviews"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-[#2E1A73]"
            >
              <Star className="h-5 w-5" />
              <span>Reviews</span>
            </Link>
            <Link
              href="/reviews/add"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-[#2E1A73] pl-10"
            >
              <Plus className="h-5 w-5" />
              <span>Add Review</span>
            </Link>
            <Link
              href="/users"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-[#2E1A73]"
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-[#2E1A73]"
            >
              <User className="h-5 w-5" />
              <span>My Profile</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Providers>{children}</Providers>
        </main>
      </div>
    </div>
  );
}
