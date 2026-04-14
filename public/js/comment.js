// add a new comment to a project
async function addComment(projectId, content) {
  const user = await getCurrentUser();

  // Stop if there is no logged-in user.
  if (!user) {
    throw new Error("User not authenticated.");
  }

  // validate the project ID is provided
  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  // validate the comment content is not empty
  if (!content || content.trim() === "") {
    throw new Error("Comment content is required.");
  }

  // Insert the new comment into the comments, linking it to the user and project.
  const { data, error } = await window.supabaseClient
    .from("comments")
    .insert([
      {
        content: content.trim(),
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

// fetch all comments for a given project
async function fetchCommentsByProject(projectId) {
  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  // Query the comments table for rows that match the given project ID
  const { data, error } = await window.supabaseClient
    .from("comments")
    .select(
      `
      comment_id,
      content,
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

// expose fucntions globally
window.addComment = addComment;
window.fetchCommentsByProject = fetchCommentsByProject;
