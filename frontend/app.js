const productionApi = "https://sunrise-tuition-api.onrender.com";
const storedApi = localStorage.getItem("apiBaseUrl");
const savedApi = storedApi && !storedApi.includes("localhost") && !storedApi.includes("sunrise-tuition-centre-api")
  ? storedApi
  : productionApi;
let apiBaseUrl = savedApi;

const state = {
  classes: [],
  teachers: [],
  students: []
};

const el = {
  statusBox: document.querySelector("#statusBox"),
  apiBaseUrl: document.querySelector("#apiBaseUrl"),
  saveApiBtn: document.querySelector("#saveApiBtn"),
  classRows: document.querySelector("#classRows"),
  teacherRows: document.querySelector("#teacherRows"),
  studentRows: document.querySelector("#studentRows"),
  classDetail: document.querySelector("#classDetail"),
  classSearch: document.querySelector("#classSearch"),
  teacherSearch: document.querySelector("#teacherSearch"),
  studentSearch: document.querySelector("#studentSearch"),
  studentClassFilter: document.querySelector("#studentClassFilter"),
  studentClassId: document.querySelector("#studentClassId"),
  teacherClassId: document.querySelector("#teacherClassId")
};

function showStatus(message, type = "ok") {
  el.statusBox.className = `status card show ${type}`;
  el.statusBox.textContent = message;
}

function clearStatus() {
  el.statusBox.className = "status card";
  el.statusBox.textContent = "";
}

async function api(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload.error || "Request failed";
    throw new Error(message);
  }

  return payload;
}

function updateCounts() {
  document.querySelector("#countClasses").textContent = state.classes.length;
  document.querySelector("#countTeachers").textContent = state.teachers.length;
  document.querySelector("#countStudents").textContent = state.students.length;
}

function toOptions(items, labelField = "class_code") {
  return items.map((item) => `<option value="${item.class_id}">${item[labelField]}</option>`).join("");
}

function refreshSelects() {
  el.studentClassFilter.innerHTML = '<option value="">All classes</option>' + toOptions(state.classes);
  el.studentClassId.innerHTML = '<option value="">Select class</option>' + toOptions(state.classes);
  el.teacherClassId.innerHTML = '<option value="">Unassigned</option>' + toOptions(state.classes);
}

function renderClasses() {
  const keyword = el.classSearch.value.trim().toLowerCase();
  const classes = state.classes.filter((row) => {
    return row.class_code.toLowerCase().includes(keyword) || row.class_name.toLowerCase().includes(keyword);
  });

  el.classRows.innerHTML = classes
    .map(
      (item) => `
      <tr>
        <td>${item.class_code}</td>
        <td>${item.class_name}</td>
        <td>${item.teacher_name || "-"}</td>
        <td>${item.student_count}</td>
        <td>
          <div class="action-row">
            <button class="btn btn-ghost" data-class-show="${item.class_id}">Detail</button>
            <button class="btn btn-ghost" data-class-edit="${item.class_id}">Edit</button>
            <button class="btn btn-danger" data-class-delete="${item.class_id}">Delete</button>
          </div>
        </td>
      </tr>
    `
    )
    .join("");
}

function renderTeachers() {
  const keyword = el.teacherSearch.value.trim().toLowerCase();
  const teachers = state.teachers.filter((row) => {
    return row.teacher_code.toLowerCase().includes(keyword) || row.full_name.toLowerCase().includes(keyword);
  });

  el.teacherRows.innerHTML = teachers
    .map(
      (item) => `
      <tr>
        <td>${item.teacher_code}</td>
        <td>${item.full_name}</td>
        <td>${item.email}</td>
        <td>${item.class_code || "-"}</td>
        <td>
          <div class="action-row">
            <button class="btn btn-ghost" data-teacher-edit="${item.teacher_id}">Edit</button>
            <button class="btn btn-danger" data-teacher-delete="${item.teacher_id}">Delete</button>
          </div>
        </td>
      </tr>
    `
    )
    .join("");
}

