// ============================================
// SMARTHOTEL ADMIN DASHBOARD - COMPLETE JS
// ============================================

// Data Storage using localStorage
let bookings = [];
let rooms = [];
let users = [];
let reviews = [];
let settings = {};

// Current editing IDs
let currentEditingBookingId = null;
let currentEditingRoomId = null;
let currentEditingUserId = null;
let currentViewingReviewId = null;
let currentRoomImage = null;

// Charts
let revenueChart = null;
let roomTypesChart = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadData();
    initializeUI();
    createParticles();
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }, 1200);
});

function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        document.getElementById('unauthorizedPage').classList.add('active');
        return;
    }
    document.getElementById('adminContainer').style.display = 'block';
    const adminName = localStorage.getItem('adminName') || 'Administrator';
    document.getElementById('userName').textContent = adminName;
    document.getElementById('adminNameDisplay').textContent = adminName;
    document.getElementById('userAvatar').textContent = adminName.substring(0, 2).toUpperCase();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminName');
        window.location.href = 'login.html';
    }
}

function initializeUI() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
    initializeCharts();
    updateDashboardStats();
    loadRecentBookings();
    loadAllBookings();
    loadRoomsTable();
    loadUsersTable();
    loadReviewsTable();
}

// ============================================
// DATA MANAGEMENT
// ============================================

function loadData() {
    bookings = JSON.parse(localStorage.getItem('bookings')) || generateSampleBookings();
    rooms    = JSON.parse(localStorage.getItem('rooms'))    || generateSampleRooms();
    users    = JSON.parse(localStorage.getItem('users'))    || generateSampleUsers();
    reviews  = JSON.parse(localStorage.getItem('reviews'))  || generateSampleReviews();
    settings = JSON.parse(localStorage.getItem('settings')) || {
        hotelName: 'SmartHotel',
        hotelPhone: '07 08 73 24 37',
        hotelEmail: 'info@smarthotel.com',
        hotelAddress: '123 Luxury Avenue, Paradise City, PC 12345',
        prices: { standard: 199, deluxe: 299, executive: 399, presidential: 599 }
    };
    saveAllData();
}

function saveAllData() {
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('rooms',    JSON.stringify(rooms));
    localStorage.setItem('users',    JSON.stringify(users));
    localStorage.setItem('reviews',  JSON.stringify(reviews));
    localStorage.setItem('settings', JSON.stringify(settings));
}

function generateSampleBookings() {
    return [
        { id:'BK001', guestName:'Youssef Bsibiss',    roomType:'Deluxe Suite',       checkin:'2024-02-15', checkout:'2024-02-18', amount:897,  status:'confirmed' },
        { id:'BK002', guestName:'Anass Bellagrid',     roomType:'Standard Room',      checkin:'2024-02-16', checkout:'2024-02-20', amount:796,  status:'confirmed' },
        { id:'BK003', guestName:'Zouhair El bahraoui', roomType:'Presidential Suite', checkin:'2024-02-17', checkout:'2024-02-22', amount:2995, status:'pending'   },
        { id:'BK004', guestName:'Sarah Davis',         roomType:'Executive Room',     checkin:'2024-02-14', checkout:'2024-02-17', amount:1197, status:'confirmed' },
        { id:'BK005', guestName:'David Wilson',        roomType:'Deluxe Suite',       checkin:'2024-02-20', checkout:'2024-02-23', amount:897,  status:'cancelled' }
    ];
}

