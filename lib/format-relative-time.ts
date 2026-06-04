export function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return diffMin === 1 ? "1 minute ago" : `${diffMin} minutes ago`;
  }
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) {
    return diffHr === 1 ? "1 hour ago" : `${diffHr} hours ago`;
  }
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) {
    return diffDay === 1 ? "1 day ago" : `${diffDay} days ago`;
  }
  const diffMonth = Math.floor(diffDay / 30);
  return diffMonth === 1 ? "1 month ago" : `${diffMonth} months ago`;
}
