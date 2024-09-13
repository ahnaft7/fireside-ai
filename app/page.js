import Image from "next/image";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="py-24 bg-[#2A2A2A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-[#FCD19C] font-semibold tracking-wide uppercase">
            AI Mock Interview Platform
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Prepare for your next interview with AI
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 lg:mx-auto">
            Get real-time feedback, tailored questions, and AI-driven interview analysis to help you ace your next interview.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Button className="px-6 py-3 rounded-md bg-[#FCD19C] text-gray-900 hover:bg-orange-400">
            <Link href="/interview">
              Start a Mock Interview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
