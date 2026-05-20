/**
 * main.js — Exam Scheduler Frontend Logic
 */

// ── DOM References ──────────────────────────────────────────────────────────
const programSel      = document.getElementById('program');
const semesterSel     = document.getElementById('semester');
const rollNoInput     = document.getElementById('rollNo');
const mentorNameInput = document.getElementById('mentorName');
const loadBtn         = document.getElementById('loadSubjectsBtn');
const subjectsGrid    = document.getElementById('subjectsGrid');
const step2           = document.getElementById('step2');
const step3           = document.getElementById('step3');
const reviewTable     = document.getElementById('reviewTable');
const submitBtn       = document.getElementById('submitBtn');
const backBtn         = document.getElementById('backBtn');
const successMsg      = document.getElementById('successMsg');
const successDetail   = document.getElementById('successDetail');
const scheduleForm    = document.getElementById('scheduleForm');

// ── Populate semesters when program changes ──────────────────────────────────
programSel.addEventListener('change', () => {
  const prog = programSel.value;
  semesterSel.innerHTML = '<option value="">-- Select Semester --</option>';
  semesterSel.disabled = true;
  loadBtn.disabled = true;

  if (prog && CURRICULUM[prog]) {
    CURRICULUM[prog].semesters.forEach(sem => {
      const opt = document.createElement('option');
      opt.value = sem;
      opt.textContent = `Semester ${sem}`;
      semesterSel.appendChild(opt);
    });
    semesterSel.disabled = false;
  }
});

// ── Enable Load button when semester selected ────────────────────────────────
semesterSel.addEventListener('change', () => {
  loadBtn.disabled = !semesterSel.value;
});

// ── Load Subjects Button ─────────────────────────────────────────────────────
loadBtn.addEventListener('click', () => {
  const roll    = rollNoInput.value.trim();
  const mentor  = mentorNameInput.value.trim();
  const prog    = programSel.value;
  const sem     = semesterSel.value;

  if (!mentor) { showError(mentorNameInput, 'Please enter mentor name.'); return; }
  if (!roll)   { showError(rollNoInput, 'Please enter roll number.'); return; }
  if (!prog)   { alert('Please select a program.'); return; }
  if (!sem)    { alert('Please select a semester.'); return; }

  clearErrors();
  renderSubjectCards(prog, parseInt(sem));
  step2.classList.remove('hidden');
  step2.scrollIntoView({ behavior: 'smooth' });
});

// ── Render subject cards ─────────────────────────────────────────────────────
function renderSubjectCards(prog, sem) {
  const subjects = CURRICULUM[prog].subjects[sem] || [];
  subjectsGrid.innerHTML = '';

  subjects.forEach((sub, idx) => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <div class="sub-header">
        <span class="sub-index">${idx + 1}</span>
        <div class="sub-info">
          <span class="sub-code">${sub.code}</span>
          <span class="sub-name">${sub.name}</span>
        </div>
      </div>
      <div class="sub-inputs">
        <div class="sub-field">
          <label><i class="fas fa-calendar-day"></i> Exam Date</label>
          <input type="date" class="exam-date" data-code="${sub.code}" data-name="${sub.name}" required />
        </div>
        <div class="sub-field">
          <label><i class="fas fa-clock"></i> Exam Time</label>
          <input type="time" class="exam-time" data-code="${sub.code}" required />
        </div>
      </div>
    `;
    subjectsGrid.appendChild(card);
  });

  // Add Review button below subjects
  let existingReviewBtn = document.getElementById('reviewBtn');
  if (!existingReviewBtn) {
    const btnWrap = document.createElement('div');
    btnWrap.className = 'btn-row';
    btnWrap.innerHTML = `<button type="button" id="reviewBtn" class="btn btn-primary">
      <i class="fas fa-eye"></i> Review &amp; Continue
    </button>`;
    step2.querySelector('.card-body').appendChild(btnWrap);
    document.getElementById('reviewBtn').addEventListener('click', doReview);
  }
}

// ── Review Step ──────────────────────────────────────────────────────────────
function doReview() {
  const rows = collectFormData();
  if (!rows) return; // validation failed

  let html = `
    <div class="review-info">
      <div><strong><i class="fas fa-id-badge"></i> Roll No:</strong> ${rows[0].roll_no}</div>
      <div><strong><i class="fas fa-graduation-cap"></i> Program:</strong> ${rows[0].program}</div>
      <div><strong><i class="fas fa-layer-group"></i> Semester:</strong> ${rows[0].semester}</div>
      <div><strong><i class="fas fa-user-tie"></i> Mentor:</strong> ${rows[0].submitted_by}</div>
    </div>
    <table class="review-tbl">
      <thead>
        <tr>
          <th>#</th>
          <th>Subject Code</th>
          <th>Subject Name</th>
          <th>Exam Date</th>
          <th>Exam Time</th>
        </tr>
      </thead>
      <tbody>
  `;
  rows.forEach((r, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td><span class="badge-code">${r.subject_code}</span></td>
      <td>${r.subject_name}</td>
      <td>${formatDate(r.exam_date)}</td>
      <td>${formatTime(r.exam_time)}</td>
    </tr>`;
  });
  html += `</tbody></table>
    <p class="review-note"><i class="fas fa-info-circle"></i> ${rows.length} subject(s) will be saved as ${rows.length} separate entries.</p>`;

  reviewTable.innerHTML = html;
  step3.classList.remove('hidden');
  step3.scrollIntoView({ behavior: 'smooth' });
}