function renderStudents() {
  const keyword = el.studentSearch.value.trim().toLowerCase();
  const classFilter = el.studentClassFilter.value;

  const students = state.students.filter((row) => {
    const keywordOk = row.student_code.toLowerCase().includes(keyword) || row.full_name.toLowerCase().includes(keyword);
    const classOk = !classFilter || row.class_id === classFilter;
    return keywordOk && classOk;
  });

  el.studentRows.innerHTML = students
    .map(
      (item) => `
      <tr>
        <td>${item.student_code}</td>
        <td>${item.full_name}</td>
        <td>${item.class_code}</td>
        <td>${item.guardian_name || "-"}</td>
        <td>
          <div class="action-row">
            <button class="btn btn-ghost" data-student-edit="${item.student_id}">Edit</button>
            <button class="btn btn-danger" data-student-delete="${item.student_id}">Delete</button>
          </div>
        </td>
      </tr>
    `
    )
    .join("");
}

async function loadAll() {
  try {
    showStatus("Loading data... if Render is asleep this may take a moment.");

    const [classes, teachers, students] = await Promise.all([
      api("/api/classes"),
      api("/api/teachers"),
      api("/api/students")
    ]);

    state.classes = classes;
    state.teachers = teachers;
    state.students = students;

    refreshSelects();
    renderClasses();
    renderTeachers();
    renderStudents();
    updateCounts();
    showStatus("Data loaded successfully.", "ok");
  } catch (error) {
    showStatus(error.message, "error");
  }
}

function resetClassForm() {
  document.querySelector("#classForm").reset();
  document.querySelector("#classId").value = "";
  document.querySelector("#classFormTitle").textContent = "Create class";
}

function resetTeacherForm() {
  document.querySelector("#teacherForm").reset();
  document.querySelector("#teacherId").value = "";
  document.querySelector("#teacherFormTitle").textContent = "Create teacher";
}

function resetStudentForm() {
  document.querySelector("#studentForm").reset();
  document.querySelector("#studentId").value = "";
  document.querySelector("#studentFormTitle").textContent = "Create student";
}

async function showClassDetail(classId) {
  try {
    const detail = await api(`/api/classes/${classId}`);
    const students = detail.students.length
      ? `<ul class="student-list">${detail.students
          .map((s) => `<li>${s.student_code} - ${s.full_name}</li>`)
          .join("")}</ul>`
      : "<p>No students assigned yet.</p>";

    el.classDetail.innerHTML = `
      <h3>${detail.class_name} (${detail.class_code})</h3>
      <p><strong>Teacher:</strong> ${detail.teacher_name || "Unassigned"}</p>
      <p><strong>Subjects:</strong> ${detail.subjects || "-"}</p>
      <p><strong>Schedule:</strong> ${detail.schedule_days || "-"} ${detail.schedule_time || ""}</p>
      <p><strong>Room:</strong> ${detail.room || "-"}</p>
      <h4>Students (${detail.students.length})</h4>
      ${students}
    `;
  } catch (error) {
    showStatus(error.message, "error");
  }
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((x) => x.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#panel-${tab.dataset.tab}`).classList.add("active");
  });
});

el.apiBaseUrl.value = apiBaseUrl;
el.saveApiBtn.addEventListener("click", () => {
  const value = el.apiBaseUrl.value.trim().replace(/\/$/, "");
  if (!value) {
    showStatus("Please enter a valid API URL.", "error");
    return;
  }

  apiBaseUrl = value;
  localStorage.setItem("apiBaseUrl", value);
  clearStatus();
  loadAll();
});

document.querySelector("#classForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const classId = document.querySelector("#classId").value;

  const payload = {
    class_code: document.querySelector("#classCode").value.trim(),
    class_name: document.querySelector("#className").value.trim(),
    subjects: document.querySelector("#classSubjects").value.trim(),
    schedule_days: document.querySelector("#classDays").value.trim(),
    schedule_time: document.querySelector("#classTime").value.trim(),
    room: document.querySelector("#classRoom").value.trim(),
    status: document.querySelector("#classStatus").value
  };

  try {
    if (classId) {
      await api(`/api/classes/${classId}`, { method: "PUT", body: JSON.stringify(payload) });
      showStatus("Class updated.");
    } else {
      await api("/api/classes", { method: "POST", body: JSON.stringify(payload) });
      showStatus("Class created.");
    }

    resetClassForm();
    loadAll();
  } catch (error) {
    showStatus(error.message, "error");
  }
});

