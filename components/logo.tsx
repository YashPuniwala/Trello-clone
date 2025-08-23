import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import React from 'react'

const headingFont = Poppins({
    subsets: ["latin"],
    weight: [
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900",
    ]
})

const Logo = () => {
  return (
    <Link href="/">
        <div className='hover:opacity-75 transition items-center gap-x-2 hidden md:flex'>
            {/* <Image src="" alt="logo" height={60} width={40} /> */}
            <p className={cn('text-lg text-neutral-700 pb-1', headingFont.className)}>
                Trellux
            </p>
        </div>
    </Link>
  )
}

export default Logo
