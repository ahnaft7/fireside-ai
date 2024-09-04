import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
    return (
        <div className="w-full bg-gray-900 min-h-screen p-4">
            <div className="flex flex-col items-center justify-center mt-8">
                <h2 className="text-yellow-300 text-2xl my-4">Sign Up</h2>
                <SignUp />
            </div>
        </div>
    )
}