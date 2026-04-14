// fetch completed projects for the celebration page
async function fetchCompletedProjects() {
  const { data, error } = await window.supabaseClient
    .from("projects")
    .select(
      `
      project_id,
      title,
      description,
      updated_at,
      profiles:user_id (
        name,
        surname
      )
    `,
    )
    .eq("is_complete", true)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
