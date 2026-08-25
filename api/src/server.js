require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { pool } = require("./db");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*"
  })
);
app.use(express.json());

function sendDbError(res, error) {
  if (error.code === "23505") {
    return res.status(409).json({ error: "A record with that unique value already exists." });
  }

  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
}

function validateRequired(fields, body) {
  for (const field of fields) {
    if (!body[field] && body[field] !== 0) {
      return field;
    }
  }
  return null;
}

app.get("/api/health", async (_, res) => {
  res.json({ status: "ok" });
});

app.get("/api/db-check", async (_, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ now: result.rows[0].now });
  } catch (error) {
    sendDbError(res, error);
  }
});

app.get("/api/classes", async (_, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, t.full_name AS teacher_name,
        (SELECT COUNT(*)::int FROM students s WHERE s.class_id = c.class_id) AS student_count
       FROM classes c
       LEFT JOIN teachers t ON t.teacher_id = c.teacher_id
       ORDER BY c.class_code`
    );
    res.json(result.rows);
  } catch (error) {
    sendDbError(res, error);
  }
});

app.get("/api/classes/:id", async (req, res) => {
  try {
    const classResult = await pool.query(
      `SELECT c.*, t.full_name AS teacher_name
       FROM classes c
       LEFT JOIN teachers t ON t.teacher_id = c.teacher_id
       WHERE c.class_id = $1`,
      [req.params.id]
    );

    if (!classResult.rows.length) {
      return res.status(404).json({ error: "Class not found" });
    }

    const studentsResult = await pool.query(
      `SELECT student_id, student_code, full_name, gender, age, status
       FROM students
       WHERE class_id = $1
       ORDER BY student_code`,
      [req.params.id]
    );

    return res.json({
      ...classResult.rows[0],
      students: studentsResult.rows
    });
  } catch (error) {
    return sendDbError(res, error);
  }
});

app.post("/api/classes", async (req, res) => {
  const missing = validateRequired(["class_code", "class_name"], req.body);
  if (missing) {
    return res.status(400).json({ error: `${missing} is required` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO classes
      (class_code, class_name, subjects, schedule_days, schedule_time, room, teacher_id, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        req.body.class_code,
        req.body.class_name,
        req.body.subjects || null,
        req.body.schedule_days || null,
        req.body.schedule_time || null,
        req.body.room || null,
        req.body.teacher_id || null,
        req.body.status || "Active"
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return sendDbError(res, error);
  }
});

app.put("/api/classes/:id", async (req, res) => {
  const missing = validateRequired(["class_code", "class_name"], req.body);
  if (missing) {
    return res.status(400).json({ error: `${missing} is required` });
  }

  try {
    const result = await pool.query(
      `UPDATE classes
       SET class_code=$1, class_name=$2, subjects=$3, schedule_days=$4, schedule_time=$5, room=$6,
           teacher_id=$7, status=$8, updated_at=NOW()
       WHERE class_id=$9
       RETURNING *`,
      [
        req.body.class_code,
        req.body.class_name,
        req.body.subjects || null,
        req.body.schedule_days || null,
        req.body.schedule_time || null,
        req.body.room || null,
        req.body.teacher_id || null,
        req.body.status || "Active",
        req.params.id
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Class not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return sendDbError(res, error);
  }
});

app.delete("/api/classes/:id", async (req, res) => {
  try {
    const studentsCheck = await pool.query("SELECT COUNT(*)::int AS count FROM students WHERE class_id=$1", [req.params.id]);
    if (studentsCheck.rows[0].count > 0) {
      return res.status(409).json({ error: "Cannot delete class while students are still assigned." });
    }

    const result = await pool.query("DELETE FROM classes WHERE class_id=$1 RETURNING class_id", [req.params.id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: "Class not found" });
    }

    return res.json({ message: "Class deleted" });
  } catch (error) {
    return sendDbError(res, error);
  }
});

app.get("/api/teachers", async (_, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, c.class_code, c.class_name
       FROM teachers t
       LEFT JOIN classes c ON c.class_id = t.class_id
       ORDER BY t.teacher_code`
    );
    res.json(result.rows);
  } catch (error) {
    sendDbError(res, error);
  }
});

