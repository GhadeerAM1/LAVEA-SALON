const SUPABASE_URL = "https://zerwymznhojeaeyrggnl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_L7sKCa3zTelmLbDdB3XawA_oK8V5pKb";

const supabaseClient = window.supabase.createClient( SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY );
const loginForm = document.getElementById("loginForm"); const loginMessage = document.getElementById("loginMessage");
loginForm.addEventListener("submit", async function(event) { event.preventDefault();
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

loginMessage.textContent = "Logging in...";

const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
});

if (error) {
    console.error(error);
    loginMessage.textContent = "Email or password is incorrect.";
    return;
}

console.log("Login successful:", data);

window.location.href = "dashboard.html";
});