import { ArtifactService, SourceService, TestService, WorkspaceService } from "@repo/services";

export const testService = new TestService();
export const sourceService = new SourceService();
export const workspaceService = new WorkspaceService();
export const artifactService = new ArtifactService();