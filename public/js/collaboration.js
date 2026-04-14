// creates a new collaboration request for a given project
async function createCollaborationRequest(projectId, message) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  // Fetch the project to get the owner's user ID for the collaboration request.
  const { data: project, error: projectError } = await window.supabaseClient
    .from("projects")
    .select("project_id, user_id")
    .eq("project_id", projectId)
    .single();

  if (projectError) {
    throw projectError;
  }

  // Prevent users from requesting collaboration on their own projects.
  if (project.user_id === user.id) {
    throw new Error("You cannot request collaboration on your own project.");
  }

  const { data, error } = await window.supabaseClient
    .from("collaborations")
    .insert([
      {
        message: message ? message.trim() : "",
        status: "pending",
        user_id: user.id,
        project_id: projectId,
      },
    ])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

// load collaboration requests for a given project
async function fetchCollaborationsByProject(projectId) {
  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  // query the collaborations table for rows that match the given project ID
  const { data, error } = await window.supabaseClient
    .from("collaborations")
    .select(
      `
      collaboration_id,
      message,
      status,
      created_at,
      project_id,
      profiles (
        name,
        surname
      )
    `,
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

// expose functions globally
window.createCollaborationRequest = createCollaborationRequest;
window.fetchCollaborationsByProject = fetchCollaborationsByProject;
