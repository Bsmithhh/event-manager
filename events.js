// Define event handlers
window.eventHandlers = {
    async createEvent(eventData) {
        try {
            const isClientLoggedIn = sessionStorage.getItem('isClientLoggedIn') === 'true';
            
            if (!isClientLoggedIn) {
                throw new Error('You must be logged in as an administrator to create events.');
            }

            // Get current user
            const { data: { user }, error: userError } = await window.supabase.auth.getUser();
            
            if (userError || !user) {
                throw new Error('Authentication error. Please log in again.');
            }

            // Create event with exact column names matching the database
            const eventToCreate = {
                title: eventData.title,
                description: eventData.description,
                start: eventData.start,
                end_time: eventData.end_time,
                created_by: user.id
            };

            console.log('Creating event with data:', eventToCreate);

            const { data, error } = await window.supabase
                .from('Events')
                .insert([eventToCreate])
                .select();

            if (error) throw error;

            console.log('Event created successfully:', data);
            return true;
        } catch (error) {
            console.error('Error in createEvent:', error);
            throw error;
        }
    },

    async loadEvents() {
        try {
            const { data, error } = await window.supabase
                .from('Events')
                .select('*');

            if (error) throw error;

            return data.map(event => ({
                id: event.id,
                title: event.title,
                description: event.description,
                start: event.start,
                end: event.end_time
            }));
        } catch (error) {
            console.error('Error in loadEvents:', error);
            throw error;
        }
    },

    // Add this function to handle event deletion
    async deleteEvent(eventId) {
        try {
            const isClientLoggedIn = sessionStorage.getItem('isClientLoggedIn') === 'true';
            
            if (!isClientLoggedIn) {
                alert('You must be logged in as an administrator to delete events.');
                return false;
            }

            // Get current user
            const { data: { user }, error: userError } = await window.supabase.auth.getUser();
            
            if (userError || !user) {
                alert('Your session has expired. Please log in again.');
                return false;
            }

            const { error } = await window.supabase
                .from('Events')
                .delete()
                .eq('id', eventId)
                .eq('created_by', user.id); // Only delete if created by this user

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event: ' + error.message);
            return false;
        }
    }
}; 