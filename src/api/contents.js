import { supabase } from "./supabase";

const PAGE_SIZE = 12;

export async function fetchContents({ tag = null, page = 0 } = {}) {
  let query = supabase
    .from("contents")
    .select("*")
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
  if (tag && tag !== "All") query = query.eq("tag", tag);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchContentById(id) {
  const { data, error } = await supabase.from("contents").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function deleteContents(ids) {
  // Use Edge Function so storage files are deleted too
  const res = await fetch(import.meta.env.VITE_EDGE_FUNCTION_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": sessionStorage.getItem("admin_api_key") || "",
    },
    body: JSON.stringify({ ids }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
