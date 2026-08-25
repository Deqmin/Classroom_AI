INSERT INTO classes
  (class_id, class_code, class_name, subjects, schedule_days, schedule_time, room, teacher_id, status)
VALUES
  ('C001', 'primary1', 'Primary 1', 'English, Mathematics', 'Mon / Wed', '16:00-17:30', 'Room A', 'T001', 'Active'),
  ('C002', 'primary2', 'Primary 2', 'English, Mathematics', 'Tue / Thu', '16:00-17:30', 'Room B', 'T002', 'Active'),
  ('C003', 'primary3', 'Primary 3', 'English, Mathematics, Science', 'Mon / Wed', '17:45-19:15', 'Room A', 'T003', 'Active'),
  ('C004', 'primary4', 'Primary 4', 'Mathematics, Science', 'Tue / Thu', '17:45-19:15', 'Room B', 'T004', 'Active'),
  ('C005', 'primary5', 'Primary 5', 'English, Science', 'Sat', '09:00-11:00', 'Room C', 'T005', 'Active'),
  ('C006', 'primary6', 'Primary 6', 'English, Mathematics, Science (PSLE prep)', 'Sat', '11:15-13:15', 'Room C', 'T001', 'Inactive');

INSERT INTO teachers
  (teacher_id, teacher_code, full_name, email, phone, subject_specialty, class_id, join_date, status)
VALUES
  ('T001', 'teacher01', 'Alice Tan', 'teacher01@example.com', '+65 9000 0001', 'English', 'C001', '2022-01-10', 'Active'),
  ('T002', 'teacher02', 'Benjamin Lim', 'teacher02@example.com', '+65 9000 0002', 'Mathematics', 'C002', '2022-03-15', 'Active'),
  ('T003', 'teacher03', 'Chloe Ng', 'teacher03@example.com', '+65 9000 0003', 'Science', 'C003', '2023-06-01', 'Active'),
  ('T004', 'teacher04', 'Daniel Wong', 'teacher04@example.com', '+65 9000 0004', 'Mathematics', 'C004', '2023-09-20', 'Active'),
  ('T005', 'teacher05', 'Emily Goh', 'teacher05@example.com', '+65 9000 0005', 'English', 'C005', '2024-02-05', 'Active'),
  ('T006', 'teacher06', 'Farah Rahman', 'teacher06@example.com', '+65 9000 0006', 'Science', NULL, '2024-08-12', 'On Leave');

INSERT INTO students
  (student_id, student_code, full_name, gender, age, class_id, guardian_name, guardian_phone, guardian_email, enrolment_date, status)
