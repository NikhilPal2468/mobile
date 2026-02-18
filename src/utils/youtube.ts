/**
 * Extract YouTube video ID from common URL formats.
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
export function getYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\?|$)/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/watch?v=VIDEO_ID or youtube.com/embed/VIDEO_ID
  const longMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  if (longMatch) return longMatch[1];

  return null;
}
