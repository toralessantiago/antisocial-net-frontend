/** Extrae un ID de string, ObjectId-like o usuario poblado. */
export function extractId(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const obj = value as { _id?: string; id?: string };
    return obj._id ?? obj.id ?? null;
  }
  return String(value);
}

export function getUserId(user: { id?: string; _id?: string } | null | undefined): string | null {
  if (!user) return null;
  return user.id ?? user._id ?? null;
}

export function idsMatch(a: unknown, b: unknown): boolean {
  const idA = extractId(a);
  const idB = extractId(b);
  if (!idA || !idB) return false;
  return String(idA) === String(idB);
}

export function isUserInLikes(likes: unknown[] | undefined, userId: string | null): boolean {
  if (!userId || !likes?.length) return false;
  return likes.some((entry) => idsMatch(entry, userId));
}

export function isFollowingUser(
  following: unknown[] | undefined,
  targetUserId: string,
): boolean {
  if (!following?.length) return false;
  return following.some((entry) => idsMatch(entry, targetUserId));
}

export function countFollowList(list: unknown[] | undefined): number {
  return list?.length ?? 0;
}

export type FollowListEntry = {
  id: string;
  nickname?: string;
  fullname?: string;
};

export function normalizeFollowEntry(entry: unknown): FollowListEntry {
  const id = extractId(entry);
  if (typeof entry === "object" && entry !== null) {
    const u = entry as { nickname?: string; fullname?: string };
    return {
      id: id ?? "unknown",
      nickname: u.nickname,
      fullname: u.fullname,
    };
  }
  return { id: id ?? String(entry), nickname: undefined, fullname: undefined };
}

export function normalizeUserFromApi<T extends Record<string, unknown>>(data: T) {
  return {
    ...data,
    id: (data._id as string) || (data.id as string),
  };
}
