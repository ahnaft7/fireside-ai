import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
// import { AuthProvider } from './providers'
import Navbar from '@/app/components/Navbar'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { ClerkProvider } from '@clerk/nextjs';
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Mock Interview Platform',
  description: 'Practice your interview skills with AI',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* <AuthProvider>
            <Navbar />
            <main className="container mx-auto py-4">
              {children}
            </main>
          </AuthProvider> */}
          {/* <div className="flex justify-center w-full py-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                  <Link href="/interview" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Interview
                    </NavigationMenuLink>
                  </Link>
                  <Link href="/profile" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Profile
                    </NavigationMenuLink>
                  </Link>
                  <NavigationMenuTrigger>Pages</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/interview" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Interview
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/profile" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Profile
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuContent>
                  <SignedOut>
                    <Link href="/sign-in" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Sign In
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/sign-up" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Sign Up
                      </NavigationMenuLink>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                      <UserButton />
                  </SignedIn>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div> */}
          <Navbar />
          
          {children}
          
        </body>
      </html>
    </ClerkProvider>
  )
}
