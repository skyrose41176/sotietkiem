function capitalize(str: string) {
  if (!str) {
    return;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function shortenTitle(title: string, limit: number) {
  if (!title) return "";
  let shortenedTitle = "";
  const words = (title || "").split(" ");
  let i = 0;
  while (
    i < words.length &&
    (shortenedTitle + " " + words[i] + "...").length < limit
  ) {
    shortenedTitle += " " + words[i];
    i++;
  }
  if (shortenedTitle.length < (title || "").length) {
    return shortenedTitle + "...";
  }
  return capitalize(shortenedTitle);
}