function generateSampleRooms() {
    return [
        { id:'RM001', number:'101',  type:'Standard Room',      price:199, status:'available',   capacity:2, floor:1, image:'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400' },
        { id:'RM002', number:'102',  type:'Standard Room',      price:199, status:'occupied',    capacity:2, floor:1, image:'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400' },
        { id:'RM003', number:'201',  type:'Deluxe Suite',       price:299, status:'available',   capacity:3, floor:2, image:'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400' },
        { id:'RM004', number:'202',  type:'Deluxe Suite',       price:299, status:'maintenance', capacity:3, floor:2, image:'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400' },
        { id:'RM005', number:'301',  type:'Executive Room',     price:399, status:'available',   capacity:4, floor:3, image:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' },
        { id:'RM006', number:'PH01', type:'Presidential Suite', price:599, status:'available',   capacity:6, floor:5, image:'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400' }
    ];
}

function generateSampleUsers() {
    return [
        { id:'USR001', name:'Admin User',    email:'admin@smarthotel.com', role:'admin', status:'active', joined:'2023-01-15' },
        { id:'USR002', name:'John Smith',    email:'john@example.com',     role:'guest', status:'active', joined:'2024-01-20' },
        { id:'USR003', name:'Staff Member',  email:'staff@smarthotel.com', role:'staff', status:'active', joined:'2023-06-10' },
        { id:'USR004', name:'Emma Johnson',  email:'emma@example.com',     role:'guest', status:'active', joined:'2024-02-05' }
    ];
}

function generateSampleReviews() {
    return [
        { id:'REV001', guestName:'John Smith',    roomType:'Deluxe Suite',       rating:5, comment:'Absolutely wonderful experience! The room was immaculate and the staff was incredibly helpful.',date:'2024-02-10', status:'approved' },
        { id:'REV002', guestName:'Emma Johnson',  roomType:'Standard Room',      rating:4, comment:'Great value for money. Clean rooms and friendly service.',                                     date:'2024-02-12', status:'approved' },
        { id:'REV003', guestName:'Michael Brown', roomType:'Presidential Suite', rating:5, comment:'Luxury at its finest! Every detail was perfect.',                                             date:'2024-02-13', status:'pending'  },
        { id:'REV004', guestName:'Sarah Davis',   roomType:'Executive Room',     rating:4, comment:'Comfortable stay with excellent amenities.',                                                   date:'2024-02-14', status:'approved' }
    ];
}

// ============================================
// NAVIGATION
// ============================================

function showSection(sectionName) {
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionName) link.classList.add('active');
    });
    document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(sectionName + 'Section');
    if (target) target.classList.add('active');

    const titles = {
        dashboard:    'Dashboard <em>Overview</em>',
        rooms:        'Room <em>Management</em>',
        reservations: 'All <em>Reservations</em>',
        users:        'User <em>Management</em>',
        reviews:      'Customer <em>Reviews</em>',
        settings:     'System <em>Settings</em>'
    };
    document.getElementById('pageTitle').innerHTML = titles[sectionName] || 'Dashboard';

    if (window.innerWidth <= 968) {
        document.getElementById('sidebar').classList.remove('mobile-visible');
    }
}

function toggleMobileMenu() {
    document.getElementById('sidebar').classList.toggle('mobile-visible');
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    if (modalId === 'addBookingModal') resetBookingForm();
    else if (modalId === 'addRoomModal') resetRoomForm();
    else if (modalId === 'addUserModal') resetUserForm();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) e.target.classList.remove('active');
});

// ============================================
// BOOKING MANAGEMENT
// ============================================

function resetBookingForm() {
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingId').value = '';
    document.getElementById('bookingModalTitle').textContent = 'Add New Booking';
    currentEditingBookingId = null;
}

function editBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    currentEditingBookingId = id;
    document.getElementById('bookingId').value          = id;
    document.getElementById('bookingGuestName').value   = booking.guestName;
    document.getElementById('bookingRoomType').value    = booking.roomType;
    document.getElementById('bookingCheckin').value     = booking.checkin;
    document.getElementById('bookingCheckout').value    = booking.checkout;
    document.getElementById('bookingAmount').value      = booking.amount;
    document.getElementById('bookingStatus').value      = booking.status;
    document.getElementById('bookingModalTitle').textContent = 'Edit Booking';
    openModal('addBookingModal');
}

function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    bookings = bookings.filter(b => b.id !== id);
    saveAllData();
    loadAllBookings(); loadRecentBookings(); updateDashboardStats();
    showToast('Booking deleted successfully', 'success');
}

