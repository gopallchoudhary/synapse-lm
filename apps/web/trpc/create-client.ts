import { httpLink, httpBatchStreamLink } from "@repo/trpc";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
	enableStreaming?: boolean;
	getToken?: () => Promise<string | null>;
}

export const createTRPCHttpBatchClientClient = (
	opts?: CreateTRPCHttpBatchClientClientOpts,
) => {
	const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
	return c({
		url: env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/trpc",
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
