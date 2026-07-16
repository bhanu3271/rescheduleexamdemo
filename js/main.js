// ======================================
// INPUT ELEMENTS
// ======================================

const mentorNameInput = document.getElementById("mentorName");
const learnerNameInput = document.getElementById("learnerName");
const rollNoInput = document.getElementById("rollNo");

const programSelect = document.getElementById("program");
const semesterSelect = document.getElementById("semester");

const loadSubjectsBtn = document.getElementById("loadSubjectsBtn");

const subjectsSection = document.getElementById("subjectsSection");
const subjectsContainer = document.getElementById("subjectsContainer");

const reviewSection = document.getElementById("reviewSection");

const scheduleForm = document.getElementById("scheduleForm");

const submitBtn = document.getElementById("submitBtn");

const successMsg = document.getElementById("successMsg");
const successDetail = document.getElementById("successDetail");


// ======================================
// GOOGLE SHEETS WEB APP URL
// ======================================

const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwoBA2hMTxPPCz_YpxepMCYZeiUXFCzTToNNwtKq9fJ3d9I-l53Yq3gspoeLYRnVHFk/exec";


// ======================================
// LOAD PROGRAMS
// ======================================

async function loadPrograms() {

  try {

    const { data, error } = await supabaseClient
      .from("exam_schedule")
      .select("program")
      .order("program");

    if (error) throw error;

    const uniquePrograms = [
      ...new Set(
        data
          .map(item => item.program)
          .filter(Boolean)
      )
    ];

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

  catch (err) {

    console.error(
      "Program Load Error:",
      err.message
    );

  }

}

loadPrograms();


// ======================================
// LOAD SEMESTERS
// ======================================

programSelect.addEventListener(

  "change",

  async () => {

    const selectedProgram = programSelect.value;

    semesterSelect.innerHTML =
      '<option value="">Loading...</option>';

    try {

      const { data, error } = await supabaseClient
        .from("exam_schedule")
        .select("semester")
        .eq("program", selectedProgram)
        .order("semester");

      if (error) throw error;

      const uniqueSemesters = [
        ...new Set(
          data
            .map(item => item.semester)
            .filter(Boolean)
        )
      ];

      semesterSelect.innerHTML =
        '<option value="">-- Select Semester --</option>';

      uniqueSemesters.forEach(semester => {

        semesterSelect.innerHTML += `
          <option value="${semester}">
            Semester ${semester}
          </option>
        `;

      });

    }

    catch (err) {

      console.error(
        "Semester Load Error:",
        err.message
      );

      semesterSelect.innerHTML =
        '<option value="">Error Loading</option>';

    }

  }

);


// ======================================
// LOAD PAPER CODES
// ======================================

async function loadSubjects() {

  const selectedProgram = programSelect.value;
  const selectedSemester = semesterSelect.value;

  if (!selectedProgram || !selectedSemester) {

    alert("Please select Program and Semester.");
    return;

  }

  subjectsContainer.innerHTML = `
      <p>Loading Paper Codes...</p>
  `;

  try {

    const { data, error } = await supabaseClient
      .from("exam_schedule")
      .select("*")
      .eq("program", selectedProgram)
      .eq("semester", selectedSemester);

    if (error) throw error;

    subjectsContainer.innerHTML = "";

    if (!data.length) {

      subjectsContainer.innerHTML = `
      <div class="empty-msg">
      No Paper Codes Found.
      </div>
      `;

      return;

    }

    // GROUP PAPER CODES

    const groupedSubjects = {};

    data.forEach(subject => {

      const code = subject.paper_code;

      if (!groupedSubjects[code]) {

        groupedSubjects[code] = {

          paper_code: subject.paper_code,
          slots: []

        };

      }

      groupedSubjects[code].slots.push({

        exam_date: subject.exam_date,
        exam_time: subject.exam_time

      });

    });


    // ======================================
    // RENDER PAPER CODES
    // ======================================

    Object.values(groupedSubjects)
      .forEach((subject, index) => {

        const slotOptions = subject.slots.map(slot => {

          return `
            <option value="${slot.exam_date}|${slot.exam_time}">
            ${slot.exam_date} - ${slot.exam_time}
            </option>
          `;

        }).join("");

        subjectsContainer.innerHTML += `

        <div class="subject-card">

          <div class="sub-header">

            <div class="sub-index">
            ${index + 1}
            </div>

            <div class="sub-info">

              <div class="sub-code">
              ${subject.paper_code}
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
              data-code="${subject.paper_code}">

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

    subjectsSection.classList.remove("hidden");
    reviewSection.classList.remove("hidden");

    subjectsSection.scrollIntoView({
      behavior: "smooth"
    });

  }

  catch (err) {

    console.error(
      "Subject Load Error:",
      err.message
    );

    alert(
      "Error loading Paper Codes."
    );

  }

}

loadSubjectsBtn.addEventListener(
  "click",
  loadSubjects
);


// ======================================
// COLLECT FORM DATA
// ======================================

function collectFormData() {

  const examSlots =
    document.querySelectorAll(".exam-slot");

  const rows = [];

  examSlots.forEach(slot => {

    if (!slot.value) return;

    const values =
      slot.value.split("|");

    rows.push({

      mentor_name:
        mentorNameInput.value.trim(),

      learner_name:
        learnerNameInput.value.trim(),

      roll_no:
        rollNoInput.value.trim(),

      program:
        programSelect.value,

      semester:
        semesterSelect.value,

      paper_code:
        slot.dataset.code,

      exam_date:
        values[0],

      exam_time:
        values[1]

    });

  });

  return rows;

}


// ======================================
// SUBMIT FORM
// ======================================

scheduleForm.addEventListener(

  "submit",

  async (e) => {

    e.preventDefault();

    // VALIDATION

    if (

      mentorNameInput.value.trim() === "" ||
      learnerNameInput.value.trim() === "" ||
      rollNoInput.value.trim() === "" ||
      programSelect.value === "" ||
      semesterSelect.value === ""

    ) {

      alert(
        "Please fill all mandatory fields."
      );

      return;

    }

   const rows = collectFormData();

// At least one subject must be selected

if (rows.length === 0) {

    alert("Please select at least one exam slot.");

    return;

}

    submitBtn.disabled = true;

    submitBtn.innerHTML = `
      <i class="fas fa-spinner fa-spin"></i>
      Submitting...
    `;

    try {

      await fetch(

        GOOGLE_SCRIPT_URL,

        {

          method: "POST",

          mode: "no-cors",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(rows)

        }

      );

      successMsg.classList.remove("hidden");

      successDetail.textContent =
        "Your reschedule request has been submitted successfully.";

      // RESET FORM

      scheduleForm.reset();

      programSelect.innerHTML =
        '<option value="">-- Select Program --</option>';

      semesterSelect.innerHTML =
        '<option value="">-- Select Semester --</option>';

      subjectsContainer.innerHTML = "";

      subjectsSection.classList.add("hidden");
      reviewSection.classList.add("hidden");

      // Reload Programs

      loadPrograms();

      successMsg.scrollIntoView({
        behavior: "smooth"
      });

    }

    catch (err) {

      console.error(
        "Submit Error:",
        err.message
      );

      alert(
        "Error submitting the request."
      );

    }

    finally {

      submitBtn.disabled = false;

      submitBtn.innerHTML = `
        <i class="fas fa-paper-plane"></i>
        Submit Request
      `;

    }

  }

);
