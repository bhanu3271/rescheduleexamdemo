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


// ======================================
// GOOGLE SHEET WEB APP URL
// ======================================

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyKDIe3okOov2kQSSwjVVTOEvpp_dcSZ_RnG8Dj_PJw6qcUJFu2hTYQu8X2E2dPW35z/exec";


// ======================================
// LOAD PROGRAMS
// ======================================

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


// ======================================
// LOAD SEMESTERS
// ======================================

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


// ======================================
// LOAD SUBJECTS
// ======================================

async function loadSubjects() {

  const selectedProgram =
    programSelect.value;

  const selectedSemester =
    semesterSelect.value;

  if (!selectedProgram ||
      !selectedSemester) {

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

    // ======================================
    // GROUP SUBJECTS
    // ======================================

    const groupedSubjects = {};

    data.forEach(subject => {

      const code = subject.paper_cd;

      if (!groupedSubjects[code]) {

        groupedSubjects[code] = {

          paper_cd:
            subject.paper_cd,

          course_name:
            subject.course_name,

          slots: []
        };
      }

      groupedSubjects[code].slots.push({

        exam_date:
          subject.exam_date,

        exam_time:
          subject.examtime
      });
    });

    // ======================================
    // RENDER SUBJECTS
    // ======================================

    Object.values(groupedSubjects)
      .forEach((subject, index) => {

      const slotOptions =
        subject.slots.map(slot => {

          return `
            <option
              value="${slot.exam_date}|${slot.exam_time}"
            >
              ${slot.exam_date}
              —
              ${slot.exam_time}
            </option>
          `;
        }).join('');

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

            <div class="sub-field">

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

                ${slotOptions}

              </select>

            </div>

          </div>

        </div>
      `;
    });

    subjectsSection.classList.remove(
      'hidden'
    );

    // SHOW REVIEW SECTION

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


// ======================================
// COLLECT FORM DATA
// ======================================

function collectFormData() {

  const examSlots =
    document.querySelectorAll(
      '.exam-slot'
    );

  const rows = [];

  examSlots.forEach(slot => {

    if (!slot.value) return;

    const values =
      slot.value.split('|');

    rows.push({

      mentor_name:
        mentorNameInput.value,

      roll_no:
        rollNoInput.value,

      crs_cd:
        programSelect.value,

      sem:
        semesterSelect.value,

      paper_cd:
        slot.dataset.code,

      course_name:
        slot.dataset.name,

      exam_date:
        values[0],

      examtime:
        values[1]
    });
  });

  return rows;
}


// ======================================
// SUBMIT FORM
// ======================================

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

      const response =
        await fetch(
          GOOGLE_SCRIPT_URL,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify(rows)
          }
        );

      if (!response.ok) {
        throw new Error(
          'Failed to save'
        );
      }

      successMsg.classList.remove(
        'hidden'
      );

      successDetail.textContent =
        `${rows.length} entries saved to Google Sheet`;

      scheduleForm.reset();

      subjectsContainer.innerHTML =
        '';

      subjectsSection.classList.add(
        'hidden'
      );

      reviewSection.classList.add(
        'hidden'
      );

      successMsg.scrollIntoView({
        behavior: 'smooth'
      });

    } catch (err) {

      console.error(
        'Submit Error:',
        err.message
      );

      alert(
        'Error saving data'
      );

    } finally {

      submitBtn.disabled = false;

      submitBtn.innerHTML = `
        <i class="fas fa-paper-plane"></i>
        Submit Schedule
      `;
    }
  }
);
