import { createTRPCClient, type ServerRouter } from "@repo/trpc";

import {
	createTRPCOptionsProxy,
	type TRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import { createTRPCHttpBatchClientClient } from "./create-client";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const trpcClient = createTRPCClient<ServerRouter>({
	links: [createTRPCHttpBatchClientClient()],
});

export const trpc: TRPCOptionsProxy<ServerRouter> =
	createTRPCOptionsProxy<ServerRouter>({
		client: trpcClient,
		queryClient,
	});
