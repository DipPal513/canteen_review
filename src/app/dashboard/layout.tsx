"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Providers } from "@/src/context/Provider";
import { Home, LogOut, Menu, Plus, Star, User, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    Cookies.remove("token"); 
    toast.success("Logged out successfully!");
    setShowLogoutModal(false);
    router.push('/login') // Redirect to login page
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const LogoutModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
        <p className="mb-4">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  if (showLogoutModal) {
    return <LogoutModal />;
  }
  return (
    <div className="min-h-dvh flex flex-col">
      <Toaster position="top-center" />
      <header className="bg-[#2E1A73] text-white py-3 px-4 flex items-center justify-between  top-0 z-10">
        <div className="flex items-center gap-2">
          <img src="/logo.png" width={50} alt="logo" />
          <h1 className="text-lg font-bold hidden md:block">
            DU Canteen Review
          </h1>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 bg-[#2E1A73] text-white p-0"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-white/10 flex items-center gap-2">
                  <img src="/logo.png" width={50} alt="logo" />
                  <h2 className="font-bold">DU Canteen review</h2>
                </div>
                <nav className="flex-1 py-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 hover:text-white"
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/reviews"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10"
                  >
                    <Star className="h-5 w-5" />
                    <span>Reviews</span>
                  </Link>
                  <Link
                    href="/users"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10"
                  >
                    <Users className="h-5 w-5" />
                    <span>Users</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-white/10"
                  >
                    <User className="h-5 w-5" />
                    <span>My Profile</span>
                  </Link>
                </nav>
                <div className="p-4 border-t border-white/10">
                  <div>
                    <Button
                      variant="outline"
                      className="w-full border-white text-white/10 hover:text-white hover:bg-white/10 flex items-center gap-2"onClick={() => handleLogout()}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/reviews">
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
              >
                Reviews
              </Button>
            </Link>
            <Link href="/users">
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
              >
                Users
              </Button>
            </Link>
          </nav>
          <Link href="/profile">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 hover:bg-white/20"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <div className="p-4 border-t border-white/10">
            <div>
              <Button
                variant="outline"
                className="w-full border-white text-white hover:text-white bg-white/10 hover:bg-red-500 flex items-center gap-2"
                onClick={() => handleLogout()}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

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
