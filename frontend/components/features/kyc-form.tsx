"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Define validation schema for each step
const stepOneSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
    dateOfBirth: z.date({ required_error: "A date of birth is required." }),
});

const stepTwoSchema = z.object({
    nationalId: z.string().min(5, { message: "National ID must be a valid identifier." }),
    document: z.any().refine((files) => files?.length === 1, "A document is required."),
});

// Combine schemas for the full form
const formSchema = stepOneSchema.merge(stepTwoSchema);

type FormValues = z.infer<typeof formSchema>;

/**
 * A multi-step form component for the KYC (Know Your Customer) process.
 * It handles user data collection, validation, and submission in stages.
 * @returns {React.ReactElement} The rendered KYC form.
 */
export function KycForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            nationalId: "",
            document: undefined,
        },
    });

    // Use react-hook-form's `register` for the file input
    const fileRef = form.register("document");

    // This function will handle the final submission of the entire form
    async function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        console.log("Form submitted with data:", data);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Verification data submitted successfully!");
        setIsSubmitting(false);
    }

    // This function handles navigation to the next step
    const handleNextStep = async () => {
        // Manually trigger validation for the fields in the current step
        const fieldsToValidate = currentStep === 0 ? ["fullName", "dateOfBirth"] as const : [];
        const isValid = await form.trigger(fieldsToValidate);

        if (isValid) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Step 1: Personal Information */}
                {currentStep === 0 && (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                {/* Step 2: Document Upload */}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nationalId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>National ID / Passport Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., A12345678" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="document"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Identity Document</FormLabel>
                                    <FormControl>
                                        {/* Use the ref from `form.register` for file inputs */}
                                        <Input type="file" {...fileRef} />
                                    </FormControl>
                                    <FormDescription>
                                        Please upload a clear scan of your ID document.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <Separator />

                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(0)}
                        disabled={currentStep === 0 || isSubmitting}
                    >
                        Previous
                    </Button>

                    {currentStep === 0 && (
                        <Button type="button" onClick={handleNextStep}>
                            Next Step
                        </Button>
                    )}

                    {currentStep === 1 && (
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                            Submit for Verification
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}