document.querySelector("#teacherForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const teacherId = document.querySelector("#teacherId").value;

  const payload = {
    teacher_code: document.querySelector("#teacherCode").value.trim(),
    full_name: document.querySelector("#teacherName").value.trim(),
    email: document.querySelector("#teacherEmail").value.trim(),
    phone: document.querySelector("#teacherPhone").value.trim(),
    subject_specialty: document.querySelector("#teacherSpecialty").value.trim(),
    class_id: document.querySelector("#teacherClassId").value || null,
    join_date: document.querySelector("#teacherJoinDate").value || null,
    status: document.querySelector("#teacherStatus").value
  };

  try {
    if (teacherId) {
      await api(`/api/teachers/${teacherId}`, { method: "PUT", body: JSON.stringify(payload) });
      showStatus("Teacher updated.");
    } else {
      await api("/api/teachers", { method: "POST", body: JSON.stringify(payload) });
      showStatus("Teacher created.");
    }

    resetTeacherForm();
    loadAll();
  } catch (error) {
    showStatus(error.message, "error");
  }
});

document.querySelector("#studentClassId").addEventListener("change", async (event) => {
  const classId = event.target.value;
  if (!classId) {
    return;
  }

  try {
    const nextCode = await api(`/api/students/next-code/${classId}`);
    document.querySelector("#studentCode").value = nextCode.student_code;
  } catch {
    document.querySelector("#studentCode").value = "";
  }
});

document.querySelector("#studentForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const studentId = document.querySelector("#studentId").value;

  const payload = {
    student_code: document.querySelector("#studentCode").value.trim(),
    full_name: document.querySelector("#studentName").value.trim(),
    gender: document.querySelector("#studentGender").value || null,
    age: Number(document.querySelector("#studentAge").value) || null,
    class_id: document.querySelector("#studentClassId").value,
    guardian_name: document.querySelector("#guardianName").value.trim(),
    guardian_phone: document.querySelector("#guardianPhone").value.trim(),
    guardian_email: document.querySelector("#guardianEmail").value.trim(),
    enrolment_date: document.querySelector("#enrolmentDate").value || null,
    status: document.querySelector("#studentStatus").value
  };

  try {
    if (studentId) {
      await api(`/api/students/${studentId}`, { method: "PUT", body: JSON.stringify(payload) });
      showStatus("Student updated.");
    } else {
      await api("/api/students", { method: "POST", body: JSON.stringify(payload) });
      showStatus("Student created.");
    }

    resetStudentForm();
    loadAll();
  } catch (error) {
    showStatus(error.message, "error");
  }
});

document.querySelector("#classRows").addEventListener("click", async (event) => {
  const classIdShow = event.target.getAttribute("data-class-show");
  if (classIdShow) {
    await showClassDetail(classIdShow);
    return;
  }

  const classIdEdit = event.target.getAttribute("data-class-edit");
  if (classIdEdit) {
    const row = state.classes.find((item) => item.class_id === classIdEdit);
    if (!row) {
      return;
    }

    document.querySelector("#classFormTitle").textContent = "Edit class";
    document.querySelector("#classId").value = row.class_id;
    document.querySelector("#classCode").value = row.class_code || "";
    document.querySelector("#className").value = row.class_name || "";
    document.querySelector("#classSubjects").value = row.subjects || "";
    document.querySelector("#classDays").value = row.schedule_days || "";
    document.querySelector("#classTime").value = row.schedule_time || "";
    document.querySelector("#classRoom").value = row.room || "";
    document.querySelector("#classStatus").value = row.status || "Active";
    return;
  }

  const classIdDelete = event.target.getAttribute("data-class-delete");
  if (classIdDelete) {
    const ok = window.confirm("Delete this class?");
    if (!ok) {
      return;
    }

    try {
      await api(`/api/classes/${classIdDelete}`, { method: "DELETE" });
      showStatus("Class deleted.");
      loadAll();
    } catch (error) {
      showStatus(error.message, "error");
    }
  }
});

