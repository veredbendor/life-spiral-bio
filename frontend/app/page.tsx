import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#EBE0C9] via-[#E0D0D2] to-[#D3BFE0]">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-40 h-40 relative">
            <Image
              src="/logo-transparent.png"
              alt="Biography Journey Logo"
              width={160}
              height={160}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#2d2520] leading-tight text-balance">
              Welcome to Your Biography Journey
            </h1>
            <p className="text-base sm:text-lg text-[#5a5047] leading-relaxed max-w-sm mx-auto">
              A step-by-step guide to capturing your life story
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-xs pt-4">
            <Link href="/questionnaire/about">
              <Button
                size="lg"
                className="w-full bg-[#a89b7e] hover:bg-[#968a6f] text-white rounded-full h-14 text-base font-medium shadow-sm transition-all"
              >
                Start My Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <button className="text-[#2d2520] hover:text-[#5a5047] text-base font-normal transition-colors">
              Continue Where I Left Off
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-sm text-[#5a5047] pt-4">100% private • Your story stays yours</p>
        </div>
      </div>
    </main>
  )
}