VALUES
  ('S001', 'primary1-student01', 'Aaron Lee', 'M', 7, 'C001', 'Mrs Lee', '+65 8001 0037', 'aaron.lee@example.com', '2025-02-11', 'Active'),
  ('S002', 'primary1-student02', 'Bella Teo', 'F', 7, 'C001', 'Ms Teo', '+65 8002 0074', 'bella.teo@example.com', '2025-03-12', 'Active'),
  ('S003', 'primary1-student03', 'Caleb Low', 'M', 7, 'C001', 'Mr Low', '+65 8003 0111', 'caleb.low@example.com', '2025-04-13', 'Active'),
  ('S004', 'primary1-student04', 'Diana Tan', 'F', 7, 'C001', 'Mrs Tan', '+65 8004 0148', 'diana.tan@example.com', '2025-05-14', 'Active'),
  ('S005', 'primary1-student05', 'Ethan Goh', 'M', 7, 'C001', 'Ms Goh', '+65 8005 0185', 'ethan.goh@example.com', '2025-06-15', 'Active'),
  ('S006', 'primary1-student06', 'Fiona Foo', 'F', 7, 'C001', 'Mr Foo', '+65 8006 0222', 'fiona.foo@example.com', '2025-07-16', 'Active'),
  ('S007', 'primary2-student01', 'Gavin Lim', 'M', 8, 'C002', 'Mrs Lim', '+65 8007 0259', 'gavin.lim@example.com', '2025-08-17', 'Active'),
  ('S008', 'primary2-student02', 'Hannah Wong', 'F', 8, 'C002', 'Ms Wong', '+65 8008 0296', 'hannah.wong@example.com', '2025-01-18', 'Active'),
  ('S009', 'primary2-student03', 'Ivan Ang', 'M', 8, 'C002', 'Mr Ang', '+65 8009 0333', 'ivan.ang@example.com', '2025-02-19', 'Active'),
  ('S010', 'primary2-student04', 'Jasmine Ng', 'F', 8, 'C002', 'Mrs Ng', '+65 8010 0370', 'jasmine.ng@example.com', '2025-03-20', 'Active'),
  ('S011', 'primary2-student05', 'Kevin Yeo', 'M', 8, 'C002', 'Ms Yeo', '+65 8011 0407', 'kevin.yeo@example.com', '2025-04-21', 'Active'),
  ('S012', 'primary3-student01', 'Lily Toh', 'F', 9, 'C003', 'Mr Toh', '+65 8012 0444', 'lily.toh@example.com', '2025-05-22', 'Active'),
  ('S013', 'primary3-student02', 'Marcus Ong', 'M', 9, 'C003', 'Mrs Ong', '+65 8013 0481', 'marcus.ong@example.com', '2025-06-23', 'Active'),
  ('S014', 'primary3-student03', 'Nadia Chan', 'F', 9, 'C003', 'Ms Chan', '+65 8014 0518', 'nadia.chan@example.com', '2025-07-24', 'Active'),
  ('S015', 'primary3-student04', 'Oscar Seah', 'M', 9, 'C003', 'Mr Seah', '+65 8015 0555', 'oscar.seah@example.com', '2025-08-25', 'Active'),
  ('S016', 'primary3-student05', 'Priya Chua', 'F', 9, 'C003', 'Mrs Chua', '+65 8016 0592', 'priya.chua@example.com', '2025-01-26', 'Withdrawn'),
  ('S017', 'primary4-student01', 'Ryan Ho', 'M', 10, 'C004', 'Ms Ho', '+65 8017 0629', 'ryan.ho@example.com', '2025-02-27', 'Active'),
  ('S018', 'primary4-student02', 'Sophie Chia', 'F', 10, 'C004', 'Mr Chia', '+65 8018 0666', 'sophie.chia@example.com', '2025-03-10', 'Active'),
  ('S019', 'primary4-student03', 'Tristan Koh', 'M', 10, 'C004', 'Mrs Koh', '+65 8019 0703', 'tristan.koh@example.com', '2025-04-11', 'Active'),
  ('S020', 'primary4-student04', 'Uma Sim', 'F', 10, 'C004', 'Ms Sim', '+65 8020 0740', 'uma.sim@example.com', '2025-05-12', 'Active'),
  ('S021', 'primary5-student01', 'Aaron Lee', 'M', 11, 'C005', 'Mr Lee', '+65 8021 0777', 'aaron.lee@example.com', '2025-06-13', 'Active'),
  ('S022', 'primary5-student02', 'Bella Teo', 'F', 11, 'C005', 'Mrs Teo', '+65 8022 0814', 'bella.teo@example.com', '2025-07-14', 'Active'),
  ('S023', 'primary5-student03', 'Caleb Low', 'M', 11, 'C005', 'Ms Low', '+65 8023 0851', 'caleb.low@example.com', '2025-08-15', 'Active'),
  ('S024', 'primary6-student01', 'Diana Tan', 'F', 12, 'C006', 'Mr Tan', '+65 8024 0888', 'diana.tan@example.com', '2025-01-16', 'Active'),
  ('S025', 'primary6-student02', 'Ethan Goh', 'M', 12, 'C006', 'Mrs Goh', '+65 8025 0925', 'ethan.goh@example.com', '2025-02-17', 'Active');

INSERT INTO schedules (schedule_id, class_id, day, start_time, end_time, room, teacher_id)
VALUES
  ('SC001', 'C001', 'Mon', '16:00', '17:30', 'Room A', 'T001'),
  ('SC002', 'C001', 'Wed', '16:00', '17:30', 'Room A', 'T001'),
  ('SC003', 'C002', 'Tue', '16:00', '17:30', 'Room B', 'T002'),
  ('SC004', 'C002', 'Thu', '16:00', '17:30', 'Room B', 'T002'),
  ('SC005', 'C003', 'Mon', '17:45', '19:15', 'Room A', 'T003'),
  ('SC006', 'C003', 'Wed', '17:45', '19:15', 'Room A', 'T003'),
  ('SC007', 'C004', 'Tue', '17:45', '19:15', 'Room B', 'T004'),
  ('SC008', 'C004', 'Thu', '17:45', '19:15', 'Room B', 'T004'),
  ('SC009', 'C005', 'Sat', '09:00', '11:00', 'Room C', 'T005'),
  ('SC010', 'C006', 'Sat', '11:15', '13:15', 'Room C', 'T001');
