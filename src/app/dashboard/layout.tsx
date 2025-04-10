import type { ReactNode } from "react"
import Link from "next/link"
import { DuLogo } from "@/components/du-logo"
import { Button } from "@/components/ui/button"
import { Home, Star, Users, User, LogOut, Menu, Plus } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Providers } from "@/src/context/Provider"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-[#2E1A73] text-white py-3 px-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <DuLogo className="h-8 w-8" />
          <h1 className="text-lg font-bold hidden md:block">DU Student Portal</h1>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-[#2E1A73] text-white p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-white/10 flex items-center gap-2">
                  <DuLogo className="h-8 w-8" />
                  <h2 className="font-bold">DU Student Portal</h2>
                </div>
                <nav className="flex-1 py-2">
                  <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/reviews" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10">
                    <Star className="h-5 w-5" />
                    <span>Reviews</span>
                  </Link>
                  <Link href="/users" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10">
                    <Users className="h-5 w-5" />
                    <span>Users</span>
                  </Link>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10">
                    <User className="h-5 w-5" />
                    <span>My Profile</span>
                  </Link>
                </nav>
                <div className="p-4 border-t border-white/10">
                  <Link href="/logout">
                    <Button
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white/10 flex items-center gap-2"
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
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Dashboard
              </Button>
            </Link>
            <Link href="/reviews">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Reviews
              </Button>
            </Link>
            <Link href="/users">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Users
              </Button>
            </Link>
          </nav>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20">
              <User className="h-5 w-5" />
            </Button>
          </Link>
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
              <Plus  className="h-5 w-5"/>
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

        <main className="flex-1 p-6"><Providers>{children}</Providers></main>
      </div>
    </div>
  )
}
