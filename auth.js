document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Starting Supabase initialization');
        
        const supabaseUrl = 'https://jgxxbtcgswdoubwbslkl.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpneHhidGNnc3dkb3Vid2JzbGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMzgyNDQsImV4cCI6MjA1MDgxNDI0NH0.AA23PUgpaOIDOns9_0C2NEm36wTfwuJh2xqYTu7q8Jo';

        console.log('Creating Supabase client');
        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        console.log('Supabase Initialized:', supabase);

        const handleSignIn = async (email, password) => {
            console.log('Attempting to sign in with email:', email);

            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                console.error('Error signing in:', error.message);
                alert('Login failed. Check your credentials.');
            } else {
                console.log('User signed in successfully:', data);
                window.location.href = "calendar.html";
            }
        };

        document.getElementById('submit').addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            handleSignIn(email, password);
        });

    } catch (err) {
        console.error('Error initializing Supabase:', err.message);
    }
});
