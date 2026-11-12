"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginUser } from "@/services/auth.service";

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
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "./shared/Spinner";

const initialState = {
  success: false,
  statusCode: 0,
  message: "",
};

const LoginForm = () => {
  const [state, action, pending] = useActionState(loginUser, initialState);

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
            Login to Your Account
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground text-center font-mono">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Explicitly ensure form action and proper pointer interactivity */}
          <form action={action} className="space-y-4 relative">
            {state && state.message && !state.success && (
              <div className="p-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
                {state.message}
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-mono uppercase text-muted-foreground"
              >
                Email Address
              </Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="h-9 rounded-none text-xs border-border bg-accent/30 text-foreground relative z-20 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-mono uppercase text-muted-foreground"
              >
                Password
              </Label>

              <Input
                name="password"
                id="password"
                type="password"
                placeholder="••••••••"
                required
                aria-invalid={!!state?.message && !state.success}
                aria-describedby={
                  state?.message && !state.success
                    ? "password-error"
                    : undefined
                }
                className={`h-9 rounded-none text-xs bg-accent/30 text-foreground relative z-20 font-mono ${
                  state?.message && !state.success
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-border"
                }`}
              />

              {state?.message && !state.success && (
                <p
                  id="password-error"
                  className="text-xs text-destructive font-mono"
                  role="alert"
                >
                  {state.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  name="remember"
                  className="rounded-none border-border bg-accent/30"
                />
                <Label
                  htmlFor="remember-me"
                  className="text-xs text-muted-foreground font-normal leading-none cursor-pointer font-mono"
                >
                  Remember me
                </Label>
              </div>

              <Link
                href="/forgot-password"
                className="text-xs text-foreground hover:underline font-mono"
              >
                Forgot password?
              </Link>
            </div>

            {/* Ensured button is fully clickable with proper stacking context */}
            <Button
              type="submit"
              className="w-full h-9 rounded-none bg-primary text-primary-foreground hover:opacity-90 text-xs font-medium cursor-pointer relative z-20 font-mono uppercase tracking-wider"
              disabled={pending}
            >
              {pending ? <Spinner /> : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col pt-0 border-t border-border mt-4 pt-6">
          <div className="relative w-full my-2">
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] font-mono uppercase">
              <span className="px-2 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full pt-2">
            <Button
              variant="outline"
              type="button"
              className="h-9 rounded-none text-xs border-border bg-accent/30 hover:bg-accent/50 cursor-pointer font-mono"
            >
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              className="h-9 rounded-none text-xs border-border bg-accent/30 hover:bg-accent/50 cursor-pointer font-mono"
            >
              GitHub
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground font-mono">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
