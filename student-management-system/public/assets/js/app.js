// public/assets/js/app.js
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

const api = {
  async req(url, { method="GET", body } = {}) {
    const headers = {
      "Content-Type": "application/json",
      "X-CSRF-Token": window.SMS_CSRF || ""
    };
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      const msg = data.error || `Request failed (${res.status})`;
      throw new Error(msg);
    }
    return data;
  }
};

function toast(message, type="good", detail="") {
  const host = $("#toastHost");
  if (!host) return;
  const el = document.createElement("div");
  el.className = `toast ${type === "bad" ? "bad" : "good"}`;
  el.innerHTML = `<div><strong>${escapeHtml(message)}</strong></div>${detail ? `<small>${escapeHtml(detail)}</small>` : ""}`;
  host.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(6px)";
    setTimeout(() => el.remove(), 220);
  }, 2800);
}

function modal({ title, bodyHtml, onConfirm, confirmText="Save", danger=false }) {
  const host = $("#modalHost");
  const wrap = document.createElement("div");
  wrap.className = "modal-backdrop";
  wrap.innerHTML = `
    <div class="modal">
      <div class="head">
        <strong>${escapeHtml(title)}</strong>
        <button class="btn ghost" data-close>✕</button>
      </div>
      <div class="content">${bodyHtml}</div>
      <div class="actions">
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn ${danger ? "danger" : "primary"}" data-ok>${escapeHtml(confirmText)}</button>
      </div>
    </div>
  `;
  host.appendChild(wrap);

  const close = () => wrap.remove();
  $$("[data-close]", wrap).forEach(b => b.addEventListener("click", close));
  wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });

  $("[data-ok]", wrap).addEventListener("click", async () => {
    try { await onConfirm?.(wrap); close(); } catch (e) { toast("Action failed", "bad", e.message); }
  });

  return wrap;
}

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

/* ---------------- Auth page ---------------- */
(async function initAuth(){
  const loginForm = $("#loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(loginForm);
    const email = fd.get("email");
    const password = fd.get("password");
    try {
      const out = await api.req("../api/auth.php", { method:"POST", body:{ email, password } });
      toast("Welcome back!", "good", "Redirecting...");
      setTimeout(() => window.location.href = out.redirect, 450);
    } catch (err) {
      toast("Login failed", "bad", err.message);
    }
  });
})();

