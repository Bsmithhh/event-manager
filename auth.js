let supabaseInitialized = false;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for Supabase to be available
        let attempts = 0;
        while (!window.supabase && attempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (!window.supabase) {
            throw new Error('Supabase failed to initialize');
        }

        supabaseInitialized = true;
        console.log('Supabase initialized successfully');

        // Log Supabase initialization status
        console.log('Supabase initialization check:', {
            supabaseExists: !!window.supabase,
            authExists: !!(window.supabase && window.supabase.auth),
            clientConfig: window.supabase?.constructor?.name
        });

        // Test Supabase connection
        const { data, error } = await supabase.from('Events').select('count').single();
        if (error) {
            console.error('Supabase test query error:', error);
            throw error;
        }
        console.log('Supabase connection successful');

        async function handleSignIn(email, password) {
            try {
                if (!supabaseInitialized) {
                    throw new Error('Supabase not initialized. Please refresh the page.');
                }

                console.log('Attempting sign in with:', email);
                
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    console.error('Sign in error:', error);
                    throw error;
                }

                if (!data.user) {
                    throw new Error('No user data received');
                }

                console.log('Sign in successful');
                sessionStorage.setItem('isClientLoggedIn', 'true');
                sessionStorage.setItem('userEmail', data.user.email);
                
                // Verify the session was set
                const sessionCheck = sessionStorage.getItem('isClientLoggedIn');
                console.log('Session storage set:', sessionCheck);

                // Add a delay before redirect
                await new Promise(resolve => setTimeout(resolve, 500));
                window.location.href = "calendar.html";

            } catch (error) {
                console.error('Sign in failed:', error);
                alert(`Login failed: ${error.message}`);
            }
        }

        const loginForm = document.getElementById('login-form');
        if (!loginForm) {
            throw new Error('Login form not found in the document');
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            
            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }
            
            handleSignIn(email, password);
        });

        // Update the function to check specifically for your client's ID
        function updateCreateEventButton() {
            const createEventButtons = document.querySelectorAll('.event-button, .start-creating');
            
            supabase.auth.getUser().then(({ data: { user }, error }) => {
                const isClient = user?.id === 'aff5156c-5907-4d35-bba7-c85f3b3e83d1';
                
                createEventButtons.forEach(button => {
                    if (isClient) {
                        button.style.display = 'flex';
                        button.disabled = false;
                    } else {
                        button.style.display = 'none';
                        button.disabled = true;
                    }
                });
            });
        }

        // Call this function when the page loads and after login/logout
        updateCreateEventButton();
        
        // Subscribe to auth state changes
        supabase.auth.onAuthStateChange((event, session) => {
            updateCreateEventButton();
        });

        async function handleSignOut() {
            try {
                if (!supabaseInitialized) {
                    throw new Error('Supabase not initialized');
                }

                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                
                sessionStorage.removeItem('isClientLoggedIn');
                sessionStorage.removeItem('userEmail');
                window.location.href = "index.html";
            } catch (error) {
                console.error('Sign out error:', error);
                alert(`Sign out failed: ${error.message}`);
            }
        }

        // Add this function to verify Supabase initialization
        function verifySupabaseInit() {
            if (!window.supabase) {
                console.error('Supabase not initialized');
                return false;
            }
            return true;
        }

        // Add this function to check login status
        function checkLoginStatus() {
            const isLoggedIn = sessionStorage.getItem('isClientLoggedIn') === 'true';
            console.log('Current login status:', isLoggedIn);
            return isLoggedIn;
        }

    } catch (err) {
        console.error('Supabase connection error:', err);
        alert('Error connecting to the database. Please refresh the page.');
    }
});
