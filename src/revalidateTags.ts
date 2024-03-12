import { revalidateTag } from "next/cache";

export type RevalidatableTag =
  | "CRA"
  | `CRA:Membre:${string}:YearMonth:${string}`
  | `CRA:Membre:${string}`
  | `CRA:YearMonth:${string}`
  | `Membre:${string}`;

declare module "next/cache" {
  export function revalidateTag(tag: RevalidatableTag): void;
}

export function revalidateTags(...tags: RevalidatableTag[]): void {
  for (const tag of tags) {
    revalidateTag(tag);
  }
}