document.querySelector("#teacherRows").addEventListener("click", async (event) => {
  const teacherIdEdit = event.target.getAttribute("data-teacher-edit");
  if (teacherIdEdit) {
    const row = state.teachers.find((item) => item.teacher_id === teacherIdEdit);
    if (!row) {
      return;
    }

    document.querySelector("#teacherFormTitle").textContent = "Edit teacher";
    document.querySelector("#teacherId").value = row.teacher_id;
    document.querySelector("#teacherCode").value = row.teacher_code || "";
    document.querySelector("#teacherName").value = row.full_name || "";
    document.querySelector("#teacherEmail").value = row.email || "";
    document.querySelector("#teacherPhone").value = row.phone || "";
    document.querySelector("#teacherSpecialty").value = row.subject_specialty || "";
    document.querySelector("#teacherClassId").value = row.class_id || "";
    document.querySelector("#teacherJoinDate").value = row.join_date ? row.join_date.slice(0, 10) : "";
    document.querySelector("#teacherStatus").value = row.status || "Active";
    return;
  }

  const teacherIdDelete = event.target.getAttribute("data-teacher-delete");
  if (teacherIdDelete) {
    const ok = window.confirm("Delete this teacher? Classes will be unassigned.");
    if (!ok) {
      return;
    }

    try {
      await api(`/api/teachers/${teacherIdDelete}`, { method: "DELETE" });
      showStatus("Teacher deleted and class unassigned.");
      loadAll();
    } catch (error) {
      showStatus(error.message, "error");
    }
  }
});

document.querySelector("#studentRows").addEventListener("click", async (event) => {
  const studentIdEdit = event.target.getAttribute("data-student-edit");
  if (studentIdEdit) {
    const row = state.students.find((item) => item.student_id === studentIdEdit);
    if (!row) {
      return;
    }

    document.querySelector("#studentFormTitle").textContent = "Edit student";
    document.querySelector("#studentId").value = row.student_id;
    document.querySelector("#studentClassId").value = row.class_id;
    document.querySelector("#studentCode").value = row.student_code || "";
    document.querySelector("#studentName").value = row.full_name || "";
    document.querySelector("#studentGender").value = row.gender || "";
    document.querySelector("#studentAge").value = row.age || "";
    document.querySelector("#guardianName").value = row.guardian_name || "";
    document.querySelector("#guardianPhone").value = row.guardian_phone || "";
    document.querySelector("#guardianEmail").value = row.guardian_email || "";
    document.querySelector("#enrolmentDate").value = row.enrolment_date ? row.enrolment_date.slice(0, 10) : "";
    document.querySelector("#studentStatus").value = row.status || "Active";
    return;
  }

  const studentIdDelete = event.target.getAttribute("data-student-delete");
  if (studentIdDelete) {
    const ok = window.confirm("Delete this student?");
    if (!ok) {
      return;
    }

    try {
      await api(`/api/students/${studentIdDelete}`, { method: "DELETE" });
      showStatus("Student deleted.");
      loadAll();
    } catch (error) {
      showStatus(error.message, "error");
    }
  }
});

el.classSearch.addEventListener("input", renderClasses);
el.teacherSearch.addEventListener("input", renderTeachers);
el.studentSearch.addEventListener("input", renderStudents);
el.studentClassFilter.addEventListener("change", renderStudents);

document.querySelector("#classReset").addEventListener("click", resetClassForm);
document.querySelector("#teacherReset").addEventListener("click", resetTeacherForm);
document.querySelector("#studentReset").addEventListener("click", resetStudentForm);

loadAll();
