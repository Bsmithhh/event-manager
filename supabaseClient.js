// Initialize Supabase client
const supabaseUrl = 'https://jgxxbtcgswdoubwbslkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpneHhidGNnc3dkb3Vid2JzbGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMzgyNDQsImV4cCI6MjA1MDgxNDI0NH0.AA23PUgpaOIDOns9_0C2NEm36wTfwuJh2xqYTu7q8Jo';

// Create basic client
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
window.supabase = supabase;

// Test the connection only on calendar page
async function testConnection() {
    // Only test connection if we're on calendar.html
    if (!window.location.pathname.includes('calendar.html')) {
        return;
    }

    try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase
            .from('Events')
            .select('*');
        
        if (error) {
            console.error('Supabase error:', error);
            return;
        }
        console.log('Supabase connection successful:', data);
    } catch (error) {
        console.error('Connection test failed:', error);
    }
}

// Run the test
testConnection(); 