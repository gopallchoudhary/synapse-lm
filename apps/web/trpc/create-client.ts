import { httpLink, httpBatchStreamLink } from "@repo/trpc";
import { env } from "~/env";

interface CreateTRPCHttpBatchClientClientOpts {
	enableStreaming?: boolean;
	getToken?: () => Promise<string | null>;
}

export const createTRPCHttpBatchClientClient = (
	opts?: CreateTRPCHttpBatchClientClientOpts,
) => {
	const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
	const base = (env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(
		/\/$/,
		"",
	);
	const url = base.endsWith("/trpc") ? base : `${base}/trpc`;
	return c({
		url,
		async headers() {
			const token = await opts?.getToken?.();
			return token
				? {
						authorization: `Bearer ${token}`,
				  }
				: {};
		},
		fetch(url, options) {
			return fetch(url, {
				...options,
				credentials: "include",
			});
		},
	});
};