// ── Back Button ──────────────────────────────────────────────────────────────
backBtn.addEventListener('click', () => {
  step3.classList.add('hidden');
  step2.scrollIntoView({ behavior: 'smooth' });
});

// ── Submit Form ──────────────────────────────────────────────────────────────
scheduleForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const rows = collectFormData();
  if (!rows) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';

  try {

    const formattedRows = rows.map(r => ({
      crs_cd: r.program,
      sem: r.semester,
      paper_cd: r.subject_code,
      "Course Name": r.subject_name,
      "ExamDate(DD-MMM-YY)": r.exam_date,
      examtime: r.exam_time
    }));

    const { error } = await supabaseClient
      .from('exam_schedule_demo')
      .insert(formattedRows);

    if (error) throw error;

    scheduleForm.classList.add('hidden');
    successMsg.classList.remove('hidden');

    successDetail.textContent =
      `${formattedRows.length} subject exam schedule(s) saved successfully.`;

    successMsg.scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    console.error(err);
    alert('Error submitting data:\n' + err.message);

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Schedule';
  }
});

// ── Collect form data into array of row objects ──────────────────────────────
function collectFormData() {
  const roll    = rollNoInput.value.trim();
  const mentor  = mentorNameInput.value.trim();
  const prog    = programSel.value;
  const sem     = semesterSel.value;

  const dateInputs = document.querySelectorAll('.exam-date');
  const timeInputs = document.querySelectorAll('.exam-time');

  if (dateInputs.length === 0) {
    alert('Please load subjects first.');
    return null;
  }

  let valid = true;
  const rows = [];

  dateInputs.forEach((dateEl, idx) => {
    const timeEl   = timeInputs[idx];
    const subCode  = dateEl.dataset.code;
    const subName  = dateEl.dataset.name;
    const examDate = dateEl.value;
    const examTime = timeEl.value;

    dateEl.classList.remove('input-error');
    timeEl.classList.remove('input-error');

    if (!examDate) { dateEl.classList.add('input-error'); valid = false; }
    if (!examTime) { timeEl.classList.add('input-error'); valid = false; }

    if (examDate && examTime) {
      rows.push({
        roll_no:      roll,
        program:      `${CURRICULUM[prog].label} (${prog})`,
        semester:     `Semester ${sem}`,
        subject_code: subCode,
        subject_name: subName,
        exam_date:    examDate,
        exam_time:    examTime,
        submitted_by: mentor,
        submitted_at: new Date().toISOString(),
      });
    }
  });

  if (!valid) {
    alert('Please fill in exam date and time for all subjects.');
    step2.scrollIntoView({ behavior: 'smooth' });
    return null;
  }

  return rows;
}

// ── Reset Form ────────────────────────────────────────────────────────────────
function resetForm() {
  scheduleForm.reset();
  scheduleForm.classList.remove('hidden');
  step2.classList.add('hidden');
  step3.classList.add('hidden');
  successMsg.classList.add('hidden');
  subjectsGrid.innerHTML = '';
  semesterSel.disabled = true;
  loadBtn.disabled = true;
  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Schedule';

  // Remove review button if present
  const reviewBtn = document.getElementById('reviewBtn');
  if (reviewBtn) reviewBtn.parentElement.remove();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function showError(input, msg) {
  input.classList.add('input-error');
  input.focus();
  alert(msg);
}

function clearErrors() {
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hr12 = hour % 12 || 12;
  return `${hr12}:${m} ${ampm}`;
}
