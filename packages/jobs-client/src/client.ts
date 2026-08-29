import { Inngest } from "inngest";

export const inngest = new Inngest({
	id: "synapse-lm",
	isDev: process.env.INNGEST_DEV === "1" || process.env.INNGEST_DEV === "true",
	eventKey: process.env.INNGEST_EVENT_KEY,
	signingKey: process.env.INNGEST_SIGNING_KEY,
});

export type SourceCreatedEvent = {
	name: "source/created";
	data: {
		sourceId: string;
		workspaceId: string;
	};
};

export type ArtifactGenerateEvent = {
	name: "artifact/generate";
	data: {
		artifactId: string;
		workspaceId: string;
	};
};

export type ConversationSummarizeEvent = {
	name: "conversation/summarize";
	data: {
		conversationId: string;
	};
};

export type InngestEvents =
	| SourceCreatedEvent
	| ArtifactGenerateEvent
	| ConversationSummarizeEvent;
