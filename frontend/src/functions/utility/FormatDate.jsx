export default function formatDate(timestamp) {
  const date = new Date(Number(timestamp));
  return date.toLocaleString();
}
