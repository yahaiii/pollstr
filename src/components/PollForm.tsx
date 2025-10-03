"use client";
import React from 'react';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { createPoll } from "@/lib/supabase";

const formSchema = z.object({
  question: z.string().min(1, "Question is required"),
  description: z.string().optional(),
  options: z.array(z.string()).min(2, "At least 2 options are required"),
});

export function PollForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      description: "",
      options: ["", ""],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
  
    try {
      if (!user) {
        throw new Error("You must be logged in to create a poll");
      }
  
      const options = values.options.filter(option => option.trim() !== "");
      if (options.length < 2) {
        throw new Error("At least two options are required to create a poll");
      }
  
      await createPoll({
        title: values.question,
        description: values.description || "",
        options,
        userId: user.id,
        userName: user.user_metadata?.name || user.email || "Anonymous",
      });
  
      router.push("/polls");
    } catch (error: unknown) {
      console.error("Error creating poll:", error);
      setError(error instanceof Error ? error.message : "Failed to create poll");
    } finally {
      setIsLoading(false);
    }
  }

  const addOption = () => {
    const currentOptions = form.getValues("options");
    form.setValue("options", [...currentOptions, ""]);
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options");
    if (currentOptions.length > 2) {
      form.setValue(
        "options",
        currentOptions.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your question" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the question that will be shown to voters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a description for your poll" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide additional context for your poll.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              {form.watch("options").map((option, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`options.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center">
                        <FormControl className="flex-1">
                          <Input placeholder={`Option ${index + 1}`} {...field} />
                        </FormControl>
                        {form.watch("options").length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeOption(index)}
                            className="w-full sm:w-auto"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2 w-full sm:flex-row sm:gap-4">
              <Button type="button" variant="outline" onClick={addOption} className="w-full sm:w-auto">
                Add Option
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Creating..." : "Create Poll"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}