function saveBooking(event) {
    event.preventDefault();
    const bookingData = {
        id:         document.getElementById('bookingId').value || generateId('BK'),
        guestName:  document.getElementById('bookingGuestName').value,
        roomType:   document.getElementById('bookingRoomType').value,
        checkin:    document.getElementById('bookingCheckin').value,
        checkout:   document.getElementById('bookingCheckout').value,
        amount:     parseFloat(document.getElementById('bookingAmount').value),
        status:     document.getElementById('bookingStatus').value
    };
    if (currentEditingBookingId) {
        const idx = bookings.findIndex(b => b.id === currentEditingBookingId);
        bookings[idx] = bookingData;
    } else {
        bookings.unshift(bookingData);
    }
    saveAllData(); closeModal('addBookingModal');
    loadAllBookings(); loadRecentBookings(); updateDashboardStats();
    showToast('Booking saved successfully', 'success');
}

function loadRecentBookings() {
    const tbody = document.getElementById('recentBookingsTable');
    tbody.innerHTML = '';
    bookings.slice(0, 5).forEach(booking => {
        tbody.innerHTML += `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.guestName}</td>
                <td>${booking.roomType}</td>
                <td>${formatDate(booking.checkin)}</td>
                <td>${formatDate(booking.checkout)}</td>
                <td>$${booking.amount.toLocaleString()}</td>
                <td><span class="status-badge status-${booking.status}">${capitalize(booking.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editBooking('${booking.id}')">Edit</button>
                        <button class="btn-action btn-delete" onclick="deleteBooking('${booking.id}')">Delete</button>
                    </div>
                </td>
            </tr>`;
    });
}

function loadAllBookings() {
    const tbody = document.getElementById('allBookingsTable');
    tbody.innerHTML = '';
    bookings.forEach(booking => {
        tbody.innerHTML += `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.guestName}</td>
                <td>${booking.roomType}</td>
                <td>${formatDate(booking.checkin)}</td>
                <td>${formatDate(booking.checkout)}</td>
                <td>$${booking.amount.toLocaleString()}</td>
                <td><span class="status-badge status-${booking.status}">${capitalize(booking.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editBooking('${booking.id}')">Edit</button>
                        <button class="btn-action btn-delete" onclick="deleteBooking('${booking.id}')">Delete</button>
                    </div>
                </td>
            </tr>`;
    });
}

// ============================================
// ROOM MANAGEMENT
// ============================================

function resetRoomForm() {
    document.getElementById('roomForm').reset();
    document.getElementById('roomId').value = '';
    document.getElementById('roomModalTitle').textContent = 'Add New Room';
    document.getElementById('roomImagePreview').style.display = 'none';
    currentEditingRoomId = null;
    currentRoomImage = null;
}

function previewRoomImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentRoomImage = e.target.result;
            const preview = document.getElementById('roomImagePreview');
            preview.src = currentRoomImage;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function editRoom(id) {
    const room = rooms.find(r => r.id === id);
    if (!room) return;
    currentEditingRoomId = id;
    document.getElementById('roomId').value       = id;
    document.getElementById('roomNumber').value   = room.number;
    document.getElementById('roomType').value     = room.type;
    document.getElementById('roomPrice').value    = room.price;
    document.getElementById('roomStatus').value   = room.status;
    document.getElementById('roomCapacity').value = room.capacity;
    document.getElementById('roomFloor').value    = room.floor;
    document.getElementById('roomModalTitle').textContent = 'Edit Room';
    if (room.image) {
        currentRoomImage = room.image;
        const preview = document.getElementById('roomImagePreview');
        preview.src = room.image;
        preview.style.display = 'block';
    }
    openModal('addRoomModal');
}

function deleteRoom(id) {
    if (!confirm('Are you sure you want to delete this room?')) return;
    rooms = rooms.filter(r => r.id !== id);
    saveAllData(); loadRoomsTable(); updateDashboardStats();
    showToast('Room deleted successfully', 'success');
}