/* ---------------- Dashboard SPA views ---------------- */
(async function initDashboard(){
  const host = $("#viewHost");
  if (!host) return;

  // Clock chip
  const clockChip = $("#clockChip");
  if (clockChip) {
    setInterval(() => {
      const d = new Date();
      clockChip.textContent = d.toLocaleString();
    }, 1000);
  }

  // Keyboard shortcut CTRL+K focuses search
  const globalSearch = $("#globalSearch");
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      globalSearch?.focus();
    }
  });

  // Nav
  const navItems = $$(".nav-item");
  navItems.forEach(btn => btn.addEventListener("click", () => go(btn.dataset.view)));

  // Live filtering search (per view)
  globalSearch?.addEventListener("input", () => {
    const view = host.dataset.view;
    if (view === "students") renderStudents(globalSearch.value.trim());
    if (view === "subjects") renderSubjects(globalSearch.value.trim());
  });

  // Initial
  await go("home");

  async function go(view) {
    // active
    navItems.forEach(b => b.classList.toggle("active", b.dataset.view === view));

    // animate old view out
    const current = $(".view", host);
    if (current) {
      current.classList.add("leaving");
      await sleep(140);
    }

    host.dataset.view = view;
    if (view === "home") return renderHome();
    if (view === "students") return renderStudents("");
    if (view === "subjects") return renderSubjects("");
    if (view === "grades") return renderGrades();
  }

  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  /* ---------------- HOME ---------------- */
  async function renderHome() {
    host.innerHTML = `<div class="view">
      <div class="grid">
        <div class="panel third"><h3>Total Students</h3><div class="big" id="cStudents">—</div></div>
        <div class="panel third"><h3>Total Subjects</h3><div class="big" id="cSubjects">—</div></div>
        <div class="panel third"><h3>Total Grades</h3><div class="big" id="cGrades">—</div></div>

        <div class="panel half">
          <div class="row space">
            <h3>Recent Grades</h3>
            <span class="badge ok">Auto-refresh</span>
          </div>
          <table class="table" id="recentTable">
            <thead><tr><th>Student</th><th>Subject</th><th>Grade</th><th>Time</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>

        <div class="panel half">
          <h3>Quick Actions</h3>
          <div class="row">
            <button class="btn primary" id="qaStudent">+ Add Student</button>
            <button class="btn primary" id="qaSubject">+ Add Subject</button>
            <button class="btn primary" id="qaGrade">+ Add Grade</button>
          </div>
          <hr class="sep" />
          <div class="pill">
            Tip: Use <strong>CTRL + K</strong> to jump into search. Your CRUD is secured with session + CSRF.
          </div>
        </div>
      </div>
    </div>`;

    const load = async () => {
      const out = await api.req("../api/grades.php?mode=overview");
      $("#cStudents").textContent = out.counts.students;
      $("#cSubjects").textContent = out.counts.subjects;
      $("#cGrades").textContent = out.counts.grades;

      const tb = $("#recentTable tbody");
      tb.innerHTML = out.recent.map(r => `
        <tr>
          <td>${escapeHtml(r.full_name)} <span class="muted">(${escapeHtml(r.student_code)})</span></td>
          <td>${escapeHtml(r.subject_title)}</td>
          <td><span class="badge ok">${escapeHtml(r.grade)}</span></td>
          <td class="muted">${escapeHtml(new Date(r.created_at).toLocaleString())}</td>
        </tr>
      `).join("") || `<tr><td colspan="4" class="muted">No grades yet.</td></tr>`;
    };

    await load();
    setTimeout(load, 2500);

    $("#qaStudent").addEventListener("click", () => openStudentModal());
    $("#qaSubject").addEventListener("click", () => openSubjectModal());
    $("#qaGrade").addEventListener("click", () => openGradeModal());
  }

  /* ---------------- STUDENTS ---------------- */
  async function renderStudents(q) {
    const out = await api.req("../api/students.php" + (q ? `?q=${encodeURIComponent(q)}` : ""));
    const rows = out.data;

    host.innerHTML = `<div class="view">
      <div class="panel">
        <div class="row space">
          <div>
            <h3>Students</h3>
            <div class="muted">Manage students (CRUD), status, and contact details.</div>
          </div>
          <div class="toolbar">
            <button class="btn primary" id="addStudent">+ New Student</button>
            <span class="badge">${rows.length} records</span>
          </div>
        </div>

        <hr class="sep" />

        <table class="table">
          <thead>
            <tr>
              <th>Code</th><th>Full name</th><th>Email</th><th>Phone</th><th>Level</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(s => `
              <tr>
                <td><strong>${escapeHtml(s.student_code)}</strong></td>
                <td>${escapeHtml(s.full_name)}</td>
                <td class="muted">${escapeHtml(s.email || "")}</td>
                <td class="muted">${escapeHtml(s.phone || "")}</td>
                <td class="muted">${escapeHtml(s.level || "")}</td>
                <td>${s.status === "ACTIVE"
                  ? `<span class="badge ok">ACTIVE</span>`
                  : `<span class="badge off">INACTIVE</span>`}
                </td>
                <td>
                  <button class="btn ghost" data-edit='${escapeHtml(JSON.stringify(s))}'>Edit</button>
                  <button class="btn danger" data-del="${s.id}">Delete</button>
                </td>
              </tr>
            `).join("") || `<tr><td colspan="7" class="muted">No students yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`;

    $("#addStudent").addEventListener("click", () => openStudentModal());

    $$("[data-edit]").forEach(btn => btn.addEventListener("click", () => {
      const s = JSON.parse(btn.getAttribute("data-edit"));
      openStudentModal(s);
    }));

    $$("[data-del]").forEach(btn => btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-del"));
      confirmDeleteStudent(id);
    }));
  }

  function openStudentModal(s=null){
    const isEdit = !!s;
    const body = `
      <form class="form" id="studentForm">
        ${isEdit ? "" : `<label>Student Code</label><input name="student_code" required placeholder="STU-2025-001" />`}
        <label>Full Name</label><input name="full_name" required placeholder="Full name" value="${escapeHtml(s?.full_name||"")}" />
        <label>Email</label><input name="email" type="email" placeholder="optional" value="${escapeHtml(s?.email||"")}" />
        <label>Phone</label><input name="phone" placeholder="optional" value="${escapeHtml(s?.phone||"")}" />
        <label>Level</label><input name="level" placeholder="e.g. L1 / L2 / Master" value="${escapeHtml(s?.level||"")}" />
        <label>Status</label>
        <select name="status" class="pill">
          <option value="ACTIVE" ${s?.status==="ACTIVE"?"selected":""}>ACTIVE</option>
          <option value="INACTIVE" ${s?.status==="INACTIVE"?"selected":""}>INACTIVE</option>
        </select>
      </form>
    `;

    modal({
      title: isEdit ? "Edit Student" : "Add Student",
      bodyHtml: body,
      confirmText: isEdit ? "Update" : "Create",
      onConfirm: async (wrap) => {
        const form = $("#studentForm", wrap);
        const fd = new FormData(form);
        const payload = Object.fromEntries(fd.entries());

        if (isEdit) {
          payload.id = s.id;
          await api.req("../api/students.php", { method:"PUT", body: payload });
          toast("Student updated", "good");
        } else {
          await api.req("../api/students.php", { method:"POST", body: payload });
          toast("Student created", "good");
        }
        renderStudents($("#globalSearch")?.value?.trim() || "");
      }
    });
  }

  function confirmDeleteStudent(id){
    modal({
      title: "Delete Student",
      bodyHtml: `<div class="pill">This will also delete related grades. Continue?</div>`,
      confirmText: "Delete",
      danger: true,
      onConfirm: async () => {
        await api.req("../api/students.php", { method:"DELETE", body:{ id } });
        toast("Student deleted", "good");
        renderStudents($("#globalSearch")?.value?.trim() || "");
      }
    });
  }

  /* ---------------- SUBJECTS ---------------- */
  async function renderSubjects(q) {
    const out = await api.req("../api/subjects.php" + (q ? `?q=${encodeURIComponent(q)}` : ""));
    const rows = out.data;

    host.innerHTML = `<div class="view">
      <div class="panel">
        <div class="row space">
          <div>
            <h3>Subjects</h3>
            <div class="muted">Manage subjects and coefficients.</div>
          </div>
          <div class="toolbar">
            <button class="btn primary" id="addSubject">+ New Subject</button>
            <span class="badge">${rows.length} records</span>
          </div>
        </div>

        <hr class="sep" />

        <table class="table">
          <thead>
            <tr><th>Code</th><th>Title</th><th>Coefficient</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${rows.map(s => `
              <tr>
                <td><strong>${escapeHtml(s.code)}</strong></td>
                <td>${escapeHtml(s.title)}</td>
                <td><span class="badge">${escapeHtml(s.coefficient)}</span></td>
                <td>
                  <button class="btn ghost" data-edit='${escapeHtml(JSON.stringify(s))}'>Edit</button>
                  <button class="btn danger" data-del="${s.id}">Delete</button>
                </td>
              </tr>
            `).join("") || `<tr><td colspan="4" class="muted">No subjects yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`;

    $("#addSubject").addEventListener("click", () => openSubjectModal());
    $$("[data-edit]").forEach(btn => btn.addEventListener("click", () => {
      const s = JSON.parse(btn.getAttribute("data-edit"));
      openSubjectModal(s);
    }));
    $$("[data-del]").forEach(btn => btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-del"));
      confirmDeleteSubject(id);
    }));
  }

  function openSubjectModal(s=null){
    const isEdit = !!s;
    const body = `
      <form class="form" id="subjectForm">
        ${isEdit ? "" : `<label>Subject Code</label><input name="code" required placeholder="MAT101" />`}
        <label>Title</label><input name="title" required placeholder="Subject title" value="${escapeHtml(s?.title||"")}" />
        <label>Coefficient</label><input name="coefficient" type="number" step="0.01" value="${escapeHtml(s?.coefficient ?? 1)}" />
      </form>
    `;

    modal({
      title: isEdit ? "Edit Subject" : "Add Subject",
      bodyHtml: body,
      confirmText: isEdit ? "Update" : "Create",
      onConfirm: async (wrap) => {
        const fd = new FormData($("#subjectForm", wrap));
        const payload = Object.fromEntries(fd.entries());
        payload.coefficient = Number(payload.coefficient || 1);

        if (isEdit) {
          payload.id = s.id;
          await api.req("../api/subjects.php", { method:"PUT", body: payload });
          toast("Subject updated", "good");
        } else {
          await api.req("../api/subjects.php", { method:"POST", body: payload });
          toast("Subject created", "good");
        }
        renderSubjects($("#globalSearch")?.value?.trim() || "");
      }
    });
  }

  function confirmDeleteSubject(id){
    modal({
      title: "Delete Subject",
      bodyHtml: `<div class="pill">Grades linked to this subject will also be removed. Continue?</div>`,
      confirmText: "Delete",
      danger: true,
      onConfirm: async () => {
        await api.req("../api/subjects.php", { method:"DELETE", body:{ id } });
        toast("Subject deleted", "good");
        renderSubjects($("#globalSearch")?.value?.trim() || "");
      }
    });
  }

  /* ---------------- GRADES ---------------- */
  async function renderGrades() {
    const [gradesOut, studentsOut, subjectsOut] = await Promise.all([
      api.req("../api/grades.php"),
      api.req("../api/students.php"),
      api.req("../api/subjects.php")
    ]);

    const grades = gradesOut.data;
    const students = studentsOut.data;
    const subjects = subjectsOut.data;

    host.innerHTML = `<div class="view">
      <div class="panel">
        <div class="row space">
          <div>
            <h3>Grades</h3>
            <div class="muted">Assign/update grades (0–20). Duplicate pairs update automatically.</div>
          </div>
          <div class="toolbar">
            <button class="btn primary" id="addGrade">+ Add / Update Grade</button>
            <span class="badge">${grades.length} records</span>
          </div>
        </div>

        <hr class="sep" />

        <table class="table">
          <thead>
            <tr><th>Student</th><th>Subject</th><th>Grade</th><th>Note</th><th>Time</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${grades.map(g => `
              <tr>
                <td>${escapeHtml(g.full_name)} <span class="muted">(${escapeHtml(g.student_code)})</span></td>
                <td>${escapeHtml(g.subject_title)} <span class="muted">(${escapeHtml(g.subject_code)})</span></td>
                <td><span class="badge ok">${escapeHtml(g.grade)}</span></td>
                <td class="muted">${escapeHtml(g.note || "")}</td>
                <td class="muted">${escapeHtml(new Date(g.created_at).toLocaleString())}</td>
                <td><button class="btn danger" data-del="${g.id}">Delete</button></td>
              </tr>
            `).join("") || `<tr><td colspan="6" class="muted">No grades yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`;

    $("#addGrade").addEventListener("click", () => openGradeModal(null, students, subjects));

    $$("[data-del]").forEach(btn => btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-del"));
      modal({
        title: "Delete Grade",
        bodyHtml: `<div class="pill">Delete this grade record?</div>`,
        confirmText: "Delete",
        danger: true,
        onConfirm: async () => {
          await api.req("../api/grades.php", { method:"DELETE", body:{ id } });
          toast("Grade deleted", "good");
          renderGrades();
        }
      });
    }));
  }

  async function openGradeModal(_, students=null, subjects=null){
    if (!students || !subjects) {
      const [sOut, subOut] = await Promise.all([api.req("../api/students.php"), api.req("../api/subjects.php")]);
      students = sOut.data; subjects = subOut.data;
    }

    const body = `
      <form class="form" id="gradeForm">
        <label>Student</label>
        <select name="student_id" class="pill" required>
          <option value="">Select student</option>
          ${students.map(s => `<option value="${s.id}">${escapeHtml(s.full_name)} (${escapeHtml(s.student_code)})</option>`).join("")}
        </select>

        <label>Subject</label>
        <select name="subject_id" class="pill" required>
          <option value="">Select subject</option>
          ${subjects.map(s => `<option value="${s.id}">${escapeHtml(s.title)} (${escapeHtml(s.code)})</option>`).join("")}
        </select>

        <label>Grade (0–20)</label>
        <input name="grade" type="number" step="0.01" min="0" max="20" required placeholder="e.g. 14.5" />

        <label>Note (optional)</label>
        <input name="note" placeholder="e.g. Excellent progress" />
      </form>
      <div class="pill" style="margin-top:10px;">
        If the same student+subject already exists, it will be <strong>updated</strong> automatically.
      </div>
    `;

    modal({
      title: "Add / Update Grade",
      bodyHtml: body,
      confirmText: "Save",
      onConfirm: async (wrap) => {
        const fd = new FormData($("#gradeForm", wrap));
        const payload = Object.fromEntries(fd.entries());
        payload.student_id = Number(payload.student_id);
        payload.subject_id = Number(payload.subject_id);
        payload.grade = Number(payload.grade);

        await api.req("../api/grades.php", { method:"POST", body: payload });
        toast("Grade saved", "good");
        renderGrades();
      }
    });
  }
})();
