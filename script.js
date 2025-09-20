// Sample data (in a real application, this would come from your Python backend)
const travelOptions = {
    "Train": [
        { id: 101, from: 'Delhi', to: 'Mumbai', price: 600, duration: '5h', status: 'Available' },
        { id: 102, from: 'Mumbai', to: 'Chennai', price: 800, duration: '7h', status: 'Available' },
        { id: 103, from: 'Delhi', to: 'Kolkata', price: 1500, duration: '10h', status: 'Available' }
    ],
    "Bus": [
        { id: 201, from: 'Delhi', to: 'Jaipur', price: 400, duration: '6h', status: 'Available' },
        { id: 202, from: 'Mumbai', to: 'Pune', price: 600, duration: '8h', status: 'Available' },
        { id: 203, from: 'Bangalore', to: 'Chennai', price: 1000, duration: '12h', status: 'Available' }
    ],
    "Flight": [
        { id: 301, from: 'Delhi', to: 'Mumbai', price: 3000, duration: '1h', status: 'Available' },
        { id: 302, from: 'Mumbai', to: 'Chennai', price: 4500, duration: '2h', status: 'Available' },
        { id: 303, from: 'Delhi', to: 'Bangalore', price: 7000, duration: '3h', status: 'Available' }
    ]
};

// Get all unique cities
const allCities = [...new Set(
    Object.values(travelOptions).flatMap(options => 
        options.flatMap(option => [option.from, option.to])
    )
)].sort();

let bookingRecords = [];
let cancelledBookings = [];

// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const categoryTabs = document.querySelectorAll('.category-tab');
const travelOptionsContainer = document.getElementById('travel-options-container');
const bookingForm = document.getElementById('booking-form');
const cancelForm = document.getElementById('cancel-form');
const travelIdSelect = document.getElementById('travel-id');
const travelTypeSelect = document.getElementById('travel-type');
const sourceSelect = document.getElementById('source');
const destinationSelect = document.getElementById('destination');
const categorySpecificFields = document.getElementById('category-specific-fields');
const showCancelledCheckbox = document.getElementById('show-cancelled');

// Navigation functionality
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetSection = button.dataset.section;
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetSection) {
                section.classList.add('active');
            }
        });
    });
});

// Category tabs functionality
categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.dataset.category;
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        displayTravelOptions(category);
    });
});

// Populate cities in source and destination selects
function populateCities() {
    allCities.forEach(city => {
        const sourceOption = document.createElement('option');
        sourceOption.value = city;
        sourceOption.textContent = city;
        sourceSelect.appendChild(sourceOption);

        const destOption = document.createElement('option');
        destOption.value = city;
        destOption.textContent = city;
        destinationSelect.appendChild(destOption);
    });
}

// Handle travel type selection
travelTypeSelect.addEventListener('change', () => {
    const selectedType = travelTypeSelect.value;
    if (!selectedType) return;
    
    sourceSelect.innerHTML = '<option value="">Select source</option>';
    destinationSelect.innerHTML = '<option value="">Select destination</option>';
    
    const typeCities = [...new Set(
        travelOptions[selectedType].flatMap(option => [option.from, option.to])
    )].sort();
    
    typeCities.forEach(city => {
        const sourceOption = document.createElement('option');
        sourceOption.value = city;
        sourceOption.textContent = city;
        sourceSelect.appendChild(sourceOption);

        const destOption = document.createElement('option');
        destOption.value = city;
        destOption.textContent = city;
        destinationSelect.appendChild(destOption);
    });

    travelIdSelect.innerHTML = '<option value="">Select an option</option>';
    categorySpecificFields.innerHTML = '';
});

// Handle source selection
sourceSelect.addEventListener('change', () => {
    const selectedType = travelTypeSelect.value;
    const selectedSource = sourceSelect.value;
    if (!selectedType || !selectedSource) return;
    
    destinationSelect.innerHTML = '<option value="">Select destination</option>';
    const availableDestinations = [...new Set(
        travelOptions[selectedType]
            .filter(option => option.from === selectedSource)
            .map(option => option.to)
    )].sort();
    
    availableDestinations.forEach(dest => {
        const option = document.createElement('option');
        option.value = dest;
        option.textContent = dest;
        destinationSelect.appendChild(option);
    });
    
    updateTravelOptions();
});

// Handle destination selection
destinationSelect.addEventListener('change', updateTravelOptions);

// Update available travel options based on selections
function updateTravelOptions() {
    const selectedType = travelTypeSelect.value;
    const selectedSource = sourceSelect.value;
    const selectedDest = destinationSelect.value;
    
    if (!selectedType || !selectedSource || !selectedDest) return;
    
    travelIdSelect.innerHTML = '<option value="">Select an option</option>';
    
    const availableOptions = travelOptions[selectedType].filter(option => 
        option.from === selectedSource && 
        option.to === selectedDest && 
        option.status === 'Available'
    );
    
    availableOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.id;
        optionElement.textContent = `${option.id} - ${option.duration} (₹${option.price})`;
        travelIdSelect.appendChild(optionElement);
    });

    updateCategorySpecificFields(selectedType);
}

