import { HomeForm } from "@/components/HomeForm";

export default function Home() {
	return (
		<main className="flex flex-col gap-24 items-center p-10">
			<h1 className="text-3xl font-bold text-center underline text-primary">
				Bajaj Finserv 
			</h1>
			<HomeForm />
		</main>
	);
}
