import Image from "next/image";
import { cn } from "~/lib/utils";

type BrandLogoProps = {
	className?: string;
	size?: number;
};

export function BrandLogo({ className, size = 32 }: BrandLogoProps) {
	return (
		<Image
			src="/brand-logo.svg"
			alt="Studybook LM logo"
			width={size}
			height={size}
			priority
			className={cn("object-contain", className ?? "size-8 rounded-lg")}
		/>
	);
}
