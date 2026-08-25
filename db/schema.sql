DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS classes;

CREATE TABLE classes (
  class_id TEXT PRIMARY KEY,
  class_code TEXT UNIQUE NOT NULL,
  class_name TEXT NOT NULL,
  subjects TEXT,
  schedule_days TEXT,
  schedule_time TEXT,
  room TEXT,
  teacher_id TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE teachers (
  teacher_id TEXT PRIMARY KEY,
  teacher_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  subject_specialty TEXT,
  class_id TEXT,
  join_date DATE,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_teacher_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE SET NULL
);

ALTER TABLE classes
  ADD CONSTRAINT fk_class_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL;

CREATE TABLE students (
  student_id TEXT PRIMARY KEY,
  student_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT,
  age INT,
  class_id TEXT NOT NULL,
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_email TEXT,
  enrolment_date DATE,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE RESTRICT
);

CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_teachers_class_id ON teachers(class_id);

CREATE TABLE schedules (
  schedule_id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL REFERENCES classes(class_id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  teacher_id TEXT REFERENCES teachers(teacher_id) ON DELETE SET NULL
);
