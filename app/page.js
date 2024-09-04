import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">AI Mock Interview Platform</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Prepare for your next interview with AI
          </p>
          {/* ... rest of the content ... */}
        </div>

        <div className="mt-10 text-center">
          {/* {session ? (
            <Link href="/interview" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Start a Mock Interview
            </Link>
          ) : (
            <Link href="/api/auth/signin" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Sign Up to Get Started
            </Link>
          )} */}
        </div>
      </div>
    </div>
  );
}
