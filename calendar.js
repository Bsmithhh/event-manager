// Initialize calendar
$(document).ready(function() {
    console.log('Calendar initialization starting...');
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'month',
        navLinks: true,
        editable: true,
        eventLimit: true,
        displayEventTime: false, // Hide time
        events: function(start, end, timezone, callback) {
            supabase
                .from('Events')
                .select('*')
                .then(({ data: events, error }) => {
                    if (error) {
                        console.error('Error fetching events:', error);
                        callback([]);
                        return;
                    }

                    console.log('Raw events from Supabase:', events);

                    // Transform events for FullCalendar
                    const formattedEvents = events.map(event => ({
                        id: event.id,
                        title: event.title,
                        start: event.start, // Use date directly from database
                        end: event.end_time, // Use date directly from database
                        description: event.description,
                        allDay: true
                    }));

                    console.log('Formatted events:', formattedEvents);
                    callback(formattedEvents);
                })
                .catch(error => {
                    console.error('Error:', error);
                    callback([]);
                });
        },
        eventRender: function(event, element) {
            element.attr('title', 
                `${event.title}\n${event.description || ''}`
            );
        },
        eventClick: function(event) {
            console.log('Clicked event:', event);
            
            // Show the poll modal
            const pollModal = document.getElementById('pollModal');
            
            // Add event details to the modal
            const modalTitle = pollModal.querySelector('h2');
            modalTitle.innerHTML = `Event: ${event.title}`;
            
            // Add description before the form
            const form = pollModal.querySelector('#pollForm');
            let descriptionDiv = pollModal.querySelector('.event-description');
            if (!descriptionDiv) {
                descriptionDiv = document.createElement('div');
                descriptionDiv.className = 'event-description';
                form.parentNode.insertBefore(descriptionDiv, form);
            }
            descriptionDiv.innerHTML = `
                <p><strong>Description:</strong></p>
                <p>${event.description || 'No description available'}</p>
            `;
            
            pollModal.style.display = 'block';
            
            // Store the event ID for the poll submission
            window.currentEventId = event.id;
        }
    });
    console.log('Calendar initialization complete');

    // Handle Create Event button click
    window.handleCreateEvent = function() {
        const modal = document.getElementById('createEventModal');
        modal.style.display = 'block';
    };

    // Handle poll form submission
    $('#pollForm').submit(async function(e) {
        e.preventDefault();

        const pollData = {
            event_id: window.currentEventId,
            respondent_name: $('#respondent_name').val(),
            availability: $('#availability').val(),
            comment: $('#comment').val()
        };

        try {
            const { data, error } = await supabase
                .from('Polls')
                .insert([pollData])
                .select();

            if (error) throw error;

            alert('Response submitted successfully!');
            $('#pollModal').hide();
            $('#pollForm')[0].reset();
        } catch (error) {
            console.error('Error submitting poll response:', error);
            alert('Failed to submit response. Please try again.');
        }
    });

    // Handle modal close button
    $('.close').click(function() {
        $(this).closest('.modal').hide();
    });

    // Handle clicking outside modal
    $(window).click(function(event) {
        if ($(event.target).hasClass('modal')) {
            $('.modal').hide();
        }
    });

    // Handle event form submission
    $('#createEventForm').submit(async function(e) {
        e.preventDefault();

        const eventData = {
            title: $('#eventTitle').val(),
            description: $('#eventDescription').val(),
            start: $('#eventStart').val().split('T')[0], // Get only the date part
            end_time: $('#eventEnd').val().split('T')[0] // Get only the date part
        };

        try {
            const { data, error } = await supabase
                .from('Events')
                .insert([eventData])
                .select();

            if (error) throw error;

            alert('Event created successfully!');
            $('#createEventModal').hide();
            $('#createEventForm')[0].reset();
            $('#calendar').fullCalendar('refetchEvents');
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event. Please try again.');
        }
    });
}); 