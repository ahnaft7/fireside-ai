import Link from "next/link"
import { Button } from "@/components/ui/button"
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <Link href="#" className="flex items-center" prefetch={false}>
            <img
              src="/fireside_logo.png" // Update this path to where your PNG is located
              alt="FiresideAI"
              className="h-6 w-6"
            />
            <span className="sr-only">FiresideAI</span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link
              href="/"
              className="font-medium flex items-center text-sm transition-colors hover:underline"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="/interview"
              className="font-medium flex items-center text-sm transition-colors hover:underline"
              prefetch={false}
            >
              Interview
            </Link>
            <Link
              href="/profile"
              className="font-medium flex items-center text-sm transition-colors hover:underline"
              prefetch={false}
            >
              Profile
            </Link>
            <Link
              href="#"
              className="font-medium flex items-center text-sm transition-colors hover:underline"
              prefetch={false}
            >
              Contact
            </Link>
          </nav>
          <SignedOut>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" passHref>
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up" passHref>
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}