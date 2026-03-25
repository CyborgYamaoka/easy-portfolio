import { supabase } from "./supabase";

export async function fetchProfile() {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
