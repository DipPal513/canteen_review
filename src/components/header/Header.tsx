"use client"
import { DuLogo } from "@/components/du-logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "@radix-ui/react-menubar";
import { Home, LogOut, Star, User, Users } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const handleLogout = () =>{
    console.log("logged out!");
  }
  return (
    <header className="bg-[#2E1A73] text-white py-3 px-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <DuLogo className="h-8 w-8" />
        <h1 className="text-lg font-bold hidden md:block">Canteen Review</h1>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/80"
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
                <DuLogo className="h-8 w-8" />
                <h2 className="font-bold">DU Student Portal</h2>
              </div>
              <nav className="flex-1 py-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/80"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/reviews"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/80"
                >
                  <Star className="h-5 w-5" />
                  <span>Reviews</span>
                </Link>
                <Link
                  href="/users"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/80"
                >
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/30"
                >
                  <User className="h-5 w-5" />
                  <span>My Profile</span>
                </Link>
              </nav>
              <div className="p-4 border-t border-white/10">
                <Link href="/logout">
                  <Button
                    variant="outline"
                    className="w-full border-white text-white hover:bg-white/80 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white hover:bg-white/80">
              Dashboard
            </Button>
          </Link>
          <Link href="/reviews">
            <Button variant="ghost" className="text-white hover:bg-white/80">
              Reviews
            </Button>
          </Link>
          <Link href="/users">
            <Button variant="ghost" className="text-white hover:bg-white/80">
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
          <Link href="/logout">
            <Button
              variant="outline"
              className="w-full border-white text-gray-500 hover:bg-white/50 flex items-center gap-2"
              onClick={() => handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
