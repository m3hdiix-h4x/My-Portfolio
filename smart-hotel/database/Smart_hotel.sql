-- SmartHotel Database Schema
-- Create Database
CREATE DATABASE IF NOT EXISTS smart_hotel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_hotel;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('standard', 'executive', 'deluxe', 'suite') NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    capacity INT DEFAULT 2,
    room_number VARCHAR(10) UNIQUE,
    floor INT,
    amenities JSON,
    status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
    images JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_price (price_per_night)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_guests INT DEFAULT 1,
    special_requests TEXT,
    services JSON,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_user_id (user_id),
    INDEX idx_room_id (room_id),
    INDEX idx_dates (check_in_date, check_out_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    reservation_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    comment TEXT,
    response TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_room_id (room_id),
    INDEX idx_rating (rating),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category ENUM('dining', 'spa', 'transport', 'business', 'other') DEFAULT 'other',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chatbot Messages Table
CREATE TABLE IF NOT EXISTS chatbot_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id VARCHAR(100),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    intent VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data

-- Sample Admin User (password: admin123)
INSERT INTO users (first_name, last_name, email, phone, password_hash, role) VALUES
('Admin', 'User', 'admin@smarthotel.com', '+1234567890', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Sample Client Users (password: password123)
INSERT INTO users (first_name, last_name, email, phone, password_hash, address, city, state, zip_code) VALUES
('John', 'Doe', 'john.doe@email.com', '+1555123456', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123 Main St', 'New York', 'NY', '10001'),
('Sarah', 'Smith', 'sarah.smith@email.com', '+1555234567', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '456 Oak Ave', 'Los Angeles', 'CA', '90001');

-- Sample Rooms
INSERT INTO rooms (name, type, description, price_per_night, capacity, room_number, floor, amenities, images) VALUES
('Standard Room', 'standard', 'Comfortable and modern room with all essential amenities', 129.00, 2, '101', 1, '["Double Bed", "City View", "Free WiFi", "TV", "Mini Fridge"]', '["room1.jpg"]'),
('Standard Room', 'standard', 'Comfortable and modern room with all essential amenities', 129.00, 2, '102', 1, '["Double Bed", "City View", "Free WiFi", "TV", "Mini Fridge"]', '["room1.jpg"]'),
('Executive Room', 'executive', 'Perfect for business travelers with dedicated workspace', 199.00, 2, '201', 2, '["Queen Bed", "Work Desk", "Mini Bar", "WiFi", "Coffee Maker"]', '["room2.jpg"]'),
('Executive Room', 'executive', 'Perfect for business travelers with dedicated workspace', 199.00, 2, '202', 2, '["Queen Bed", "Work Desk", "Mini Bar", "WiFi", "Coffee Maker"]', '["room2.jpg"]'),
('Deluxe Suite', 'deluxe', 'Spacious luxury suite with panoramic views', 299.00, 3, '301', 3, '["King Bed", "Ocean View", "Smart TV", "Mini Bar", "Jacuzzi"]', '["room3.jpg"]'),
('Deluxe Suite', 'deluxe', 'Spacious luxury suite with panoramic views', 299.00, 3, '302', 3, '["King Bed", "Ocean View", "Smart TV", "Mini Bar", "Jacuzzi"]', '["room3.jpg"]'),
('Presidential Suite', 'suite', 'Ultimate luxury experience with premium amenities', 499.00, 4, '401', 4, '["2 King Beds", "Living Room", "Jacuzzi", "Balcony", "Kitchen"]', '["room4.jpg"]');

-- Sample Services
INSERT INTO services (name, description, price, category) VALUES
('Airport Transfer', 'Luxury car service to/from airport', 50.00, 'transport'),
('Daily Breakfast', 'Full breakfast buffet', 25.00, 'dining'),
('Spa Package', 'Relaxing spa treatment package', 100.00, 'spa'),
('Valet Parking', 'Secure valet parking service', 20.00, 'transport'),
('Room Service', '24/7 room service delivery', 0.00, 'dining'),
('Laundry Service', 'Professional laundry and dry cleaning', 30.00, 'other');

-- Sample Reservations
INSERT INTO reservations (booking_id, user_id, room_id, check_in_date, check_out_date, num_guests, total_amount, status, payment_status) VALUES
('BK12345', 2, 5, '2026-01-25', '2026-01-28', 2, 987.00, 'confirmed', 'paid'),
('BK12340', 2, 3, '2026-01-18', '2026-01-20', 1, 438.00, 'checked-in', 'paid');

-- Sample Reviews
INSERT INTO reviews (user_id, room_id, reservation_id, rating, title, comment, status) VALUES
(2, 5, 1, 5, 'Amazing experience!', 'The room was spotless and the smart features made everything so convenient.', 'approved'),
(3, 3, NULL, 5, 'Absolutely loved it!', 'The ocean view and the staff was incredibly helpful. Will definitely come back!', 'approved');