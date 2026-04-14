// fech the current user's profile details
async function fetchMyProfile() {
  //get current logged in user
  const user = await getCurrentUser();

  // Stop if there is no logged-in user.
  if (!user) {
    throw new Error("User not authenticated.");
  }
  // Query the profiles table for the row that matches the logged-in user's ID.
  const { data, error } = await window.supabaseClient
    .from("profiles")
    .select(
      `
      user_id,
      name,
      surname,
      email,
      created_at
    `,
    )
    .eq("user_id", user.id)
    .single();

  // Throw any query error

  if (error) {
    throw error;
  }

  // return the fetched profile information
  return data;
}

// allows the current user to update their profile details only name and surname
async function updateMyProfile(profile) {
  const user = await getCurrentUser();

  // Stop if there is no logged-in user.
  if (!user) {
    throw new Error("User not authenticated.");
  }

  // validate the name and surname fields are not empty
  if (!profile.name || profile.name.trim() === "") {
    throw new Error("Name is required.");
  }

  if (!profile.surname || profile.surname.trim() === "") {
    throw new Error("Surname is required.");
  }

  // Update the profiles table for the logged-in user's row with the new name and surname.
  const { data, error } = await window.supabaseClient
    .from("profiles")
    .update({
      name: profile.name.trim(),
      surname: profile.surname.trim(),
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // return the updated profile data to the caller
  return data;
}

// expose functions gloabally
window.fetchMyProfile = fetchMyProfile;
window.updateMyProfile = updateMyProfile;
