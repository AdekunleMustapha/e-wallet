// src/shared/presentation/transforms.ts
import { Transform } from "class-transformer";

/** "lagOS" -> "Lagos", "akwa IBOM" -> "Akwa Ibom", "  federal capital territory " -> "Federal Capital Territory" */
export function toTitleCase(value: unknown): unknown {
    if (typeof value !== "string") return value;
    return value
        .trim()
        .toLowerCase()
        .replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase());
}

export const TitleCase = () => Transform(({ value }) => toTitleCase(value));