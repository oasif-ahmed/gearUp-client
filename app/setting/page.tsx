'use client'

import React from 'react'
import { useTheme } from '@/components/theme-provider'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Bell, Moon, Sun, Palette, Monitor, Leaf, Gem } from 'lucide-react'

const SettingPage = () => {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = React.useState(true)

  const toggleNotifications = () => {
    setNotifications(!notifications)
    toast.success(`Notifications ${!notifications ? 'enabled' : 'disabled'}`)
  }

  const themeLabels: Record<"light" | "dark" | "green" | "porcelain" | "system", string> = {
    light: 'Light',
    dark: 'Dark',
    green: 'Green',
    porcelain: 'Porcelain',
    system: 'System',
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "green" | "porcelain" | "system") => {
    setTheme(newTheme)
    toast.success(`Global theme changed to ${themeLabels[newTheme]}`)
  }

  return (
    <div className="container max-w-4xl py-10 px-4 mx-auto">
      <div className="space-y-1 mb-8">
        <h2 className="text-3xl font-bold tracking-tight font-mono uppercase">Website Settings</h2>
        <p className="text-muted-foreground font-mono text-sm">
          Adjust the global configuration and visual identity of Gear Up.
        </p>
      </div>
      
      <Separator className="my-6 bg-border" />

      <div className="grid gap-8">
        {/* Appearance Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold font-mono uppercase tracking-tight">Appearance</h3>
          </div>
          <Card className="border-border bg-card shadow-none rounded-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-mono">Global Theme Strategy</CardTitle>
              <CardDescription className="font-mono text-xs">
                Select how the website appears to you. Porcelain is a refined light palette with ink text and a sage accent.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <button 
                  onClick={() => handleThemeChange('light')}
                  className={`flex flex-col items-center justify-center p-6 border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'}`}
                >
                  <Sun className={`h-8 w-8 mb-3 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-mono text-xs font-bold uppercase">Light</span>
                </button>

                <button 
                  onClick={() => handleThemeChange('dark')}
                  className={`flex flex-col items-center justify-center p-6 border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'}`}
                >
                  <Moon className={`h-8 w-8 mb-3 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-mono text-xs font-bold uppercase">Dark</span>
                </button>

                <button 
                  onClick={() => handleThemeChange('green')}
                  className={`flex flex-col items-center justify-center p-6 border-2 transition-all ${theme === 'green' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'}`}
                >
                  <Leaf className={`h-8 w-8 mb-3 ${theme === 'green' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-mono text-xs font-bold uppercase">Green</span>
                </button>

                <button 
                  onClick={() => handleThemeChange('porcelain')}
                  className={`flex flex-col items-center justify-center p-6 border-2 transition-all ${theme === 'porcelain' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'}`}
                >
                  <Gem className={`h-8 w-8 mb-3 ${theme === 'porcelain' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-mono text-xs font-bold uppercase">Porcelain</span>
                </button>

                <button 
                  onClick={() => handleThemeChange('system')}
                  className={`flex flex-col items-center justify-center p-6 border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'}`}
                >
                  <Monitor className={`h-8 w-8 mb-3 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-mono text-xs font-bold uppercase">System</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Notifications Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold font-mono uppercase tracking-tight">System Notifications</h3>
          </div>
          <Card className="border-border bg-card shadow-none rounded-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-mono uppercase font-bold">Push Alerts</Label>
                  <p className="text-xs text-muted-foreground font-mono">
                    Receive real-time updates about rentals, messages, and platform news.
                  </p>
                </div>
                <Button 
                  variant={notifications ? "default" : "outline"} 
                  onClick={toggleNotifications}
                  className="rounded-none font-mono text-xs uppercase"
                >
                  {notifications ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Persistence Info */}
        <div className="bg-muted p-4 border border-border">
          <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest text-center">
            Settings are persisted to your local browser storage and will be active across all sessions.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SettingPage