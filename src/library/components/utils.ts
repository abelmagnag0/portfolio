// Util interno de composição de classes (simplificado)
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | boolean
  | Record<string, boolean | null | undefined>
  | ClassValue[];

function toArray(input: ClassValue): string[] {
  if (!input) return [];
  if (typeof input === "string" || typeof input === "number") return [String(input)];
  if (Array.isArray(input)) return input.flatMap(toArray);
  if (typeof input === "object") {
    return Object.entries(input)
      .filter(([, v]) => !!v)
      .map(([k]) => k);
  }
  return [];
}

export function cn(...inputs: ClassValue[]) {
  return inputs.flatMap(toArray).join(" ").trim();
}
