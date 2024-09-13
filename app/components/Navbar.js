import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 w-40" prefetch={false}>
            <img
              src="/fireside_logo.png" // Update this path to where your PNG is located
              alt="Fireside AI"
              className="h-6 w-6"
            />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Fireside <span className="text-[#FCD19C]">AI</span>
            </span>
          </Link>

          {/* Links Section */}
          <div className="flex-1 flex justify-center">
            <nav className="flex gap-4">
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
          </div>

          {/* Sign-In Section */}
          <div className="flex items-center gap-4 w-40">
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
      </div>
    </nav>
  );
}
