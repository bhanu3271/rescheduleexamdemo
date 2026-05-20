// ===========================
// LOAD SUBJECTS
// ===========================

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

    // =========================
    // GROUP SUBJECTS
    // =========================

    const groupedSubjects = {};

    data.forEach(subject => {

      const code = subject.paper_cd;

      if (!groupedSubjects[code]) {

        groupedSubjects[code] = {
          paper_cd: subject.paper_cd,
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

      // UNIQUE DATES
      const uniqueDates =
        [...new Set(
          subject.slots.map(
            s => s.exam_date
          )
        )];

      // UNIQUE TIMES
      const uniqueTimes =
        [...new Set(
          subject.slots.map(
            s => s.exam_time
          )
        )];

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

            <!-- DATE DROPDOWN -->

            <div class="sub-field">

              <label>
                Exam Date
              </label>

              <select
                class="exam-date"
                data-code="${subject.paper_cd}"
                data-name="${subject.course_name}"
              >

                <option value="">
                  Select Date
                </option>

                ${uniqueDates.map(date => `

                  <option value="${date}">
                    ${date}
                  </option>

                `).join('')}

              </select>

            </div>

            <!-- TIME DROPDOWN -->

            <div class="sub-field">

              <label>
                Exam Time
              </label>

              <select
                class="exam-time"
                data-code="${subject.paper_cd}"
                data-name="${subject.course_name}"
              >

                <option value="">
                  Select Time
                </option>

                ${uniqueTimes.map(time => `

                  <option value="${time}">
                    ${time}
                  </option>

                `).join('')}

              </select>

            </div>

          </div>

        </div>
      `;
    });

    subjectsSection.classList.remove(
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
