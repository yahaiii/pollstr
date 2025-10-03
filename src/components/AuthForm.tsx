
"use client";
import React from 'react';

import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signUp } from "@/lib/supabase";
import { useState } from "react";


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type AuthFormValues = LoginFormValues | RegisterFormValues;

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(mode === "register" ? registerSchema : loginSchema),
    defaultValues: mode === "register"
      ? { email: "", password: "", name: "" }
      : { email: "", password: "" },
  });

  const onSubmit = async (data: AuthFormValues) => {
    console.log('🔄 Form submission started:', { mode, email: data.email });
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === "login") {
        console.log('🔐 Attempting login...');
        const result = await signIn(data.email, data.password);
        if (result.error) {
          console.error('❌ Login failed:', result.error.message);
          throw new Error(result.error.message);
        }
        console.log('✅ Login successful, redirecting to /polls');
        setTimeout(() => {
          router.push("/polls");
        }, 100);
      } else {
        const { email, password, name } = data as RegisterFormValues;
        if (!name) {
          throw new Error("Name is required for registration");
        }
        console.log('📝 Attempting registration...');
        const { error } = await signUp(email, password, name);
        if (error) {
          console.error('❌ Registration failed:', error.message);
          throw new Error(error.message);
        }
        setSuccessMessage("Registration successful! Please check your email for confirmation before logging in.");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Auth error:', error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      console.log('🔄 Form submission completed');
    }
  };

  const onError = (errors: FieldErrors<AuthFormValues>) => {
    console.log('❌ Form validation errors:', errors);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
        {mode === "register" && (
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  
        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
  
        {successMessage && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
            {successMessage}
          </div>
        )}
  
        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {successMessage ? "Redirecting..." : mode === "login" ? "Signing In..." : "Creating Account..."}
              </span>
            ) : (
              mode === "login" ? "Sign In" : "Create Account"
            )}
          </Button>
  
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account? <Link href="/auth/register" className="underline">Register</Link>
              </>
            ) : (
              <>
                Already have an account? <Link href="/auth/login" className="underline">Sign in</Link>
              </>
            )}
          </p>
        </div>
      </form>
    </Form>
  );
}