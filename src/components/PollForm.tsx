"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const formSchema = z.object({
  question: z.string().min(5, {
    message: "Question must be at least 5 characters.",
  }),
  options: z.array(
    z.string().min(1, {
      message: "Option must not be empty.",
    })
  ).min(2, {
    message: "You must provide at least 2 options.",
  }),
});

export function PollForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      options: ["", ""],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Submit to API
    console.log(values);
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

            <div className="space-y-4">
              {form.watch("options").map((option, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`options.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder={`Option ${index + 1}`} {...field} />
                        </FormControl>
                        {form.watch("options").length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeOption(index)}
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

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={addOption}>
                Add Option
              </Button>
              <Button type="submit">Create Poll</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}