// Display travel options
function displayTravelOptions(category = 'all') {
    travelOptionsContainer.innerHTML = '';
    
    Object.entries(travelOptions).forEach(([type, options]) => {
        if (category === 'all' || category === type.toLowerCase()) {
            options.forEach(option => {
                const card = document.createElement('div');
                card.className = 'travel-option-card';
                card.innerHTML = `
                    <h3>${type} ${option.id}</h3>
                    <div class="route-info">
                        <span class="from">${option.from}</span>
                        <i class="fas fa-arrow-right"></i>
                        <span class="to">${option.to}</span>
                    </div>
                    <p><strong>Duration:</strong> ${option.duration}</p>
                    <p><strong>Price:</strong> ₹${option.price}</p>
                    <p><strong>Status:</strong> <span class="status ${option.status}">${option.status}</span></p>
                `;
                travelOptionsContainer.appendChild(card);
            });
        }
    });
}

// Handle travel ID selection
travelIdSelect.addEventListener('change', () => {
    const selectedId = parseInt(travelIdSelect.value);
    if (!selectedId) return;
    
    const selectedType = travelTypeSelect.value;
    const selectedOption = travelOptions[selectedType].find(opt => opt.id === selectedId);
    
    if (selectedOption) {
        updateCategorySpecificFields(selectedType);
    }
});

// Update category-specific fields
function updateCategorySpecificFields(type) {
    categorySpecificFields.innerHTML = '';
    
    if (type === 'Flight') {
        categorySpecificFields.innerHTML = `
            <div class="form-group">
                <label for="passport">Passport Number</label>
                <input type="text" id="passport" required>
            </div>
            <div class="form-group">
                <label for="seat-class">Seat Class</label>
                <select id="seat-class" required>
                    <option value="">Select class</option>
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                </select>
            </div>
            <div class="form-group">
                <label for="luggage">Extra Luggage</label>
                <select id="luggage" required>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>
            </div>
        `;
    } else if (type === 'Train') {
        categorySpecificFields.innerHTML = `
            <div class="form-group">
                <label for="seat-class">Seat Class</label>
                <select id="seat-class" required>
                    <option value="">Select class</option>
                    <option value="Sleeper">Sleeper</option>
                    <option value="3AC">3AC</option>
                    <option value="2AC">2AC</option>
                    <option value="1AC">1AC</option>
                </select>
            </div>
        `;
    }
}

// Handle booking form submission
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const travelDate = new Date(document.getElementById('travel-date').value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (travelDate < today) {
        alert('You cannot book tickets for past dates!');
        return;
    }
    
    const booking = {
        travelId: parseInt(travelIdSelect.value),
        name: document.getElementById('customer-name').value,
        age: parseInt(document.getElementById('customer-age').value),
        from: sourceSelect.value,
        to: destinationSelect.value,
        type: travelTypeSelect.value,
        date: document.getElementById('travel-date').value,
        status: 'Booked'
    };
    
    const selectedType = travelTypeSelect.value;
    const selectedOption = travelOptions[selectedType].find(opt => opt.id === booking.travelId);
    booking.price = selectedOption.price;
    
    if (selectedType === 'Flight') {
        booking.passport = document.getElementById('passport').value;
        booking.seatClass = document.getElementById('seat-class').value;
        booking.extraLuggage = document.getElementById('luggage').value;
    } else if (selectedType === 'Train') {
        booking.seatClass = document.getElementById('seat-class').value;
    }
    
    bookingRecords.push(booking);
    selectedOption.status = 'Booked';
    
    alert('Booking successful!');
    bookingForm.reset();
    displayTravelOptions();
    displayBookingRecords();
});

// Handle cancel form submission
cancelForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const travelId = parseInt(document.getElementById('cancel-travel-id').value);
    const bookingIndex = bookingRecords.findIndex(record => record.travelId === travelId);
    
    if (bookingIndex === -1) {
        alert('Booking not found!');
        return;
    }
    
    const cancelledBooking = bookingRecords[bookingIndex];
    cancelledBooking.status = 'Cancelled';
    cancelledBookings.push(cancelledBooking);
    bookingRecords.splice(bookingIndex, 1);
    
    const selectedType = cancelledBooking.type;
    const selectedOption = travelOptions[selectedType].find(opt => opt.id === travelId);
    if (selectedOption) {
        selectedOption.status = 'Available';
    }
    
    alert('Ticket cancelled successfully!');
    cancelForm.reset();
    displayTravelOptions();
    displayBookingRecords();
});

// Display booking records
function displayBookingRecords() {
    const tableBody = document.querySelector('#booking-records-table tbody');
    tableBody.innerHTML = '';
    
    const records = showCancelledCheckbox.checked ? 
        [...bookingRecords, ...cancelledBookings] : 
        bookingRecords;
    
    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.travelId}</td>
            <td>${record.name}</td>
            <td>${record.age}</td>
            <td>${record.from}</td>
            <td>${record.to}</td>
            <td>${record.type}</td>
            <td>₹${record.price}</td>
            <td>${record.date}</td>
            <td>${record.status}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Handle show cancelled checkbox change
showCancelledCheckbox.addEventListener('change', displayBookingRecords);

// Initialize the application
function init() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('travel-date').min = today;
    
    populateCities();
    displayTravelOptions();
    displayBookingRecords();
}

init(); 