app.get("/api/teachers/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, c.class_code, c.class_name
       FROM teachers t
       LEFT JOIN classes c ON c.class_id = t.class_id
       WHERE t.teacher_id=$1`,
      [req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    return sendDbError(res, error);
  }
});

app.post("/api/teachers", async (req, res) => {
  const missing = validateRequired(["teacher_code", "full_name", "email"], req.body);
  if (missing) {
    return res.status(400).json({ error: `${missing} is required` });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const insertResult = await client.query(
        `INSERT INTO teachers
        (teacher_code, full_name, email, phone, subject_specialty, class_id, join_date, status)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *`,
        [
          req.body.teacher_code,
          req.body.full_name,
          req.body.email,
          req.body.phone || null,
          req.body.subject_specialty || null,
          req.body.class_id || null,
          req.body.join_date || null,
          req.body.status || "Active"
        ]
      );

      if (req.body.class_id) {
        await client.query("UPDATE classes SET teacher_id=$1, updated_at=NOW() WHERE class_id=$2", [
          insertResult.rows[0].teacher_id,
          req.body.class_id
        ]);
      }

      await client.query("COMMIT");
      return res.status(201).json(insertResult.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      return sendDbError(res, error);
    } finally {
      client.release();
    }
  } catch (error) {
    return sendDbError(res, error);
  }
});

app.put("/api/teachers/:id", async (req, res) => {
  const missing = validateRequired(["teacher_code", "full_name", "email"], req.body);
  if (missing) {
    return res.status(400).json({ error: `${missing} is required` });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const previous = await client.query("SELECT class_id FROM teachers WHERE teacher_id=$1", [req.params.id]);
    if (!previous.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Teacher not found" });
    }

    const result = await client.query(
      `UPDATE teachers
       SET teacher_code=$1, full_name=$2, email=$3, phone=$4, subject_specialty=$5,
           class_id=$6, join_date=$7, status=$8, updated_at=NOW()
       WHERE teacher_id=$9
       RETURNING *`,
      [
        req.body.teacher_code,
        req.body.full_name,
        req.body.email,
        req.body.phone || null,
        req.body.subject_specialty || null,
        req.body.class_id || null,
        req.body.join_date || null,
        req.body.status || "Active",
        req.params.id
      ]
    );

    const oldClassId = previous.rows[0].class_id;
    const newClassId = req.body.class_id || null;

    if (oldClassId && oldClassId !== newClassId) {
      await client.query("UPDATE classes SET teacher_id=NULL, updated_at=NOW() WHERE class_id=$1 AND teacher_id=$2", [
        oldClassId,
        req.params.id
      ]);
    }

    if (newClassId) {
      await client.query("UPDATE classes SET teacher_id=$1, updated_at=NOW() WHERE class_id=$2", [req.params.id, newClassId]);
    }

    await client.query("COMMIT");
    return res.json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    return sendDbError(res, error);
  } finally {
    client.release();
  }
});

app.delete("/api/teachers/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query("SELECT teacher_id FROM teachers WHERE teacher_id=$1", [req.params.id]);
    if (!existing.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Teacher not found" });
    }

    await client.query("UPDATE classes SET teacher_id=NULL, updated_at=NOW() WHERE teacher_id=$1", [req.params.id]);
    await client.query("DELETE FROM teachers WHERE teacher_id=$1", [req.params.id]);

    await client.query("COMMIT");
    return res.json({ message: "Teacher deleted and classes un-assigned" });
  } catch (error) {
    await client.query("ROLLBACK");
    return sendDbError(res, error);
  } finally {
    client.release();
  }
});

app.get("/api/students", async (req, res) => {
  const values = [];
  let where = "";

  if (req.query.class_id) {
    values.push(req.query.class_id);
    where = "WHERE s.class_id = $1";
  }

  try {
    const result = await pool.query(
      `SELECT s.*, c.class_code, c.class_name
       FROM students s
       JOIN classes c ON c.class_id = s.class_id
       ${where}
       ORDER BY s.student_code`,
      values
    );
    res.json(result.rows);
  } catch (error) {
    sendDbError(res, error);
  }
});

app.get("/api/students/next-code/:classId", async (req, res) => {
  try {
    const classResult = await pool.query("SELECT class_code FROM classes WHERE class_id=$1", [req.params.classId]);
    if (!classResult.rows.length) {
      return res.status(404).json({ error: "Class not found" });
    }

    const classCode = classResult.rows[0].class_code;
    const studentResult = await pool.query(
      "SELECT COUNT(*)::int AS count FROM students WHERE class_id=$1",
      [req.params.classId]
    );

    const next = studentResult.rows[0].count + 1;
    const suffix = String(next).padStart(2, "0");

    return res.json({ student_code: `${classCode}-student${suffix}` });
  } catch (error) {
    return sendDbError(res, error);
  }
});

app.get("/api/students/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.class_code, c.class_name
       FROM students s
       JOIN classes c ON c.class_id = s.class_id
       WHERE s.student_id=$1`,
      [req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Student not found" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    return sendDbError(res, error);
  }
});

app.post("/api/students", async (req, res) => {
  const missing = validateRequired(["student_code", "full_name", "class_id"], req.body);
  if (missing) {
    return res.status(400).json({ error: `${missing} is required` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO students
      (student_code, full_name, gender, age, class_id, guardian_name, guardian_phone, guardian_email, enrolment_date, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        req.body.student_code,
        req.body.full_name,
        req.body.gender || null,
        req.body.age || null,
        req.body.class_id,
        req.body.guardian_name || null,
        req.body.guardian_phone || null,
        req.body.guardian_email || null,
        req.body.enrolment_date || null,
        req.body.status || "Active"
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return sendDbError(res, error);
  }
});

app.put("/api/students/:id", async (req, res) => {
  const missing = validateRequired(["student_code", "full_name", "class_id"], req.body);
  if (missing) {
    return res.status(400).json({ error: `${missing} is required` });
  }

  try {
    const result = await pool.query(
      `UPDATE students
       SET student_code=$1, full_name=$2, gender=$3, age=$4, class_id=$5,
           guardian_name=$6, guardian_phone=$7, guardian_email=$8,
           enrolment_date=$9, status=$10, updated_at=NOW()
       WHERE student_id=$11
       RETURNING *`,
      [
        req.body.student_code,
        req.body.full_name,
        req.body.gender || null,
        req.body.age || null,
        req.body.class_id,
        req.body.guardian_name || null,
        req.body.guardian_phone || null,
        req.body.guardian_email || null,
        req.body.enrolment_date || null,
        req.body.status || "Active",
        req.params.id
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return sendDbError(res, error);
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM students WHERE student_id=$1 RETURNING student_id", [req.params.id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.json({ message: "Student deleted" });
  } catch (error) {
    return sendDbError(res, error);
  }
});

app.use((_, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
