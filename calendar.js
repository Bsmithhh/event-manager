document.addEventListener('DOMContentLoaded', async function() {
    // Wait for Supabase to be initialized
    let attempts = 0;
    while (!window.supabase && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }

    if (!window.supabase) {
        console.error('Supabase failed to initialize');
        return;
    }

    // Initialize the calendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: async function(info, successCallback, failureCallback) {
            try {
                // Use window.supabase to fetch events
                const { data, error } = await window.supabase
                    .from('Events')
                    .select('*');

                if (error) throw error;

                const events = data.map(event => ({
                    id: event.id,
                    title: event.title,
                    start: event.date,
                    description: event.description,
                    location: event.location,
                    allDay: true
                }));

                successCallback(events);
            } catch (error) {
                console.error('Error loading events:', error);
                failureCallback(error);
            }
        },
        eventClick: function(info) {
            alert(`
                Event: ${info.event.title}
                ${info.event.extendedProps.description ? '\nDescription: ' + info.event.extendedProps.description : ''}
                ${info.event.extendedProps.location ? '\nLocation: ' + info.event.extendedProps.location : ''}
            `);
        }
    });

    calendar.render();

    // Handle form submission for creating events
    document.getElementById('createEventForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const eventData = {
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDescription').value,
            date: document.getElementById('eventDate').value,
            location: document.getElementById('eventLocation').value
        };

        try {
            await window.eventHandlers.createEvent(eventData);
            calendar.refetchEvents(); // Refresh calendar events
            bootstrap.Modal.getInstance(document.getElementById('createEventModal')).hide();
            document.getElementById('createEventForm').reset();
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event: ' + error.message);
        }
    });
});

// Add this function to format events for display
function formatEvents(events) {
    return events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end_time
    }));
} 