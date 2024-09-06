import Image from "next/image";
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-28 mt-20">
      <Link href="/record">
        <Button variant="secondary" size="lg">Start Session</Button>
      </Link>
    </main>
  );
}