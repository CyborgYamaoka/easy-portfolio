import { supabase } from "./supabase";

export async function fetchGenres() {
  const { data } = supabase.storage.from("config").getPublicUrl("genre.json");
  const res = await fetch(data.publicUrl);
  if (!res.ok) throw new Error("Failed to fetch genres");
  const genres = await res.json();
  return ["All", ...genres];
}
