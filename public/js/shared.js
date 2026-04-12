// Shared object that all pages can use.
var app = window.AppShared || {};
window.AppShared = app;

// Store current logged-in user here.
var currentUser = null;

// Promise used by pages that must wait for auth state.
var resolveAuthReady;
var authReady = new Promise(function (resolve) {
  resolveAuthReady = resolve;
});

function showToast(message) {
  if (!message) {
    return;
  }
  alert(message);
}

// Convert a date string into a simple "time ago" label.
function formatRelativeTime(dateString) {
  var timestamp = new Date(dateString).getTime();
  if (!timestamp) {
    return "just now";
  }

  var diff = Date.now() - timestamp;
  var minutes = Math.floor(diff / 60000);
  if (minutes < 60) {
    return minutes + "m ago";
  }

  var hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours + "h ago";
  }

  var days = Math.floor(hours / 24);
  return days + "d ago";
}

function toggleMobileMenu() {
  var menu = document.getElementById("mobile-menu");
  if (menu) {
    menu.classList.toggle("open");
  }
}

// Show different navbar links for guest vs signed-in users.
function renderAuthLinks(user) {
  var desktopLinks = document.getElementById("auth-links");
  var mobileLinks = document.getElementById("auth-links-mobile");

  if (!desktopLinks) {
    return;
  }

  if (user) {
    desktopLinks.innerHTML =
      '<a href="new-project.html" class="btn btn-primary btn-sm">+ New Project</a><a href="my-projects.html" class="text-sm">My Projects</a><a href="profile.html" class="text-sm">Profile</a><button onclick="signOut()" class="btn btn-ghost btn-sm">Sign Out</button>';

    if (mobileLinks) {
      mobileLinks.innerHTML =
        '<a href="new-project.html">New Project</a><a href="my-projects.html">My Projects</a><a href="profile.html">Profile</a><button onclick="signOut()">Sign Out</button>';
    }
    return;
  }

  desktopLinks.innerHTML =
    '<a href="login.html" class="btn btn-primary btn-sm">Sign In</a>';
  if (mobileLinks) {
    mobileLinks.innerHTML = '<a href="login.html">Sign In</a>';
  }
}

// 6) Load initial auth state and subscribe to auth changes.
async function initAuth() {
  if (!window.supabaseClient) {
    resolveAuthReady(null);
    return;
  }

  try {
    var sessionResponse = await window.supabaseClient.auth.getSession();
    var session = sessionResponse.data ? sessionResponse.data.session : null;

    currentUser = session ? session.user : null;
    window.currentUser = currentUser;
    renderAuthLinks(currentUser);
  } catch (_error) {
    currentUser = null;
    window.currentUser = null;
    renderAuthLinks(null);
  } finally {
    resolveAuthReady(currentUser);
  }

  window.supabaseClient.auth.onAuthStateChange(function (_event, session) {
    currentUser = session ? session.user : null;
    window.currentUser = currentUser;
    renderAuthLinks(currentUser);
  });
}

async function signOut() {
  if (!window.supabaseClient) {
    return;
  }

  await window.supabaseClient.auth.signOut();
  window.location.href = "/index.html";
}

//Helper for pages that require login.
async function requireAuth(redirectTo) {
  var redirectPath = redirectTo || "login.html";
  await authReady;

  if (!currentUser) {
    window.location.href = redirectPath;
    return false;
  }
  return true;
}

//Helper for pages that require guest users.
async function requireGuest(redirectTo) {
  var redirectPath = redirectTo || "my-projects.html";
  await authReady;

  if (currentUser) {
    window.location.href = redirectPath;
    return false;
  }
  return true;
}

// Expose shared helpers.
app.showToast = showToast;
app.formatRelativeTime = formatRelativeTime;
app.toggleMobileMenu = toggleMobileMenu;
app.waitForAuth = function () {
  return authReady;
};
app.getCurrentUser = function () {
  return currentUser;
};
app.signOut = signOut;
app.requireAuth = requireAuth;
app.requireGuest = requireGuest;

// Keep old globals for existing HTML onclick handlers.
window.showToast = showToast;
window.toggleMobileMenu = toggleMobileMenu;
window.signOut = signOut;

// Run startup logic when page loads.
document.addEventListener("DOMContentLoaded", function () {
  var yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  initAuth();
});
