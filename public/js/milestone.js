// add a new milestone to a project
async function addMilestone(projectId, title, description) {
  // validate the project ID
  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  // validate the milestone title is not empty
  if (!title || title.trim() === "") {
    throw new Error("Milestone title is required.");
  }

  // insert the new milestone into the milestones table
  const { data, error } = await window.supabaseClient
    .from("milestones")
    .insert([
      {
        title: title.trim(),

        description: description ? description.trim() : "",

        //link the milestone to the project using the project ID
        project_id: projectId,
      },
    ])

    // return the inserted row so we can show it in the UI
    .select();

  if (error) {
    throw error;
  }

  /*
    Return the inserted milestone data.
  */
  return data;
}

// fetch all milestones for a given project
async function fetchMilestonesByProject(projectId) {
  // validate the project ID
  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  // query the milestones table for rows that match the given project ID
  const { data, error } = await window.supabaseClient
    .from("milestones")
    .select(
      `
      milestone_id,
      title,
      description,
      date_achieved,
      project_id
    `,
    )
    // filter by the given project ID
    .eq("project_id", projectId)
    // order milestones by date achieved, most recent first
    .order("date_achieved", { ascending: false });
  if (error) {
    throw error;
  }

  return data;
}

// Expose the functions globally
window.addMilestone = addMilestone;
window.fetchMilestonesByProject = fetchMilestonesByProject;
