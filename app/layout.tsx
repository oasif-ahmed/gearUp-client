import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import './globals.css'
import { Inter } from 'next/font/google'
import { getMe } from '@/services/getMe'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar user={user} />
          <main className="min-h-screen pb-16 md:pb-0">{children}
            <Toaster richColors position="top-center" />
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}