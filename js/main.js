const mentorNameInput =
  document.getElementById('mentorName');

const rollNoInput =
  document.getElementById('rollNo');

const programSelect =
  document.getElementById('program');

const semesterSelect =
  document.getElementById('semester');

const loadSubjectsBtn =
  document.getElementById('loadSubjectsBtn');

const subjectsSection =
  document.getElementById('subjectsSection');

const subjectsContainer =
  document.getElementById('subjectsContainer');

const reviewSection =
  document.getElementById('reviewSection');

const reviewTableBody =
  document.getElementById('reviewTableBody');

const scheduleForm =
  document.getElementById('scheduleForm');

const submitBtn =
  document.getElementById('submitBtn');

const successMsg =
  document.getElementById('successMsg');

const successDetail =
  document.getElementById('successDetail');



// ===========================
// LOAD PROGRAMS
// ===========================

async function loadPrograms() {

  try {

    const { data, error } =
      await supabaseClient
        .from('exam_schedule_demo')
        .select('crs_cd');

    if (error) throw error;

    const uniquePrograms =
      [...new Set(
        data
          .map(item => item.crs_cd)
          .filter(Boolean)
      )];

    programSelect.innerHTML =
      '<option value="">-- Select Program --</option>';

    uniquePrograms.forEach(program => {

      programSelect.innerHTML += `
        <option value="${program}">
          ${program}
        </option>
      `;
    });

  } catch (err) {

    console.error(
      'Program Load Error:',
      err.message
    );
  }
}

loadPrograms();



// ===========================
// LOAD SEMESTERS
// ===========================

programSelect.addEventListener(
  'change',
  async () => {

    const selectedProgram =
      programSelect.value;

    semesterSelect.innerHTML =
      '<option value="">Loading...</option>';

    try {

      const { data, error } =
        await supabaseClient
          .from('exam_schedule_demo')
          .select('sem')
          .eq('crs_cd', selectedProgram);

      if (error) throw error;

      const uniqueSemesters =
        [...new Set(
          data
            .map(item => item.sem)
            .filter(Boolean)
        )];

      semesterSelect.innerHTML =
        '<option value="">-- Select Semester --</option>';

      uniqueSemesters.forEach(semester => {

        semesterSelect.innerHTML += `
          <option value="${semester}">
            Semester ${semester}
          </option>
        `;
      });

    } catch (err) {

      console.error(
        'Semester Load Error:',
        err.message
      );

      semesterSelect.innerHTML =
        '<option value="">Error Loading</option>';
    }
  }
);



// ===========================
// LOAD SUBJECTS
// ===========================

async function loadSubjects() {

  const selectedProgram =
    programSelect.value;

  const selectedSemester =
    semesterSelect.value;

  if (
    !selectedProgram ||
    !selectedSemester
  ) {

    alert(
      'Please select Program and Semester'
    );

    return;
  }

  try {

    const { data, error } =
      await supabaseClient
        .from('exam_schedule_demo')
        .select('*')
        .eq('crs_cd', selectedProgram)
        .eq('sem', selectedSemester);

    if (error) throw error;

    subjectsContainer.innerHTML = '';

    if (!data.length) {

      subjectsContainer.innerHTML = `
        <div class="empty-msg">
          No subjects found
        </div>
      `;

      return;
    }

    // =========================
    // GROUP SUBJECTS
    // =========================

    const groupedSubjects = {};

    data.forEach(subject => {

      const code = subject.paper_cd;

      if (!groupedSubjects[code]) {

        groupedSubjects[code] = {

          paper_cd:
            subject.paper_cd,

          course_name:
            subject.course_name ||
            subject["Course Name"],

          slots: []
        };
      }

      groupedSubjects[code].slots.push({

        exam_date:
          subject.exam_date ||
          subject["ExamDate(DD-MMM-YY)"],

        exam_time:
          subject.examtime
      });
    });

    // =========================
    // RENDER SUBJECTS
    // =========================

    Object.values(groupedSubjects)
      .forEach((subject, index) => {

      // REMOVE DUPLICATES

      const uniqueSlots = [];

      const seen = new Set();

      subject.slots.forEach(slot => {

        const key =
          `${slot.exam_date}-${slot.exam_time}`;

        if (!seen.has(key)) {

          seen.add(key);

          uniqueSlots.push(slot);
        }
      });

      subjectsContainer.innerHTML += `

        <div class="subject-card">

          <div class="sub-header">

            <div class="sub-index">
              ${index + 1}
            </div>

            <div class="sub-info">

              <div class="sub-code">
                ${subject.paper_cd}
              </div>

              <div class="sub-name">
                ${subject.course_name}
              </div>

            </div>

          </div>

          <div class="sub-inputs">

            <div
              class="sub-field"
              style="width:100%;"
            >

              <label>
                Select Exam Slot
              </label>

              <select
                class="exam-slot"
                data-code="${subject.paper_cd}"
                data-name="${subject.course_name}"
              >

                <option value="">
                  Select Exam Slot
                </option>

                ${uniqueSlots.map(slot => `

                  <option
                    value="${slot.exam_date}|${slot.exam_time}"
                  >

                    ${slot.exam_date}
                    —
                    ${slot.exam_time}

                  </option>

                `).join('')}

              </select>

            </div>

          </div>

        </div>
      `;
    });

    // SHOW STEP 2

    subjectsSection.classList.remove(
      'hidden'
    );

    // SHOW STEP 3

    reviewSection.classList.remove(
      'hidden'
    );

    subjectsSection.scrollIntoView({
      behavior: 'smooth'
    });

  } catch (err) {

    console.error(
      'Subject Load Error:',
      err.message
    );

    alert(
      'Error loading subjects'
    );
  }
}



loadSubjectsBtn.addEventListener(
  'click',
  loadSubjects
);



// ===========================
// COLLECT FORM DATA
// ===========================

function collectFormData() {

  const examSlots =
    document.querySelectorAll(
      '.exam-slot'
    );

  const rows = [];

  examSlots.forEach(slot => {

    if (!slot.value) return;

    const [date, time] =
      slot.value.split('|');

    rows.push({

      crs_cd:
        programSelect.value,

      sem:
        semesterSelect.value,

      paper_cd:
        slot.dataset.code,

      course_name:
        slot.dataset.name,

      exam_date:
        date,

      examtime:
        time
    });
  });

  return rows;
}



// ===========================
// SUBMIT DATA
// ===========================

scheduleForm.addEventListener(
  'submit',
  async (e) => {

    e.preventDefault();

    const rows =
      collectFormData();

    if (!rows.length) {

      alert(
        'Please select exam slots'
      );

      return;
    }

    submitBtn.disabled = true;

    submitBtn.innerHTML = `
      <i class="fas fa-spinner fa-spin"></i>
      Saving...
    `;

    try {

      const { error } =
        await supabaseClient
          .from('exam_schedule_demo')
          .insert(rows);

      if (error)
        throw error;

      successMsg.classList.remove(
        'hidden'
      );

      successDetail.textContent =
        `${rows.length} schedules saved successfully`;

      successMsg.scrollIntoView({
        behavior: 'smooth'
      });

      scheduleForm.reset();

      subjectsContainer.innerHTML =
        '';

    } catch (err) {

      console.error(
        'Insert Error:',
        err.message
      );

      alert(err.message);

    } finally {

      submitBtn.disabled = false;

      submitBtn.innerHTML = `
        <i class="fas fa-paper-plane"></i>
        Submit Schedule
      `;
    }
  }
);
