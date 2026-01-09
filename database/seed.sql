-- DirectHome Seed Data

-- Insert demo users
INSERT INTO users (name, phone, email, role, verified, trust_score) VALUES
('Rajesh Kumar', '+919876543210', 'rajesh@example.com', 'buyer', TRUE, 85),
('Priya Sharma', '+919876543211', 'priya@example.com', 'seller', TRUE, 90),
('Amit Patel', '+919876543212', 'amit@example.com', 'admin', TRUE, 100),
('Sneha Reddy', '+919876543213', 'sneha@example.com', 'seller', TRUE, 88),
('Vikram Singh', '+919876543214', 'vikram@example.com', 'buyer', FALSE, 45),
('Anjali Mehta', '+919876543215', 'anjali@example.com', 'seller', TRUE, 92);

-- Insert demo properties
INSERT INTO properties (user_id, title, description, price, currency, bhk, city, state, address, lat, lng, amenities, status, risk_score) VALUES
(2, 'Spacious 3BHK Apartment in Andheri West', 'Beautiful 3BHK apartment with modern amenities, close to metro station. Well-maintained building with 24/7 security.', 8500000, 'INR', 3, 'Mumbai', 'Maharashtra', 'Andheri West, Mumbai', 19.1364, 72.8296, '["parking", "security", "lift", "gym", "swimming_pool"]', 'active', 15),
(4, 'Luxury 4BHK Villa in Whitefield', 'Premium villa with garden, modern kitchen, and premium finishes. Perfect for families.', 25000000, 'INR', 4, 'Bangalore', 'Karnataka', 'Whitefield, Bangalore', 12.9698, 77.7499, '["parking", "security", "garden", "gym", "clubhouse"]', 'active', 10),
(2, 'Cozy 2BHK Flat in Koramangala', 'Well-furnished 2BHK in prime location. Close to IT parks and shopping malls.', 6500000, 'INR', 2, 'Bangalore', 'Karnataka', 'Koramangala, Bangalore', 12.9352, 77.6245, '["parking", "security", "lift"]', 'active', 20),
(6, 'Modern 3BHK in Gurgaon Sector 43', 'Newly constructed apartment with premium amenities. Ready to move in.', 12000000, 'INR', 3, 'Gurgaon', 'Haryana', 'Sector 43, Gurgaon', 28.4089, 77.0378, '["parking", "security", "lift", "gym", "swimming_pool", "clubhouse"]', 'active', 12),
(4, 'Affordable 1BHK in Pune', 'Compact 1BHK apartment perfect for singles or couples. Good connectivity.', 3200000, 'INR', 1, 'Pune', 'Maharashtra', 'Hinjawadi, Pune', 18.5912, 73.7415, '["parking", "security"]', 'active', 25),
(6, 'Premium 5BHK Penthouse in South Delhi', 'Luxury penthouse with panoramic city views. Fully furnished with premium amenities.', 45000000, 'INR', 5, 'Delhi', 'Delhi', 'South Extension, Delhi', 28.5565, 77.2185, '["parking", "security", "lift", "gym", "swimming_pool", "clubhouse", "concierge"]', 'active', 8);

-- Insert property media (sample paths)
INSERT INTO property_media (property_id, file_path, media_type, is_primary) VALUES
(1, '/uploads/property_1_1.jpg', 'image', TRUE),
(1, '/uploads/property_1_2.jpg', 'image', FALSE),
(1, '/uploads/property_1_3.jpg', 'image', FALSE),
(2, '/uploads/property_2_1.jpg', 'image', TRUE),
(2, '/uploads/property_2_2.jpg', 'image', FALSE),
(3, '/uploads/property_3_1.jpg', 'image', TRUE),
(4, '/uploads/property_4_1.jpg', 'image', TRUE),
(5, '/uploads/property_5_1.jpg', 'image', TRUE),
(6, '/uploads/property_6_1.jpg', 'image', TRUE);

-- Insert sample messages
INSERT INTO messages (from_user_id, to_user_id, property_id, content, spam_score, read) VALUES
(1, 2, 1, 'Hi, I am interested in your 3BHK apartment. Can we schedule a visit?', 5, FALSE),
(2, 1, 1, 'Sure! I am available this weekend. What time works for you?', 0, FALSE),
(1, 4, 2, 'Is the villa still available? What is the best price?', 10, FALSE),
(1, 6, 4, 'Hello, I would like to know more about the property.', 5, FALSE);

-- Insert sample documents
INSERT INTO documents (user_id, property_id, type, file_path, verified, verified_at, verified_by) VALUES
(2, 1, 'ownership', '/uploads/doc_1.pdf', TRUE, CURRENT_TIMESTAMP, 3),
(4, 2, 'ownership', '/uploads/doc_2.pdf', TRUE, CURRENT_TIMESTAMP, 3),
(6, 4, 'ownership', '/uploads/doc_3.pdf', TRUE, CURRENT_TIMESTAMP, 3);

-- Insert saved searches
INSERT INTO saved_searches (user_id, name, filters) VALUES
(1, '3BHK in Mumbai', '{"bhk": 3, "city": "Mumbai", "maxPrice": 10000000}'),
(1, 'Budget Apartments', '{"maxPrice": 5000000, "bhk": 2}');