function saveRoom(event) {
    event.preventDefault();
    const roomData = {
        id:       document.getElementById('roomId').value || generateId('RM'),
        number:   document.getElementById('roomNumber').value,
        type:     document.getElementById('roomType').value,
        price:    parseFloat(document.getElementById('roomPrice').value),
        status:   document.getElementById('roomStatus').value,
        capacity: parseInt(document.getElementById('roomCapacity').value),
        floor:    parseInt(document.getElementById('roomFloor').value),
        image:    currentRoomImage || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400'
    };
    if (currentEditingRoomId) {
        const idx = rooms.findIndex(r => r.id === currentEditingRoomId);
        rooms[idx] = roomData;
    } else {
        rooms.push(roomData);
    }
    saveAllData(); closeModal('addRoomModal');
    loadRoomsTable(); updateDashboardStats(); updateRoomTypesChart();
    showToast('Room saved successfully', 'success');
}

function loadRoomsTable() {
    const tbody = document.getElementById('roomsTable');
    tbody.innerHTML = '';
    rooms.forEach(room => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${room.image}" alt="Room ${room.number}" class="room-image-preview"></td>
                <td>${room.number}</td>
                <td>${room.type}</td>
                <td>$${room.price}</td>
                <td><span class="status-badge status-${room.status}">${capitalize(room.status)}</span></td>
                <td>${room.capacity} guests</td>
                <td>Floor ${room.floor}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editRoom('${room.id}')">Edit</button>
                        <button class="btn-action btn-delete" onclick="deleteRoom('${room.id}')">Delete</button>
                    </div>
                </td>
            </tr>`;
    });
}

// ============================================
// USER MANAGEMENT
// ============================================

function resetUserForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModalTitle').textContent = 'Add New User';
    currentEditingUserId = null;
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    currentEditingUserId = id;
    document.getElementById('userId').value       = id;
    document.getElementById('userFullName').value = user.name;
    document.getElementById('userEmail').value    = user.email;
    document.getElementById('userRole').value     = user.role;
    document.getElementById('userStatus').value   = user.status;
    document.getElementById('userModalTitle').textContent = 'Edit User';
    openModal('addUserModal');
}

function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    users = users.filter(u => u.id !== id);
    saveAllData(); loadUsersTable();
    showToast('User deleted successfully', 'success');
}

function saveUser(event) {
    event.preventDefault();
    const userData = {
        id:     document.getElementById('userId').value || generateId('USR'),
        name:   document.getElementById('userFullName').value,
        email:  document.getElementById('userEmail').value,
        role:   document.getElementById('userRole').value,
        status: document.getElementById('userStatus').value,
        joined: currentEditingUserId
            ? users.find(u => u.id === currentEditingUserId).joined
            : new Date().toISOString().split('T')[0]
    };
    if (currentEditingUserId) {
        const idx = users.findIndex(u => u.id === currentEditingUserId);
        users[idx] = userData;
    } else {
        users.push(userData);
    }
    saveAllData(); closeModal('addUserModal'); loadUsersTable();
    showToast('User saved successfully', 'success');
}

function loadUsersTable() {
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = '';
    users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status-badge status-${user.role === 'admin' ? 'confirmed' : 'pending'}">${capitalize(user.role)}</span></td>
                <td><span class="status-badge status-${user.status}">${capitalize(user.status)}</span></td>
                <td>${formatDate(user.joined)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editUser('${user.id}')">Edit</button>
                        <button class="btn-action btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                    </div>
                </td>
            </tr>`;
    });
}

// ============================================
// REVIEW MANAGEMENT
// ============================================

