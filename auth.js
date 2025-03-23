// Handle login form submission
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded');

    // Check if we're on a protected page (calendar.html)
    const isProtectedPage = window.location.pathname.includes('calendar.html');
    const isLoginPage = window.location.pathname.includes('login.html');
    
    // Check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    
    // If not logged in and trying to access protected page, redirect to login
    if (!session && isProtectedPage) {
        window.location.href = "login.html";
        return;
    }

    // Handle login form if on login page
    if (isLoginPage) {
        console.log('On login page, looking for form with ID:', 'loginForm');
        const loginForm = document.getElementById('loginForm');
        console.log('Found form:', loginForm);
        
        if (!loginForm) {
            console.error('Login form not found');
            return;
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            
            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }
            
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                
                if (error) throw error;

                // Store session info
                if (data.session) {
                    // Redirect to calendar page
                    window.location.href = "calendar.html";
                }
            } catch (error) {
                console.error('Sign-in process failed:', error);
                alert('Login failed. Please try again.');
            }
        });
    }
});

// Handle logout
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = "login.html";
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out. Please try again.');
    }
} 