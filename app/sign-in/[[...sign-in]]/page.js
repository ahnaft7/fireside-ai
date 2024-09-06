import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
    return (
        <div className="w-full bg-gray-900 min-h-screen p-4" style={{ backgroundColor: "#2A2A2A" }}>
            <div className="flex flex-col items-center justify-center mt-8">
                <h2 className="text-[#FCD19C] text-2xl my-4">Sign In</h2>
                <SignIn />
            </div>
        </div>
    )
}