function viewReview(id) {
    const review = reviews.find(r => r.id === id);
    if (!review) return;
    currentViewingReviewId = id;
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    document.getElementById('reviewDetails').innerHTML = `
        <div class="form-group">
            <label>Guest Name</label>
            <p style="color:var(--cream);padding:.5rem 0;">${review.guestName}</p>
        </div>
        <div class="form-group">
            <label>Room Type</label>
            <p style="color:var(--cream);padding:.5rem 0;">${review.roomType}</p>
        </div>
        <div class="form-group">
            <label>Rating</label>
            <p class="rating-stars" style="font-size:1.4rem;padding:.5rem 0;">${stars}</p>
        </div>
        <div class="form-group">
            <label>Review</label>
            <p style="color:rgba(245,240,232,.7);padding:.5rem 0;line-height:1.7;">${review.comment}</p>
        </div>
        <div class="form-group">
            <label>Date</label>
            <p style="color:var(--cream);padding:.5rem 0;">${formatDate(review.date)}</p>
        </div>
        <div class="form-group">
            <label>Status</label>
            <p style="padding:.5rem 0;"><span class="status-badge status-${review.status}">${capitalize(review.status)}</span></p>
        </div>`;
    openModal('viewReviewModal');
}

function approveReview() {
    if (currentViewingReviewId) {
        const review = reviews.find(r => r.id === currentViewingReviewId);
        if (review) {
            review.status = 'approved';
            saveAllData(); loadReviewsTable(); updateDashboardStats();
            showToast('Review approved successfully', 'success');
            closeModal('viewReviewModal');
        }
    }
}

function deleteReview(id) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    reviews = reviews.filter(r => r.id !== id);
    saveAllData(); loadReviewsTable(); updateDashboardStats();
    showToast('Review deleted successfully', 'success');
}

function loadReviewsTable() {
    const tbody = document.getElementById('reviewsTable');
    tbody.innerHTML = '';
    reviews.forEach(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const truncated = review.comment.length > 50 ? review.comment.substring(0, 50) + '…' : review.comment;
        tbody.innerHTML += `
            <tr>
                <td>${review.id}</td>
                <td>${review.guestName}</td>
                <td>${review.roomType}</td>
                <td><span class="rating-stars">${stars}</span></td>
                <td>${truncated}</td>
                <td>${formatDate(review.date)}</td>
                <td><span class="status-badge status-${review.status}">${capitalize(review.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewReview('${review.id}')">View</button>
                        <button class="btn-action btn-delete" onclick="deleteReview('${review.id}')">Delete</button>
                    </div>
                </td>
            </tr>`;
    });
}

// ============================================
// SETTINGS
// ============================================

function saveHotelInfo(event) {
    event.preventDefault();
    settings.hotelName    = document.getElementById('hotelName').value;
    settings.hotelPhone   = document.getElementById('hotelPhone').value;
    settings.hotelEmail   = document.getElementById('hotelEmail').value;
    settings.hotelAddress = document.getElementById('hotelAddress').value;
    saveAllData();
    showToast('Hotel information updated successfully', 'success');
}

function savePricing(event) {
    event.preventDefault();
    settings.prices = {
        standard:     parseInt(document.getElementById('priceStandard').value),
        deluxe:       parseInt(document.getElementById('priceDeluxe').value),
        executive:    parseInt(document.getElementById('priceExecutive').value),
        presidential: parseInt(document.getElementById('pricePresidential').value)
    };
    saveAllData();
    showToast('Pricing configuration updated successfully', 'success');
}

function saveNotifications(event) {
    event.preventDefault();
    settings.notifications = {
        email:  document.getElementById('notifEmail').checked,
        sms:    document.getElementById('notifSMS').checked,
        daily:  document.getElementById('notifDaily').checked,
        weekly: document.getElementById('notifWeekly').checked
    };
    saveAllData();
    showToast('Notification preferences saved successfully', 'success');
}

// ============================================
// DASHBOARD STATS
// ============================================

function updateDashboardStats() {
    document.getElementById('totalBookings').textContent = bookings.length;
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;
    document.getElementById('occupancyRate').textContent = occupancyRate + '%';
    const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
    document.getElementById('revenue').textContent = '$' + totalRevenue.toLocaleString();
    const pendingReviews = reviews.filter(r => r.status === 'pending').length;
    document.getElementById('pendingReviews').textContent = pendingReviews;
}

// ============================================
// CHARTS  (colors updated to match site theme)
// ============================================

