import { prisma } from '@repo/database'
import type { Prisma } from '@repo/database/generated/prisma/client.js'
import { ArtifactRecord, ArtifactType, flashcardsSchema, MAX_CONTEXT_CHARS, mindmapSchema, quizSchema, reportSchema, takeawaysSchema } from './model.js'


import SourceService from '../source/index.js'
import { ValidationError } from '@repo/errors'
import { generateStructuredContent, generateTextContent } from '@repo/ai'


const sourceService = new SourceService()




class ArtifactGenerationService {
    /**
 * Collects and concatenates text from READY workspace sources for artifact generation.
 *
 * @param workspaceId - Workspace whose sources to read
 * @param sourceIds - Optional subset of source ids; defaults to all READY sources
 * @returns Combined source text (max 120k chars) and the ids actually used
 * @throws {ValidationError} When no ready sources exist or none have extracted content
 *
 *
 *
 */
    public async gatherSourceContext(workspaceId: string, userId: string, sourceIds: string[]) {
        const sources = await sourceService.getSourcesByWorkspaceId(
            workspaceId,
            userId,
            { status: 'READY' }
        )

        const selected = sourceIds?.length
            ? sources.filter((source) => sourceIds.includes(source.id))
            : sources;


        if (selected.length === 0) {
            throw new ValidationError(
                "No ready sources found. Add and process sources before generating learning tools.",
            );
        }

        const withContent = selected.flatMap((source) => {
            const content = source.content?.trim();
            return content ? [{ title: source.title, content }] : [];
        });

        if (withContent.length === 0) {
            throw new ValidationError(
                "Selected sources have no extracted content yet.",
            );
        }

        const text = withContent
            .map((source) => `# ${source.title}\n\n${source.content}`)
            .join("\n\n---\n\n")
            .slice(0, MAX_CONTEXT_CHARS);

        return {
            text,
            sourceIds: selected.map((source) => source.id),
        };
    }

    //, build system prompt
    private buildSystemPrompt(type: ArtifactType): string {
        return [
            `You are Chaibook, an expert learning assistant generating a ${type.toLowerCase()} from workspace source materials.`,
            "Use ONLY the provided source content. Do not invent facts not supported by the sources.",
            "Be clear, educational, and well-structured.",
        ].join("\n");
    }


    public async generateArtifactContent(
        type: ArtifactType,
        sourceText: string
    ) {
        const system = this.buildSystemPrompt(type);


        switch (type) {
            case "SUMMARY": {
                const markdown = await generateTextContent({
                    system,
                    prompt: `Write a comprehensive markdown summary of the following sources:\n\n${sourceText}`,
                });
                return { markdown };
            }

            case "TAKEAWAYS": {
                return generateStructuredContent({
                    system,
                    schema: takeawaysSchema,
                    prompt: `Extract the most important key takeaways as concise bullet points from:\n\n${sourceText}`,
                });
            }

            case "FLASHCARDS": {
                return generateStructuredContent({
                    system,
                    schema: flashcardsSchema,
                    prompt: `Create study flashcards (front/back) covering the main concepts from:\n\n${sourceText}`,
                });
            }

            case "QUIZ": {
                return generateStructuredContent({
                    system,
                    schema: quizSchema,
                    prompt: `Create a multiple-choice quiz with explanations from:\n\n${sourceText}`,
                });
            }

            case "MINDMAP": {
                return generateStructuredContent({
                    system,
                    schema: mindmapSchema,
                    prompt: `Create a mind map as nodes and edges. Use a central topic node and branch out logically from:\n\n${sourceText}`,
                });
            }

            case "REPORT": {
                return generateStructuredContent({
                    system,
                    schema: reportSchema,
                    prompt: `Write a structured long-form report with sections and a full markdown version from:\n\n${sourceText}`,
                });
            }

            default: {
                const _exhaustive: never = type;
                throw new ValidationError(`Unsupported artifact type: ${_exhaustive}`);
            }
        }
    }
}





