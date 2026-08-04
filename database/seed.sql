-- ========================================================
-- LibraSys Database Seed Script (Default Data)
-- ========================================================

-- 1. Seed Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Computer Science', 'Programming, algorithms, databases, and computer systems'),
(2, 'Mathematics', 'Calculus, algebra, logic, and discrete math'),
(3, 'Literature', 'Classic novels, poetry, drama, and anthologies'),
(4, 'Science Fiction', 'Speculative fiction, space exploration, and futuristic technology')
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);

-- 2. Seed Authors
INSERT INTO authors (id, name, bio) VALUES
(1, 'Robert C. Martin', 'Known as Uncle Bob, author of Clean Code and Clean Architecture.'),
(2, 'Donald E. Knuth', 'Renowned computer scientist, author of The Art of Computer Programming.'),
(3, 'J.R.R. Tolkien', 'English writer, poet, philologist, and academic, author of The Lord of the Rings.'),
(4, 'Isaac Asimov', 'American writer and professor of biochemistry, author of Foundation Series.')
ON DUPLICATE KEY UPDATE name=VALUES(name), bio=VALUES(bio);

-- 3. Seed Users (Hashed Passwords with BCrypt)
-- adminpassword -> $2a$10$wE9sD.Dfg1t1w/P/v0f4gOu8KqF4.nCg8qfH7K5c3gK2qW4sE.m6u
-- librarianpassword -> $2a$10$lU2eB1jL.fD/B7u6rN4/ee9qWvT.JzHjC5x0wM2/L3p9E7R4lQ6wW
-- studentpassword -> $2a$10$T8Z6sE2.s.kFjJdFjOQ.6.g3fH1r.vCkW/bKzTfL4r7tD5u.J2sKu
-- password123 -> $2a$10$u9alBhyhRlVEW78M8myc/.C9pkrXQ0zJwplLIDtHdjv0ba0Ec9zYG
INSERT INTO users (id, full_name, email, password, role) VALUES
(1, 'System Administrator', 'admin@librasys.com', '$2a$10$wE9sD.Dfg1t1w/P/v0f4gOu8KqF4.nCg8qfH7K5c3gK2qW4sE.m6u', 'ROLE_ADMIN'),
(2, 'Chief Librarian', 'librarian@librasys.com', '$2a$10$lU2eB1jL.fD/B7u6rN4/ee9qWvT.JzHjC5x0wM2/L3p9E7R4lQ6wW', 'ROLE_LIBRARIAN'),
(3, 'Student Account', 'student@librasys.com', '$2a$10$T8Z6sE2.s.kFjJdFjOQ.6.g3fH1r.vCkW/bKzTfL4r7tD5u.J2sKu', 'ROLE_STUDENT'),
(4, 'Test User', 'testuser_unique@gmail.com', '$2a$10$u9alBhyhRlVEW78M8myc/.C9pkrXQ0zJwplLIDtHdjv0ba0Ec9zYG', 'ROLE_ADMIN')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), password=VALUES(password), role=VALUES(role);

-- 4. Seed Books
INSERT INTO books (id, title, isbn, category_id, author_id, total_copies, available_copies, location_rack) VALUES
(1, 'Clean Code', '9780132350884', 1, 1, 5, 5, 'Rack A-1'),
(2, 'Clean Architecture', '9780134494166', 1, 1, 3, 3, 'Rack A-2'),
(3, 'The Art of Computer Programming', '9780201896831', 1, 2, 2, 2, 'Rack B-1'),
(4, 'The Hobbit', '9780261102217', 3, 3, 8, 8, 'Rack C-4'),
(5, 'Foundation', '9780553293357', 4, 4, 4, 4, 'Rack D-2')
ON DUPLICATE KEY UPDATE title=VALUES(title), category_id=VALUES(category_id), author_id=VALUES(author_id), total_copies=VALUES(total_copies), available_copies=VALUES(available_copies), location_rack=VALUES(location_rack);
