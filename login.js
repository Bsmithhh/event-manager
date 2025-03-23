import { supabase } from './supabaseClient'

const handleLogin = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        
        if (error) throw error
        // Handle successful login
    } catch (error) {
        console.error('Error logging in:', error.message)
        // Handle error appropriately
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Check if already logged in
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
        window.location.href = "calendar.html"
        return
    }

    const loginForm = document.getElementById('login-form')
    if (!loginForm) {
        console.error('Login form not found')
        return
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const email = document.getElementById('email')?.value
        const password = document.getElementById('password')?.value
        
        if (!email || !password) {
            alert('Please enter both email and password')
            return
        }
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            
            if (error) throw error

            // Store session info
            if (data.session) {
                // Redirect to calendar page
                window.location.href = "calendar.html"
            }
        } catch (error) {
            console.error('Sign-in process failed:', error)
            alert('Login failed. Please try again.')
        }
    })
}) 