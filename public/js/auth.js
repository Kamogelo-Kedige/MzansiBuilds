//sign up a user and create their profile
async function signUpUser(name, surname, email, password) {
  const { data, error } = await window.supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  const user = data.user;

  if (!user) {
    throw new Error("Signup failed. No user returned.");
  }

  // wait for supabase to insert the new user before creating the profile
  const { error: profileError } = await window.supabaseClient
    .from("profiles")
    .insert([
      {
        user_id: user.id,
        name,
        surname,
        email,
      },
    ]);

  if (profileError) {
    throw profileError;
  }

  return user;
}

//log a user in after signing up
async function signInUser(email, password) {
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

// return the current logged in user
async function getCurrentUser() {
  const { data, error } = await window.supabaseClient.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

// sign out the current user
async function signOutUser() {
  const { error } = await window.supabaseClient.auth.signOut();

  if (error) {
    throw error;
  }
}

// helper to get current session
async function getCurrentSession() {
  const { data, error } = await window.supabaseClient.auth.getSession();
  if (error) throw error;
  return data.session;
}
