// Booking functionality for SmartHotel

document.addEventListener('DOMContentLoaded', () => {
    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;
    
    // Update checkout minimum when checkin changes
    if (checkinInput) {
        checkinInput.addEventListener('change', function() {
            if (checkoutInput) {
                checkoutInput.min = this.value;
                if (checkoutInput.value && checkoutInput.value < this.value) {
                    checkoutInput.value = '';
                }
            }
            updateSummary();
        });
    }
    
    // Update summary when any field changes
    const formInputs = document.querySelectorAll('#bookingForm input, #bookingForm select');
    formInputs.forEach(input => {
        input.addEventListener('change', updateSummary);
    });
    
    // Handle form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
});

function updateSummary() {
    const roomType = document.getElementById('roomType');
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    const guests = document.getElementById('guests');
    
    if (!roomType || !checkin || !checkout || !guests) return;
    
    // Update room info
    const selectedOption = roomType.options[roomType.selectedIndex];
    const roomPrice = parseInt(selectedOption.dataset.price) || 0;
    
    document.getElementById('summaryRoom').textContent = 
        selectedOption.text || '-';
    document.getElementById('summaryCheckin').textContent = 
        checkin.value ? formatDate(checkin.value) : '-';
    document.getElementById('summaryCheckout').textContent = 
        checkout.value ? formatDate(checkout.value) : '-';
    document.getElementById('summaryGuests').textContent = 
        guests.value ? `${guests.value} Guest${guests.value > 1 ? 's' : ''}` : '-';
    
    // Calculate nights
    let nights = 0;
    if (checkin.value && checkout.value) {
        nights = calculateNights(checkin.value, checkout.value);
    }
    document.getElementById('summaryNights').textContent = nights;
    
    // Calculate room total
    const roomTotal = roomPrice * nights;
    document.getElementById('summaryRoomTotal').textContent = formatPrice(roomTotal);
    
    // Calculate services total
    let servicesTotal = 0;
    const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
    serviceCheckboxes.forEach(checkbox => {
        const price = parseInt(checkbox.dataset.price) || 0;
        if (checkbox.value === 'breakfast' || checkbox.value === 'parking') {
            servicesTotal += price * nights;
        } else {
            servicesTotal += price;
        }
    });
    document.getElementById('summaryServices').textContent = formatPrice(servicesTotal);
    
    // Calculate tax
    const subtotal = roomTotal + servicesTotal;
    const tax = subtotal * 0.10;
    document.getElementById('summaryTax').textContent = formatPrice(tax);
    
    // Calculate total
    const total = subtotal + tax;
    document.getElementById('summaryTotal').textContent = formatPrice(total);
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Validate form
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const roomType = document.getElementById('roomType').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guests = document.getElementById('guests').value;
    
    if (!firstName || !lastName || !email || !phone || !roomType || !checkin || !checkout) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    if (new Date(checkout) <= new Date(checkin)) {
        alert('Check-out date must be after check-in date');
        return;
    }
    
    // Collect selected services
    const services = [];
    document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
        services.push(cb.value);
    });
    
    // Create booking object
    const booking = {
        id: 'BK' + Date.now(),
        firstName,
        lastName,
        email,
        phone,
        roomType,
        checkin,
        checkout,
        guests,
        services,
        specialRequests: document.getElementById('specialRequests').value,
        createdAt: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save booking to localStorage (in real app, send to backend)
    const bookings = getFromLocalStorage('bookings') || [];
    bookings.push(booking);
    saveToLocalStorage('bookings', bookings);
    
    // Send to backend API
    fetch('backend/api/book-room.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Booking confirmed! Confirmation email sent to ' + email);
            window.location.href = 'my-bookings.html';
        } else {
            alert('Booking failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // For demo purposes, still redirect
        alert('Booking submitted! (Demo mode)');
        window.location.href = 'my-bookings.html';
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function calculateNights(checkin, checkout) {
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}