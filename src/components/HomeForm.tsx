"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

const formSchema = z.object({
	input: z.string().startsWith("{").endsWith("}").includes("data"),
});

type TData = {
	is_success: boolean;
	user_id: string;
	email: string;
	roll_number: string;
	numbers: string[];
	alphabets: string[];
	highest_alphabet: string[];
};

export function 	HomeForm() {
	const [data, setData] = useState<TData>();
	const [showNums, setShowNums] = useState(true);
	const [showAlphas, setShowAlphas] = useState(true);
	const [showHighestAlpha, setShowHighestAlpha] = useState(true);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			input: "",
		},
	});

	const validateJsonString = (jsonString: string) => {
		try {
			JSON.parse(jsonString);
			return true;
		} catch (error) {
			console.error("Validation failed:", error);
			return false;
		}
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const result = validateJsonString(values.input);
		if (result) {
			const res = await fetch("/bfhl", {
				method: "POST",
				body: values.input,
			});
			const resData = (await res.json()) as TData;

			if (resData.is_success) {
				setData(resData);
				return;
			}

			toast.error("Unknown error occured!");
		}

		toast.error("Invalid JSON! Please check your input");
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 w-full max-w-7xl"
			>
				<FormField
					control={form.control}
					name="input"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-semibold">API Input</FormLabel>
							<FormControl>
								<Input placeholder={`{"data" : ["A", "1"]}`} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-fit m-2 bg-red-600">
					Submit
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger
						className={buttonVariants({ variant: "default", className:"bg-red-600"})}
					>
						Filters
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							onClick={() => setShowNums((prev) => !prev)}
							className="flex gap-4 items-center"
						>
							<Checkbox checked={showNums} />
							<p>Numbers</p>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setShowAlphas((prev) => !prev)}
							className="flex gap-4 items-center"
						>
							<Checkbox checked={showAlphas} />
							<p>Alphabets</p>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setShowHighestAlpha((prev) => !prev)}
							className="flex gap-4 items-center"
						>
							<Checkbox checked={showHighestAlpha} />
							<p>Highest Alphabet</p>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<div>
					<h2 className="text-lg font-semibold">Filtered Response</h2>
					{showNums && <div>• Numbers: {data?.numbers.join(", ")}</div>}
					{showAlphas && <div>• Alphabets: {data?.alphabets.join(", ")}</div>}
					{showHighestAlpha && (
						<div>• Highest alphabet: {data?.highest_alphabet[0]}</div>
					)}
				</div>
			</form>
		</Form>
	);
}
