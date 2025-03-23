// Initialize calendar
$(document).ready(function() {
    console.log('Calendar initialization starting...');
    // Store the original events
    let allEvents = [];
    let currentCategory = 'all';

    // Update the events function to store events
    const calendar = $('#calendar').fullCalendar({
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

                    // Transform and store events
                    allEvents = events.map(event => ({
                        id: event.id,
                        title: event.title,
                        start: event.start,
                        end: event.end_time,
                        description: event.description,
                        category: event.category || 'default',
                        allDay: true,
                        className: `event-${event.category || 'default'}`
                    }));

                    callback(allEvents);
                })
                .catch(error => {
                    console.error('Error:', error);
                    callback([]);
                });
        },
        eventRender: function(event, element) {
            // Add event ID to the element
            element.attr('data-event-id', event.id);
            element.attr('data-category', event.category || 'default');
            
            // Add tooltip
            element.attr('title', `${event.title}\n${event.description || ''}`);
            
            // Filter based on search term and category
            let showEvent = true;
            
            // Search filter
            if (window.currentSearch) {
                const searchTerm = window.currentSearch.toLowerCase();
                const titleMatch = event.title.toLowerCase().includes(searchTerm);
                const descriptionMatch = event.description?.toLowerCase().includes(searchTerm) || false;
                showEvent = titleMatch || descriptionMatch;
            }
            
            // Category filter
            if (showEvent && currentCategory !== 'all') {
                showEvent = event.category === currentCategory;
            }
            
            return showEvent;
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
            start: $('#eventStart').val().split('T')[0],
            end_time: $('#eventEnd').val().split('T')[0],
            category: $('#eventCategory').val() // Add category to event data
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

    // Add search functionality
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val();
        window.currentSearch = searchTerm;
        $('#calendar').fullCalendar('rerenderEvents');
    });

    // Add category filter functionality
    $('.category-filters .filter-btn').click(function() {
        // Remove active class from all buttons
        $('.category-filters .filter-btn').removeClass('active');
        // Add active class to clicked button
        $(this).addClass('active');
        
        // Update current category
        currentCategory = $(this).data('category');
        
        // Rerender events with new filter
        $('#calendar').fullCalendar('rerenderEvents');
    });
}); 