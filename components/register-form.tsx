"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { registerUser } from "@/services/auth.service"; // Adjust path if needed

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = {
  success: false,
  message: "",
};

export function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialState,
  );

  {
    state && state.message && !state.success && (
      <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-mono">
        {state.message}
      </div>
    );
  }
  return (
    <div className="w-full max-w-md mx-auto relative z-10 font-mono">
      <Card className="bg-card border border-border rounded-none shadow-sm text-foreground">
        <CardHeader className="space-y-1.5 border-b border-border pb-6">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground text-center font-serif">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground text-center font-mono">
            Fill in your details to get started
          </CardDescription>
        </CardHeader>

        {/* Bind formAction to the form element */}
        <form action={formAction}>
          <CardContent className="pt-6 space-y-4">
            {state && state.message && !state.success && (
              <div className="p-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
                {state.message}
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-mono uppercase text-muted-foreground"
              >
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="h-9 rounded-none text-xs border-border bg-accent/30 text-foreground font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="role"
                className="text-xs font-mono uppercase text-muted-foreground"
              >
                Account Type
              </Label>
              <Select name="role" required defaultValue="CUSTOMER">
                <SelectTrigger className="h-9 rounded-none text-xs border-border bg-accent/30 text-foreground font-mono">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-border bg-popover text-popover-foreground font-mono">
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="PROVIDER">Provider</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-mono uppercase text-muted-foreground"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-9 rounded-none text-xs border-border bg-accent/30 text-foreground font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-mono uppercase text-muted-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                  className="h-9 rounded-none text-xs border-border bg-accent/30 text-foreground pr-10 font-mono"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="rounded-none border-border bg-accent/30 h-4 w-4 cursor-pointer"
                required
              />
              <label
                htmlFor="terms"
                className="text-[11px] text-muted-foreground font-mono cursor-pointer leading-tight"
              >
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0 border-t border-border mt-4 pt-6">
            {/* Submit button placed inside the form context */}
            <Button
              type="submit"
              disabled={pending}
              className="w-full h-9 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-mono uppercase tracking-wider cursor-pointer flex items-center justify-center"
            >
              {pending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground font-mono pt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
