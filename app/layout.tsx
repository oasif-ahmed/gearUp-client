import './globals.css'
import { Roboto } from 'next/font/google'
import { getMe } from '@/services/getMe'
import { ThemeProvider } from '@/components/theme-provider'
import AppShell from '@/components/shared/appShell'

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
})

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
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider defaultTheme="light">
          <AppShell user={user}>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}