const CHART_GOLD   = '#c8a96e';
const CHART_GOLD2  = '#e2c07a';
const CHART_GOLD3  = '#a8895a';
const CHART_GOLD4  = '#7a6340';
const CHART_BG     = 'rgba(200,169,110,0.08)';
const CHART_GRID   = 'rgba(200,169,110,0.08)';
const CHART_TEXT   = 'rgba(245,240,232,0.4)';
const CHART_TOOLTIP_BG = 'rgba(13,12,10,0.95)';

function initializeCharts() {
    initializeRevenueChart();
    initializeRoomTypesChart();
}

function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data   = [4500, 5200, 4800, 6100, 7200, 8500, 7800];
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Revenue',
                data,
                borderColor: CHART_GOLD,
                backgroundColor: CHART_BG,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: CHART_GOLD,
                pointBorderColor: '#0d0c0a',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: CHART_TOOLTIP_BG,
                    padding: 12,
                    titleColor: CHART_GOLD,
                    bodyColor: 'rgba(245,240,232,0.8)',
                    borderColor: 'rgba(200,169,110,0.3)',
                    borderWidth: 1,
                    callbacks: { label: ctx => '$' + ctx.parsed.y.toLocaleString() }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: CHART_GRID, drawBorder: false },
                    ticks: { color: CHART_TEXT, callback: v => '$' + v }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: CHART_TEXT }
                }
            }
        }
    });
}

function updateRevenueChart(period, event) {
    event.target.parentElement.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    let labels, data;
    if (period === 'week') {
        labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        data   = [4500, 5200, 4800, 6100, 7200, 8500, 7800];
    } else if (period === 'month') {
        labels = ['Week 1','Week 2','Week 3','Week 4'];
        data   = [25000, 28000, 32000, 30000];
    } else {
        labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        data   = [95000,102000,115000,108000,125000,135000,142000,138000,145000,152000,148000,160000];
    }
    revenueChart.data.labels = labels;
    revenueChart.data.datasets[0].data = data;
    revenueChart.update();
}

function initializeRoomTypesChart() {
    const ctx = document.getElementById('roomTypesChart');
    if (!ctx) return;
    updateRoomTypesChart();
}

function updateRoomTypesChart() {
    const ctx = document.getElementById('roomTypesChart');
    if (!ctx) return;
    const roomTypes = {};
    rooms.forEach(r => { roomTypes[r.type] = (roomTypes[r.type] || 0) + 1; });
    const labels = Object.keys(roomTypes);
    const data   = Object.values(roomTypes);
    const colors = [CHART_GOLD, CHART_GOLD2, CHART_GOLD3, CHART_GOLD4];
    if (roomTypesChart) roomTypesChart.destroy();
    roomTypesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                borderColor: '#0d0c0a',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: CHART_TEXT,
                        padding: 14,
                        font: { size: 11, family: 'DM Sans' },
                        boxWidth: 12
                    }
                },
                tooltip: {
                    backgroundColor: CHART_TOOLTIP_BG,
                    padding: 12,
                    titleColor: CHART_GOLD,
                    bodyColor: 'rgba(245,240,232,0.8)',
                    borderColor: 'rgba(200,169,110,0.3)',
                    borderWidth: 1
                }
            }
        }
    });
}

// ============================================
// UTILITY
// ============================================

function generateId(prefix) {
    return prefix + Date.now().toString().slice(-6);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showToast(message, type = 'default') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    toast.className = 'toast show ' + type;
    toastMsg.textContent = message;
    setTimeout(() => toast.classList.remove('show'), 3500);
}

function exportData() {
    const data = { bookings, rooms, users, reviews, settings, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smarthotel-data-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    showToast('Data exported successfully', 'success');
}

function createParticles() {
    const container = document.getElementById('bgParticles');
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const sz = 1 + Math.random() * 3;
        p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;animation-delay:${Math.random()*25}s;animation-duration:${15+Math.random()*12}s;`;
        container.appendChild(p);
    }
}

// Auto-login for demo
if (!localStorage.getItem('adminLoggedIn')) {
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('adminName', 'Administrator');
}