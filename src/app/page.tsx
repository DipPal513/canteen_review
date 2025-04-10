"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DuLogo } from "@/components/du-logo";
import { ReviewList } from "@/components/review-list";
import { useAppContext } from "../context/AppContext";

export default function Home() {
  const { user } = useAppContext();
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-[#2E1A73] text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DuLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold">DU Student Portal</h1>
        </div>
        <div className="flex gap-4">
          {user ? (
            <>
              {" "}
              <p>{user?.name}</p>
              <Link href={"/dashboard"} className="bg-indigo-400 rounded-md px-3 py-1">Dashboard</Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="text-black border-white hover:bg-white/20"
                >
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button className="bg-white text-[#2E1A73] hover:bg-white/90">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4">
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#2E1A73] mb-2">
              Welcome to Dhaka University Student Portal
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A platform exclusively for Dhaka University students to share
              experiences, connect with peers, and access resources.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-[#2E1A73] mb-2">
                Share Reviews
              </h3>
              <p className="text-gray-600 mb-4">
                Share your experiences about courses, professors, and campus
                facilities.
              </p>
              <Link href="/reviews/add">
                <Button className="w-full bg-[#2E1A73] hover:bg-[#231259]">
                  Add Review
                </Button>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-[#2E1A73] mb-2">
                Connect with Peers
              </h3>
              <p className="text-gray-600 mb-4">
                Find and connect with other students from your department or
                hall.
              </p>
              <Link href="/users">
                <Button className="w-full bg-[#2E1A73] hover:bg-[#231259]">
                  Browse Users
                </Button>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-[#2E1A73] mb-2">
                Explore Reviews
              </h3>
              <p className="text-gray-600 mb-4">
                Browse through reviews and ratings from other students.
              </p>
              <Link href="/reviews">
                <Button className="w-full bg-[#2E1A73] hover:bg-[#231259]">
                  Browse Reviews
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#2E1A73]">
              Recent Reviews
            </h2>
            <Link href="/reviews">
              <Button
                variant="outline"
                className="border-[#2E1A73] text-[#2E1A73]"
              >
                View All
              </Button>
            </Link>
          </div>
          <ReviewList limit={3} />
        </section>
      </main>
      <footer className="bg-[#2E1A73] text-white py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <DuLogo className="h-8 w-8" />
              <span className="font-semibold">DU Student Portal</span>
            </div>
            <div className="text-sm text-white/80 text-center">
              &copy; {new Date().getFullYear()} All rights reserved by{" "}
              <Link href={"www.dippal.vercel.app"}>DIP PAL</Link>. Connect with
              me:
              <a
                href="https://twitter.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline mx-1"
              >
                Twitter
              </a>
              <a
                href="https://github.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline mx-1"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline mx-1"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
