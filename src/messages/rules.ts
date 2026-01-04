export type MessageRule = {
  key: string;
  threshold: number;
  message: string;
};

const rules: MessageRule[] = [
  { key: "tabs-10", threshold: 10, message: "amateur hour" },
  { key: "tabs-20", threshold: 20, message: "okay software architect" },
  { key: "tabs-30", threshold: 30, message: "are you okay" },
  { key: "tabs-40", threshold: 40, message: "you need help" }
];

export function getMessageForCount(count: number): MessageRule | null {
  const matching = rules.filter((rule) => count >= rule.threshold);
  if (matching.length === 0) {
    return null;
  }
  return matching[matching.length - 1];
}
