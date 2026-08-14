/**
 * YouTube transcript extraction for YOUTUBE source imports.
 */

import { YoutubeTranscript } from "youtube-transcript";


/**
 * Fetches caption transcript text for a YouTube video.
 *
 * @param url - YouTube page URL
 * @returns Video id and concatenated transcript text
 * @throws {ValidationError} When the URL is invalid, captions are missing, or fetch fails
 *
 *
 */
export async function fetchYoutubeTranscript(url: string) {
	const videoId =
		url.match(
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/,
		)?.[1] ?? url.match(/youtube\.com\/shorts\/([\w-]{11})/)?.[1];

	if (!videoId) {
		throw new Error("Enter a valid YouTube URL");
	}

	try {
		const segments = await YoutubeTranscript.fetchTranscript(videoId);
		const content = segments
			.map((segment) => segment.text)
			.join(" ")
			.trim();

		if (!content) {
			throw new Error("No transcript found for this video");
		}

		return { videoId, content };
	} catch {
		throw new Error(
			"Could not fetch transcript. The video may not have captions.",
		);
	}
}
