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
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error('Error signing in:', error.message);
                alert('Login failed. Check your credentials.');
            } else {
                console.log('Admin signed in successfully:', data);
                alert('Login successful!');
                // Redirect to admin dashboard or enable admin functions
            }
        };

        document.getElementById('login-button').addEventListener('click', (e) => {
            e.preventDefault();
            const email = prompt('Enter your admin email:');
            const password = prompt('Enter your password:');
            handleSignIn(email, password);
        });

    } catch (err) {
        console.error('Error initializing Supabase:', err.message);
    }
});
