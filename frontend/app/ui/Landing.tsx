import Link from "next/link"
import { Button } from "./v0/ui/button"
import { Card, CardContent } from "./v0/ui/card"
import { JSX, SVGProps } from "react"
import Image from "next/image"

export function Landing() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-blue-600">Agentverse</h1>
        <p className="mt-4 text-lg text-muted-foreground">Launch and interact AI powered Agents on chain</p>
        <Link href="/launch"><Button className="mt-6">Start now</Button></Link>
        <Card className="mt-8 w-48 h-48 md:w-64 md:h-64">
          <CardContent className="flex items-center justify-center h-full">
            {/* <Image width={45} height={45} src="/placeholder-user.jpg" alt="placeholder"/> */}
          </CardContent>
        </Card>
      </main>
      <footer className="flex flex-col items-center justify-center w-full max-w-2xl mt-8 space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          powered by{" "}
          <Link href="#" className="font-medium text-blue-600" prefetch={false}>
            Galadriel
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          built with <HeartIcon className="inline-block w-4 h-4 text-red-500" /> by{" "}
          <Link href="#" className="font-medium text-blue-600" prefetch={false}>
            thescoho
          </Link>
        </p>
      </footer>
    </div>
  )
}

function HeartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

