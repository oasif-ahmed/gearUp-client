import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import './globals.css'
import { Inter } from 'next/font/google'
import { getMe } from '@/services/getMe'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gear Up Client',
  description: 'A comprehensive gear rental platform.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getMe();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-zinc-900 selection:text-[#FDFBF7]`}>
        <Navbar user={user} />
        <main className="min-h-screen pb-16 md:pb-0">{children}
           <Toaster richColors position="top-center" /> {/* Add this line */}
        </main>
        <Footer />
      </body>
    </html>
  )
}