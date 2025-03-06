const supabaseUrl = 'https://jgxxbtcgswdoubwbslkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpneHhidGNnc3dkb3Vid2JzbGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMzgyNDQsImV4cCI6MjA1MDgxNDI0NH0.AA23PUgpaOIDOns9_0C2NEm36wTfwuJh2xqYTu7q8Jo';

// Initialize the Supabase client
window.supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Helper function to check admin status
window.isAdmin = function(userId) {
    return userId === 'aff5156c-5907-4d35-bba7-c85f3b3e83d1';
};
