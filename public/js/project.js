/*
  Create a new project for the currently authenticated user.
*/
async function createProject(project) {
  /*
    Ask Supabase who the current user is.
    We need the user's ID so the new project can belong to that user.
  */
  const user = await getCurrentUser();

  /*
    Stop immediately if there is no logged-in user.
  */
  if (!user) {
    throw new Error("User not authenticated.");
  }

  /*
    Validate the project object before sending it to the database.
  */
  const validationError = window.validateProjectInput(project);

  /*
    If validation fails, stop and show the message.
  */
  if (validationError) {
    throw new Error(validationError);
  }

  /*
    If the selected stage is "completed", mark the project as complete.
    Otherwise, keep it incomplete.
  */
  const isComplete = project.stage === "completed";

  /*
    Insert the new project into the "projects" table.
  */
  const { data, error } = await window.supabaseClient
    .from("projects")
    .insert([
      {
        title: project.title,
        description: project.description,
        tech_stack: project.techStack,
        stage: project.stage,
        support_required: project.supportRequired,
        is_complete: isComplete,
        user_id: user.id,
      },
    ])
    .select();

  /*
    Throw any database error so the UI can show it.
  */
  if (error) {
    throw error;
  }

  /*
    Return the inserted row.
  */
  return data;
}

/*
  Fetch all projects for the public live feed.
*/
async function fetchAllProjects() {
  /*
    Query all projects and include the related profile name/surname.
    Supabase supports nested relation fetching through foreign keys.
  */
  const { data, error } = await window.supabaseClient
    .from("projects")
    .select(
      `
      project_id,
      title,
      description,
      tech_stack,
      stage,
      support_required,
      is_complete,
      created_at,
      updated_at,
      profiles (
        name,
        surname
      )
    `,
    )
    .order("updated_at", { ascending: false });

  /*
    Throw any error from Supabase.
  */
  if (error) {
    throw error;
  }

  /*
    Return the full public project list.
  */
  return data;
}

/*
  Fetch only the currently authenticated user's projects.
*/
async function fetchMyProjects() {
  /*
    Get the current user so we know which rows belong to them.
  */
  const user = await getCurrentUser();

  /*
    Stop if there is no logged-in user.
  */
  if (!user) {
    throw new Error("User not authenticated.");
  }

  /*
    Query only projects where user_id matches the logged-in user.
  */
  const { data, error } = await window.supabaseClient
    .from("projects")
    .select(
      `
      project_id,
      title,
      description,
      stage,
      support_required,
      is_complete,
      created_at,
      updated_at,
      tech_stack
    `,
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  /*
    Throw any query error.
  */
  if (error) {
    throw error;
  }

  /*
    Return only this user's project list.
  */
  return data;
}

/*
  Update the stage of one project.

  This should only succeed for the owner because RLS should block
  updates to rows that do not belong to auth.uid().
*/
async function updateProjectStage(projectId, newStage) {
  /*
    Work out whether the project should now count as complete.
  */
  const isComplete = newStage === "completed";

  /*
    Supabase update queries should always be filtered, and if you want
    the changed row back, chain .select() after the update.
  */
  const { data, error } = await window.supabaseClient
    .from("projects")
    .update({
      stage: newStage,
      is_complete: isComplete,
      updated_at: new Date().toISOString(),
    })
    .eq("project_id", projectId)
    .select();

  /*
    Throw any update error.
  */
  if (error) {
    throw error;
  }

  /*
    Return the updated row.
  */
  return data;
}

/*
  This function checks whether a given value is empty.
*/
function isEmpty(value) {
  return !value || value.trim() === "";
}

/*
  This function validates project input
*/
function validateProjectInput(project) {
  /*
    Check whether the title field is missing or blank.
    A project must always have a title.
  */
  if (isEmpty(project.title)) {
    return "Project title is required.";
  }

  /*
    Check whether the tech stack field is missing or blank.

  */
  if (isEmpty(project.techStack)) {
    return "Tech stack is required.";
  }

  /*
    Check whether the stage field is missing or blank.

  */
  if (isEmpty(project.stage)) {
    return "Project stage is required.";
  }

  return null;
}

// expose functions globally
window.isEmpty = isEmpty;
window.validateProjectInput = validateProjectInput;
window.createProject = createProject;
window.fetchAllProjects = fetchAllProjects;
window.fetchMyProjects = fetchMyProjects;
window.updateProjectStage = updateProjectStage;
