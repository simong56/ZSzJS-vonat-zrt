document.addEventListener('DOMContentLoaded', function() {
    // Ticket form validation and submission
    const ticketForm = document.getElementById('ticketForm');
    
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const departure = document.getElementById('departure').value;
            const arrival = document.getElementById('arrival').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const adults = document.getElementById('adults').value;
            const children = document.getElementById('children').value;
            const ticketClass = document.getElementById('class').value;
            
            // Validate form
            if (!departure || !arrival || !date || !time) {
                alert('Kérjük, töltse ki az összes kötelező mezőt!');
                return;
            }
            
            if (departure === arrival) {
                alert('Az indulási és érkezési állomás nem lehet azonos!');
                return;
            }
            
            // Check if date is in the past
            const today = new Date();
            const selectedDate = new Date(date);
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                alert('Kérjük, jövőbeli dátumot adjon meg!');
                return;
            }
            
            // Calculate price (placeholder logic)
            let basePrice = 0;
            switch(departure + '→' + arrival) {
                case 'Budapest→Szeged':
                case 'Szeged→Budapest':
                    basePrice = 3500;
                    break;
                case 'Budapest→Debrecen':
                case 'Debrecen→Budapest':
                    basePrice = 4200;
                    break;
                case 'Budapest→Miskolc':
                case 'Miskolc→Budapest':
                    basePrice = 3800;
                    break;
                case 'Budapest→Pécs':
                case 'Pécs→Budapest':
                    basePrice = 4000;
                    break;
                default:
                    basePrice = 3000;
            }
            
            // Apply class multiplier
            const classMultiplier = ticketClass === 'first' ? 1.5 : 1;
            
            // Calculate total price
            const totalPrice = (basePrice * parseInt(adults) + basePrice * parseInt(children) * 0.5) * classMultiplier;
            
            // Create ticket object
            const ticket = {
                departure,
                arrival,
                date,
                time,
                adults,
                children,
                class: ticketClass,
                price: totalPrice,
                timestamp: new Date().toISOString()
            };
            
            // Store ticket in localStorage (temporary until database is added)
            let tickets = JSON.parse(localStorage.getItem('tickets')) || [];
            tickets.push(ticket);
            localStorage.setItem('tickets', JSON.stringify(tickets));
            
            // Show confirmation
            showTicketConfirmation(ticket);
        });
    }
    
    // Timetable filtering
    const filterBtn = document.getElementById('filterBtn');
    const routeFilter = document.getElementById('routeFilter');
    const timetable = document.getElementById('timetable');
    
    if (filterBtn && routeFilter && timetable) {
        filterBtn.addEventListener('click', function() {
            const filterText = routeFilter.value.toLowerCase();
            const rows = timetable.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const route = row.cells[0].textContent.toLowerCase();
                if (route.includes(filterText)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
        
        // Also filter on Enter key
        routeFilter.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterBtn.click();
            }
        });
    }
    
    // Show ticket confirmation
    function showTicketConfirmation(ticket) {
        const confirmationHTML = `
            <div class="ticket-confirmation">
                <h3>Jegyvásárlás sikeres!</h3>
                <p><strong>Útvonal:</strong> ${ticket.departure} → ${ticket.arrival}</p>
                <p><strong>Dátum:</strong> ${formatDate(ticket.date)}</p>
                <p><strong>Időpont:</strong> ${getTimeRange(ticket.time)}</p>
                <p><strong>Utasok:</strong> ${ticket.adults} felnőtt, ${ticket.children} gyerek</p>
                <p><strong>Osztály:</strong> ${ticket.class === 'first' ? 'Első osztály' : 'Másodosztály'}</p>
                <p><strong>Ár:</strong> ${ticket.price.toLocaleString('hu-HU')} Ft</p>
                <p>Köszönjük, hogy velünk utazik!</p>
                <button class="btn" onclick="this.parentElement.style.display='none'">Bezárás</button>
            </div>
        `;
        
        // Add confirmation to the page
        const formContainer = document.querySelector('.ticket-form .container');
        formContainer.insertAdjacentHTML('beforeend', confirmationHTML);
        
        // Add some basic styling
        const style = document.createElement('style');
        style.textContent = `
            .ticket-confirmation {
                background-color: #e8f5e9;
                border: 2px solid var(--secondary-color);
                border-radius: 8px;
                padding: 20px;
                margin-top: 30px;
                max-width: 500px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .ticket-confirmation h3 {
                color: var(--secondary-darker);
                margin-bottom: 15px;
            }
            
            .ticket-confirmation p {
                margin-bottom: 10px;
            }
            
            .ticket-confirmation .btn {
                background-color: var(--secondary-darker);
                margin-top: 15px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    }
    
    // Helper function to get time range text
    function getTimeRange(timeValue) {
        switch(timeValue) {
            case 'morning': return 'Reggel (6:00 - 12:00)';
            case 'afternoon': return 'Délután (12:00 - 18:00)';
            case 'evening': return 'Este (18:00 - 24:00)';
            default: return 'Ismeretlen';
        }
    }
});