import { SupabaseClient } from "@supabase/supabase-js";

export function getStoragePublicUrl(
  supabase: SupabaseClient,
  bucket: string,
  path?: string | null,
  updatedAt?: Date | string
) {
  if (!path) return null
  const {
    data: { publicUrl },
  } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  if (!updatedAt) return publicUrl;

  const version =
    updatedAt instanceof Date
      ? updatedAt.getTime()
      : new Date(updatedAt).getTime();

  return `${publicUrl}?v=${version}`;
}