const mentorNameInput = document.getElementById('mentorName');
const rollNoInput = document.getElementById('rollNo');
const programSelect = document.getElementById('program');
const semesterSelect = document.getElementById('semester');

const loadSubjectsBtn = document.getElementById('loadSubjectsBtn');

const subjectsSection = document.getElementById('subjectsSection');
const subjectsContainer = document.getElementById('subjectsContainer');

const reviewSection = document.getElementById('reviewSection');
const reviewTableBody = document.getElementById('reviewTableBody');

const scheduleForm = document.getElementById('scheduleForm');

const submitBtn = document.getElementById('submitBtn');

const successMsg = document.getElementById('successMsg');
const successDetail = document.getElementById('successDetail');



// LOAD PROGRAMS FROM DATABASE

async function loadPrograms() {

  const { data, error } = await supabaseClient
    .from('exam_schedule_demo')
    .select('crs_cd');

  if (error) {
    console.error(error);
    return;
  }

  const uniquePrograms =
    [...new Set(data.map(item => item.crs_cd))];

  programSelect.innerHTML =
    '<option value="">-- Select Program --</option>';

  uniquePrograms.forEach(program => {

    programSelect.innerHTML += `
      <option value="${program}">
        ${program}
      </option>
    `;
  });
}

loadPrograms();



// LOAD SEMESTERS

programSelect.addEventListener('change', async () => {

  const selectedProgram = programSelect.value;

  const { data, error } = await supabaseClient
    .from('exam_schedule_demo')
    .select('sem')
    .eq('crs_cd', selectedProgram);

  if (error) {
    console.error(error);
    return;
  }

  const uniqueSemesters =
    [...new Set(data.map(item => item.sem))];

  semesterSelect.innerHTML =
    '<option value="">-- Select Semester --</option>';

  uniqueSemesters.forEach(semester => {

    semesterSelect.innerHTML += `
      <option value="${semester}">
        Semester ${semester}
      </option>
    `;
  });
});



// LOAD SUBJECTS

async function loadSubjects() {

  const selectedProgram = programSelect.value;

  const selectedSemester = semesterSelect.value;

  if (!selectedProgram || !selectedSemester) {

    alert('Please select Program and Semester');

    return;
  }

  const { data, error } = await supabaseClient
    .from('exam_schedule_demo')
    .select('*')
    .eq('crs_cd', selectedProgram)
    .eq('sem', selectedSemester);

  if (error) {
    console.error(error);
    return;
  }

  subjectsContainer.innerHTML = '';

  data.forEach((subject, index) => {

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
              ${subject["Course Name"]}
            </div>

          </div>

        </div>

        <div class="sub-inputs">

          <div class="sub-field">

            <label>Exam Date</label>

            <input
              type="date"
              class="exam-date"
              data-code="${subject.paper_cd}"
              data-name="${subject["Course Name"]}"
            >

          </div>

          <div class="sub-field">

            <label>Exam Time</label>

            <input
              type="time"
              class="exam-time"
              data-code="${subject.paper_cd}"
              data-name="${subject["Course Name"]}"
            >

          </div>

        </div>

      </div>
    `;
  });

  subjectsSection.classList.remove('hidden');

  subjectsSection.scrollIntoView({
    behavior: 'smooth'
  });
}



loadSubjectsBtn.addEventListener('click', loadSubjects);



// COLLECT FORM DATA

function collectFormData() {

  const examDates =
    document.querySelectorAll('.exam-date');

  const examTimes =
    document.querySelectorAll('.exam-time');

  const rows = [];

  for (let i = 0; i < examDates.length; i++) {

    const date = examDates[i].value;

    const time = examTimes[i].value;

    if (!date || !time) continue;

    rows.push({

      crs_cd: programSelect.value,

      sem: semesterSelect.value,

      paper_cd:
        examDates[i].dataset.code,

      "Course Name":
        examDates[i].dataset.name,

      "ExamDate(DD-MMM-YY)": date,

      examtime: time

    });
  }

  return rows;
}



// SUBMIT DATA

scheduleForm.addEventListener('submit', async (e) => {

  e.preventDefault();

  const rows = collectFormData();

  if (!rows.length) {

    alert('Please enter exam dates and times');

    return;
  }

  submitBtn.disabled = true;

  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Saving...';

  try {

    const { error } = await supabaseClient
      .from('exam_schedule_demo')
      .insert(rows);

    if (error) throw error;

    successMsg.classList.remove('hidden');

    successDetail.textContent =
      `${rows.length} schedules saved successfully`;

    successMsg.scrollIntoView({
      behavior: 'smooth'
    });

  } catch (err) {

    console.error(err);

    alert(err.message);

  } finally {

    submitBtn.disabled = false;

    submitBtn.innerHTML =
      '<i class="fas fa-paper-plane"></i> Submit Schedule';
  }
});