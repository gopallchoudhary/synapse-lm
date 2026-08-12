import { ThemeToggle } from "~/components/theme-toggle";

export default function Home() {
	return (
		<div>
			<h1 className="text-8xl text-red-900">Synapse LM</h1>
			<div>
				<ThemeToggle />
			</div>
		</div>
	);
}
