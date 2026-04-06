<?php
// Include database configuration
require_once '../backend/config/database.php';

// Start session
session_start();

// Check if user is logged in and is admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: ../login.html");
    exit();
}

// Get admin info
$adminName = isset($_SESSION['userName']) ? $_SESSION['userName'] : 'Admin';
$adminEmail = isset($_SESSION['userEmail']) ? $_SESSION['userEmail'] : '';

// Success/Error messages
$successMessage = '';
$errorMessage = '';

// Handle Add Room
if (isset($_POST['add_room'])) {
    try {
        $name = trim($_POST['name']);
        $type = trim($_POST['type']);
        $description = trim($_POST['description']);
        $price = floatval($_POST['price']);
        $capacity = intval($_POST['capacity']);
        $view_type = trim($_POST['view_type']);
        $rating = floatval($_POST['rating']);
        $image = trim($_POST['image']);
        $badge = trim($_POST['badge']);
        $available = isset($_POST['available']) ? 1 : 0;
        
        // Validate inputs
        if (empty($name) || empty($description) || $price <= 0) {
            throw new Exception("Please fill all required fields with valid data.");
        }
        
        $stmt = $conn->prepare("INSERT INTO rooms (name, type, description, price, capacity, view_type, rating, image, badge, available, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$name, $type, $description, $price, $capacity, $view_type, $rating, $image, $badge, $available]);
        
        $successMessage = "Room added successfully!";
    } catch (Exception $e) {
        $errorMessage = "Error: " . $e->getMessage();
    }
}

// Handle Update Room
if (isset($_POST['update_room'])) {
    try {
        $id = intval($_POST['room_id']);
        $name = trim($_POST['name']);
        $type = trim($_POST['type']);
        $description = trim($_POST['description']);
        $price = floatval($_POST['price']);
        $capacity = intval($_POST['capacity']);
        $view_type = trim($_POST['view_type']);
        $rating = floatval($_POST['rating']);
        $image = trim($_POST['image']);
        $badge = trim($_POST['badge']);
        $available = isset($_POST['available']) ? 1 : 0;
        
        $stmt = $conn->prepare("UPDATE rooms SET name=?, type=?, description=?, price=?, capacity=?, view_type=?, rating=?, image=?, badge=?, available=?, updated_at=NOW() WHERE id=?");
        $stmt->execute([$name, $type, $description, $price, $capacity, $view_type, $rating, $image, $badge, $available, $id]);
        
        $successMessage = "Room updated successfully!";
    } catch (Exception $e) {
        $errorMessage = "Error: " . $e->getMessage();
    }
}

// Handle Delete Room
if (isset($_POST['delete_room'])) {
    try {
        $id = intval($_POST['room_id']);
        $stmt = $conn->prepare("DELETE FROM rooms WHERE id=?");
        $stmt->execute([$id]);
        
        $successMessage = "Room deleted successfully!";
    } catch (Exception $e) {
        $errorMessage = "Error: " . $e->getMessage();
    }
}

// Handle Toggle Availability
if (isset($_POST['toggle_availability'])) {
    try {
        $id = intval($_POST['room_id']);
        $stmt = $conn->prepare("UPDATE rooms SET available = NOT available WHERE id=?");
        $stmt->execute([$id]);
        
        $successMessage = "Room availability updated!";
    } catch (Exception $e) {
        $errorMessage = "Error: " . $e->getMessage();
    }
}

// Fetch all rooms
try {
    $rooms = $conn->query("SELECT * FROM rooms ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $errorMessage = "Error fetching rooms: " . $e->getMessage();
    $rooms = [];
}

// Get statistics
$totalRooms = count($rooms);
$availableRooms = count(array_filter($rooms, function($r) { return $r['available'] == 1; }));
$bookedRooms = $totalRooms - $availableRooms;
$averagePrice = $totalRooms > 0 ? array_sum(array_column($rooms, 'price')) / $totalRooms : 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Rooms - SmartHotel Admin</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            color: #fff;
            min-height: 100vh;
        }

        /* Header */
        header {
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(20px);
            padding: 1.5rem 3rem;
            border-bottom: 1px solid rgba(201, 184, 150, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }

        .logo {
            font-size: 1.8rem;
            background: linear-gradient(135deg, #c9b896, #f4e4c1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
            letter-spacing: 0.1em;
        }

        .admin-info {
            display: flex;
            align-items: center;
            gap: 2rem;
        }

        .admin-details {
            text-align: right;
        }

        .admin-details h4 {
            color: #c9b896;
            font-size: 1rem;
            margin-bottom: 0.3rem;
        }

        .admin-details p {
            color: rgba(255,255,255,0.6);
            font-size: 0.85rem;
        }

        .logout-btn {
            padding: 0.8rem 1.5rem;
            background: linear-gradient(135deg, #c9b896, #f4e4c1);
            color: #000;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }

        .logout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(201, 184, 150, 0.4);
        }

        /* Navigation */
        .nav-tabs {
            background: rgba(15, 15, 15, 0.8);
            padding: 1rem 3rem;
            border-bottom: 1px solid rgba(201, 184, 150, 0.1);
            display: flex;
            gap: 2rem;
        }

        .nav-tabs a {
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .nav-tabs a:hover,
        .nav-tabs a.active {
            background: rgba(201, 184, 150, 0.1);
            color: #c9b896;
        }

        /* Container */
        .dashboard-container {
            max-width: 1600px;
            margin: 2rem auto;
            padding: 0 3rem;
        }

        /* Statistics Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }

        .stat-card {
            background: linear-gradient(135deg, rgba(201, 184, 150, 0.08), rgba(201, 184, 150, 0.03));
            border: 1px solid rgba(201, 184, 150, 0.2);
            border-radius: 15px;
            padding: 2rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            transition: all 0.3s;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(201, 184, 150, 0.2);
        }

        .stat-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #c9b896, #f4e4c1);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: #000;
        }

        .stat-info h3 {
            font-size: 2rem;
            color: #c9b896;
            margin-bottom: 0.3rem;
        }

        .stat-info p {
            color: rgba(255,255,255,0.7);
            font-size: 0.9rem;
        }

        /* Alert Messages */
        .alert {
            padding: 1rem 1.5rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from { transform: translateX(-100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .alert-success {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #10B981;
        }

        .alert-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #EF4444;
        }

        /* Section Headers */
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .section-header h2 {
            font-size: 2rem;
            color: #c9b896;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .add-btn {
            padding: 1rem 2rem;
            background: linear-gradient(135deg, #c9b896, #f4e4c1);
            color: #000;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .add-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(201, 184, 150, 0.4);
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.9);
            backdrop-filter: blur(5px);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        }

        .modal.active {
            display: flex;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
            background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
            border: 1px solid rgba(201, 184, 150, 0.3);
            border-radius: 20px;
            padding: 3rem;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .modal-header h3 {
            font-size: 1.8rem;
            color: #c9b896;
        }

        .close-modal {
            width: 40px;
            height: 40px;
            background: rgba(201, 184, 150, 0.1);
            border: 1px solid rgba(201, 184, 150, 0.3);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #c9b896;
            font-size: 1.5rem;
            transition: all 0.3s;
        }

        .close-modal:hover {
            background: rgba(201, 184, 150, 0.2);
            transform: rotate(90deg);
        }

        /* Form Styles */
        .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .form-group {
            position: relative;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        .form-group label {
            display: block;
            color: #c9b896;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 1rem;
            background: rgba(201, 184, 150, 0.05);
            border: 1px solid rgba(201, 184, 150, 0.2);
            border-radius: 10px;
            color: #fff;
            font-size: 1rem;
            transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #c9b896;
            background: rgba(201, 184, 150, 0.1);
        }

        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 1rem;
            background: rgba(201, 184, 150, 0.05);
            border: 1px solid rgba(201, 184, 150, 0.2);
            border-radius: 10px;
        }

        .checkbox-group input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
            accent-color: #c9b896;
        }

        .checkbox-group label {
            margin: 0;
            cursor: pointer;
        }

        .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }

        .btn-primary,
        .btn-secondary {
            flex: 1;
            padding: 1rem;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 1rem;
        }

        .btn-primary {
            background: linear-gradient(135deg, #c9b896, #f4e4c1);
            color: #000;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(201, 184, 150, 0.4);
        }

        .btn-secondary {
            background: rgba(201, 184, 150, 0.1);
            color: #c9b896;
            border: 1px solid rgba(201, 184, 150, 0.3);
        }

        .btn-secondary:hover {
            background: rgba(201, 184, 150, 0.2);
        }

        /* Rooms Table */
        .rooms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
        }

        .room-card {
            background: linear-gradient(135deg, rgba(201, 184, 150, 0.08), rgba(201, 184, 150, 0.03));
            border: 1px solid rgba(201, 184, 150, 0.2);
            border-radius: 15px;
            overflow: hidden;
            transition: all 0.3s;
        }

        .room-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(201, 184, 150, 0.2);
        }

        .room-image {
            width: 100%;
            height: 200px;
            background-size: cover;
            background-position: center;
            position: relative;
        }

        .room-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, #c9b896, #f4e4c1);
            color: #000;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .availability-badge {
            position: absolute;
            top: 1rem;
            left: 1rem;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .availability-badge.available {
            background: rgba(16, 185, 129, 0.9);
            color: #fff;
        }

        .availability-badge.booked {
            background: rgba(239, 68, 68, 0.9);
            color: #fff;
        }

        .room-info {
            padding: 1.5rem;
        }

        .room-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }

        .room-name {
            font-size: 1.3rem;
            color: #fff;
            font-weight: 600;
        }

        .room-price {
            font-size: 1.5rem;
            color: #c9b896;
            font-weight: 700;
        }

        .room-type {
            color: rgba(255,255,255,0.6);
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
        }

        .room-description {
            color: rgba(255,255,255,0.7);
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 1rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .room-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: rgba(255,255,255,0.7);
            font-size: 0.85rem;
        }

        .meta-item i {
            color: #c9b896;
        }

        .room-actions {
            display: flex;
            gap: 0.8rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(201, 184, 150, 0.1);
        }

        .action-btn {
            flex: 1;
            padding: 0.8rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .btn-edit {
            background: rgba(59, 130, 246, 0.1);
            color: #3B82F6;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .btn-edit:hover {
            background: rgba(59, 130, 246, 0.2);
        }

        .btn-delete {
            background: rgba(239, 68, 68, 0.1);
            color: #EF4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .btn-delete:hover {
            background: rgba(239, 68, 68, 0.2);
        }

        .btn-toggle {
            background: rgba(139, 92, 246, 0.1);
            color: #8B5CF6;
            border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .btn-toggle:hover {
            background: rgba(139, 92, 246, 0.2);
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            background: rgba(201, 184, 150, 0.05);
            border: 1px dashed rgba(201, 184, 150, 0.3);
            border-radius: 15px;
        }

        .empty-state i {
            font-size: 4rem;
            color: rgba(201, 184, 150, 0.3);
            margin-bottom: 1rem;
        }

        .empty-state h3 {
            color: rgba(255,255,255,0.7);
            margin-bottom: 0.5rem;
        }

        .empty-state p {
            color: rgba(255,255,255,0.5);
        }

        /* Responsive */
        @media (max-width: 968px) {
            header {
                padding: 1rem 1.5rem;
                flex-direction: column;
                gap: 1rem;
            }

            .nav-tabs {
                padding: 1rem 1.5rem;
                overflow-x: auto;
            }

            .dashboard-container {
                padding: 0 1.5rem;
            }

            .form-grid {
                grid-template-columns: 1fr;
            }

            .rooms-grid {
                grid-template-columns: 1fr;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="logo">
            <i class="fas fa-hotel"></i> SmartHotel Admin
        </div>
        <div class="admin-info">
            <div class="admin-details">
                <h4><?php echo htmlspecialchars($adminName); ?></h4>
                <p><?php echo htmlspecialchars($adminEmail); ?></p>
            </div>
            <a href="logout.php" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
        </div>
    </header>

    <nav class="nav-tabs">
        <a href="dashboard.php">
            <i class="fas fa-dashboard"></i> Dashboard
        </a>
        <a href="rooms.php" class="active">
            <i class="fas fa-bed"></i> Rooms
        </a>
        <a href="bookings.php">
            <i class="fas fa-calendar-check"></i> Bookings
        </a>
        <a href="users.php">
            <i class="fas fa-users"></i> Users
        </a>
        <a href="settings.php">
            <i class="fas fa-cog"></i> Settings
        </a>
    </nav>

    <div class="dashboard-container">
        <!-- Statistics -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-door-open"></i>
                </div>
                <div class="stat-info">
                    <h3><?php echo $totalRooms; ?></h3>
                    <p>Total Rooms</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <h3><?php echo $availableRooms; ?></h3>
                    <p>Available</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-calendar"></i>
                </div>
                <div class="stat-info">
                    <h3><?php echo $bookedRooms; ?></h3>
                    <p>Booked</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-info">
                    <h3>$<?php echo number_format($averagePrice, 0); ?></h3>
                    <p>Avg. Price</p>
                </div>
            </div>
        </div>

        <!-- Alert Messages -->
        <?php if ($successMessage): ?>
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <?php echo htmlspecialchars($successMessage); ?>
            </div>
        <?php endif; ?>

        <?php if ($errorMessage): ?>
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                <?php echo htmlspecialchars($errorMessage); ?>
            </div>
        <?php endif; ?>

        <!-- Section Header -->
        <div class="section-header">
            <h2>
                <i class="fas fa-bed"></i>
                Manage Rooms
            </h2>
            <button class="add-btn" onclick="openAddModal()">
                <i class="fas fa-plus"></i>
                Add New Room
            </button>
        </div>

        <!-- Rooms Grid -->
        <?php if (count($rooms) > 0): ?>
            <div class="rooms-grid">
                <?php foreach ($rooms as $room): ?>
                    <div class="room-card">
                        <div class="room-image" style="background-image: url('<?php echo htmlspecialchars($room['image']); ?>')">
                            <div class="availability-badge <?php echo $room['available'] ? 'available' : 'booked'; ?>">
                                <?php echo $room['available'] ? 'Available' : 'Booked'; ?>
                            </div>
                            <div class="room-badge"><?php echo htmlspecialchars($room['badge']); ?></div>
                        </div>
                        <div class="room-info">
                            <div class="room-header">
                                <div>
                                    <h3 class="room-name"><?php echo htmlspecialchars($room['name']); ?></h3>
                                    <p class="room-type"><?php echo htmlspecialchars($room['type']); ?></p>
                                </div>
                                <div class="room-price">$<?php echo number_format($room['price']); ?></div>
                            </div>
                            <p class="room-description"><?php echo htmlspecialchars($room['description']); ?></p>
                            <div class="room-meta">
                                <div class="meta-item">
                                    <i class="fas fa-users"></i>
                                    <?php echo $room['capacity']; ?> Guests
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-eye"></i>
                                    <?php echo ucfirst($room['view_type']); ?> View
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-star"></i>
                                    <?php echo number_format($room['rating'], 1); ?>
                                </div>
                            </div>
                            <div class="room-actions">
                                <button class="action-btn btn-edit" onclick='openEditModal(<?php echo json_encode($room); ?>)'>
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <form method="POST" style="flex: 1; margin: 0;" onsubmit="return confirm('Toggle availability for this room?');">
                                    <input type="hidden" name="room_id" value="<?php echo $room['id']; ?>">
                                    <button type="submit" name="toggle_availability" class="action-btn btn-toggle">
                                        <i class="fas fa-exchange-alt"></i> Toggle
                                    </button>
                                </form>
                                <form method="POST" style="flex: 1; margin: 0;" onsubmit="return confirm('Are you sure you want to delete this room?');">
                                    <input type="hidden" name="room_id" value="<?php echo $room['id']; ?>">
                                    <button type="submit" name="delete_room" class="action-btn btn-delete">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div class="empty-state">
                <i class="fas fa-bed"></i>
                <h3>No Rooms Found</h3>
                <p>Start by adding your first room using the "Add New Room" button above.</p>
            </div>
        <?php endif; ?>
    </div>

    <!-- Add/Edit Room Modal -->
    <div class="modal" id="roomModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">Add New Room</h3>
                <button class="close-modal" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form method="POST" id="roomForm">
                <input type="hidden" name="room_id" id="room_id">
                
                <div class="form-grid">
                    <div class="form-group">
                        <label>Room Name *</label>
                        <input type="text" name="name" id="name" required>
                    </div>
                    <div class="form-group">
                        <label>Room Type *</label>
                        <select name="type" id="type" required>
                            <option value="standard">Standard Room</option>
                            <option value="executive">Executive Suite</option>
                            <option value="deluxe">Deluxe Suite</option>
                            <option value="suite">Premium Suite</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Price (per night) *</label>
                        <input type="number" name="price" id="price" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Capacity *</label>
                        <input type="number" name="capacity" id="capacity" min="1" max="10" required>
                    </div>
                    <div class="form-group">
                        <label>View Type *</label>
                        <select name="view_type" id="view_type" required>
                            <option value="ocean">Ocean View</option>
                            <option value="city">City View</option>
                            <option value="garden">Garden View</option>
                            <option value="pool">Pool View</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Rating *</label>
                        <input type="number" name="rating" id="rating" step="0.1" min="0" max="5" required>
                    </div>
                    <div class="form-group">
                        <label>Badge *</label>
                        <input type="text" name="badge" id="badge" placeholder="e.g., Premium, Popular, Value" required>
                    </div>
                    <div class="form-group">
                        <label>Image URL *</label>
                        <input type="text" name="image" id="image" placeholder="https://example.com/image.jpg" required>
                    </div>
                    <div class="form-group full-width">
                        <label>Description *</label>
                        <textarea name="description" id="description" required></textarea>
                    </div>
                    <div class="form-group full-width">
                        <div class="checkbox-group">
                            <input type="checkbox" name="available" id="available" checked>
                            <label for="available">Room is available for booking</label>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" name="add_room" id="submitBtn" class="btn-primary">
                        <i class="fas fa-save"></i> Save Room
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openAddModal() {
            document.getElementById('modalTitle').textContent = 'Add New Room';
            document.getElementById('roomForm').reset();
            document.getElementById('room_id').value = '';
            document.getElementById('submitBtn').name = 'add_room';
            document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Save Room';
            document.getElementById('roomModal').classList.add('active');
        }

        function openEditModal(room) {
            document.getElementById('modalTitle').textContent = 'Edit Room';
            document.getElementById('room_id').value = room.id;
            document.getElementById('name').value = room.name;
            document.getElementById('type').value = room.type;
            document.getElementById('description').value = room.description;
            document.getElementById('price').value = room.price;
            document.getElementById('capacity').value = room.capacity;
            document.getElementById('view_type').value = room.view_type;
            document.getElementById('rating').value = room.rating;
            document.getElementById('image').value = room.image;
            document.getElementById('badge').value = room.badge;
            document.getElementById('available').checked = room.available == 1;
            document.getElementById('submitBtn').name = 'update_room';
            document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Update Room';
            document.getElementById('roomModal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('roomModal').classList.remove('active');
        }

        // Close modal on outside click
        window.onclick = function(event) {
            const modal = document.getElementById('roomModal');
            if (event.target == modal) {
                closeModal();
            }
        }

        // Auto-hide alerts after 5 seconds
        setTimeout(() => {
            const alerts = document.querySelectorAll('.alert');
            alerts.forEach(alert => {
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            });
        }, 5000);
    </script>
</body>
</html>