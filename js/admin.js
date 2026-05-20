/**
 * admin.js — Admin Panel
 */

let allRecords = [];
let filteredRecs = [];

let currentPage = 1;

const PAGE_SIZE = 20;

let sortField = 'exam_date';

let sortDir = 'asc';

let deleteTargetId = null;



// LOAD DATA

document.addEventListener(
  'DOMContentLoaded',
  () => loadData(1)
);



// LOAD DATA FROM SUPABASE

async function loadData(page = 1) {

  currentPage = page;

  document.getElementById('tableBody').innerHTML = `
    <tr>
      <td colspan="10" class="no-data">
        <i class="fas fa-spinner fa-spin"></i>
        <br/>
        Loading...
      </td>
    </tr>
  `;

  try {

    const { data, error } =
      await supabaseClient
        .from('exam_schedule_demo')
        .select('*');

    if (error) throw error;

    allRecords = (data || []).map(r => ({

      id: r.id,

      mentor_name: r.mentor_name,

      roll_no: r.roll_no,

      program: r.crs_cd,

      semester: r.sem,

      subject_code: r.paper_cd,

      subject_name: r["Course Name"],

      exam_date: r["ExamDate(DD-MMM-YY)"],

      exam_time: r.examtime

    }));

    updateStats();

    populateFilters();

    applyFiltersAndSort();

  } catch (err) {

    document.getElementById('tableBody').innerHTML = `
      <tr>
        <td colspan="10" class="no-data">
          Failed to load data
          <br/>
          ${err.message}
        </td>
      </tr>
    `;
  }
}



// UPDATE STATS

function updateStats() {

  const students =
    new Set(allRecords.map(r => r.roll_no)).size;

  const programs =
    new Set(allRecords.map(r => r.program)).size;

  const semesters =
    new Set(allRecords.map(r => r.semester)).size;

  document.getElementById('statTotal').textContent =
    allRecords.length;

  document.getElementById('statStudents').textContent =
    students;

  document.getElementById('statPrograms').textContent =
    programs;

  document.getElementById('statSemesters').textContent =
    semesters;
}



// POPULATE FILTERS

function populateFilters() {

  const programs =
    [...new Set(allRecords.map(r => r.program))];

  const semesters =
    [...new Set(allRecords.map(r => r.semester))];

  const progSel =
    document.getElementById('filterProgram');

  const semSel =
    document.getElementById('filterSemester');

  progSel.innerHTML =
    '<option value="">All Programs</option>';

  semSel.innerHTML =
    '<option value="">All Semesters</option>';

  programs.forEach(program => {

    progSel.innerHTML += `
      <option value="${program}">
        ${program}
      </option>
    `;
  });

  semesters.forEach(semester => {

    semSel.innerHTML += `
      <option value="${semester}">
        ${semester}
      </option>
    `;
  });
}



// SEARCH

function onSearch() {

  currentPage = 1;

  applyFiltersAndSort();
}



// FILTER + SORT

function applyFiltersAndSort() {

  const query =
    document.getElementById('searchInput')
      .value
      .toLowerCase();

  const progFilter =
    document.getElementById('filterProgram')
      .value;

  const semFilter =
    document.getElementById('filterSemester')
      .value;

  filteredRecs = allRecords.filter(r => {

    const matchQuery =

      !query ||

      (r.roll_no || '')
        .toLowerCase()
        .includes(query) ||

      (r.subject_name || '')
        .toLowerCase()
        .includes(query) ||

      (r.subject_code || '')
        .toLowerCase()
        .includes(query) ||

      (r.program || '')
        .toLowerCase()
        .includes(query);

    const matchProgram =
      !progFilter ||
      r.program === progFilter;

    const matchSemester =
      !semFilter ||
      r.semester === semFilter;

    return (
      matchQuery &&
      matchProgram &&
      matchSemester
    );
  });

  filteredRecs.sort((a, b) => {

    const va =
      (a[sortField] || '')
        .toString()
        .toLowerCase();

    const vb =
      (b[sortField] || '')
        .toString()
        .toLowerCase();

    if (va < vb)
      return sortDir === 'asc' ? -1 : 1;

    if (va > vb)
      return sortDir === 'asc' ? 1 : -1;

    return 0;
  });

  renderTable();

  renderPagination();
}



// SORT

function sortBy(field) {

  if (sortField === field) {

    sortDir =
      sortDir === 'asc'
        ? 'desc'
        : 'asc';

  } else {

    sortField = field;

    sortDir = 'asc';
  }

  applyFiltersAndSort();
}



// RENDER TABLE

function renderTable() {

  const tbody =
    document.getElementById('tableBody');

  if (!filteredRecs.length) {

    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="no-data">
          No records found
        </td>
      </tr>
    `;

    return;
  }

  const start =
    (currentPage - 1) * PAGE_SIZE;

  const end =
    start + PAGE_SIZE;

  const page =
    filteredRecs.slice(start, end);

  tbody.innerHTML = page.map((r, idx) => `

    <tr>

      <td>
        ${start + idx + 1}
      </td>

      <td>
        ${escHtml(r.roll_no || '-')}
      </td>

      <td>
        ${escHtml(r.program || '-')}
      </td>

      <td>
        ${escHtml(r.semester || '-')}
      </td>

      <td>
        ${escHtml(r.subject_code || '-')}
      </td>

      <td>
        ${escHtml(r.subject_name || '-')}
      </td>

      <td>
        ${formatDate(r.exam_date)}
      </td>

      <td>
        ${formatTime(r.exam_time)}
      </td>

      <td>
        ${escHtml(r.mentor_name || '-')}
      </td>

      <td>

        <button
          class="btn btn-danger"
          onclick="openDeleteModal('${r.id}')"
        >

          <i class="fas fa-trash"></i>

        </button>

      </td>

    </tr>

  `).join('');
}



// PAGINATION

function renderPagination() {

  const total =
    filteredRecs.length;

  const totalPages =
    Math.ceil(total / PAGE_SIZE);

  const pg =
    document.getElementById('paginationRow');

  const info =
    document.getElementById('pageInfo');

  info.textContent =
    `Showing ${total} entries`;

  if (totalPages <= 1) {

    pg.innerHTML = '';

    return;
  }

  let html = '';

  for (let i = 1; i <= totalPages; i++) {

    html += `
      <button
        class="page-btn ${i === currentPage ? 'active' : ''}"
        onclick="goPage(${i})"
      >
        ${i}
      </button>
    `;
  }

  pg.innerHTML = html;
}



function goPage(page) {

  currentPage = page;

  renderTable();

  renderPagination();
}



// EXPORT CSV

function exportCSV() {

  if (!filteredRecs.length) {

    alert('No data to export');

    return;
  }

  const headers = [

    'Roll No',

    'Program',

    'Semester',

    'Subject Code',

    'Subject Name',

    'Exam Date',

    'Exam Time',

    'Mentor Name'
  ];

  const rows = filteredRecs.map(r => [

    csvEsc(r.roll_no),

    csvEsc(r.program),

    csvEsc(r.semester),

    csvEsc(r.subject_code),

    csvEsc(r.subject_name),

    csvEsc(r.exam_date),

    csvEsc(r.exam_time),

    csvEsc(r.mentor_name)

  ]);

  const csvContent =
    [headers, ...rows]
      .map(r => r.join(','))
      .join('\n');

  const blob =
    new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement('a');

  a.href = url;

  a.download = 'exam_schedule.csv';

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);
}



// DELETE

function openDeleteModal(id) {

  deleteTargetId = id;

  const modal =
    document.getElementById('deleteModal');

  modal.style.display = 'flex';

  document.getElementById('confirmDeleteBtn').onclick =
    async () => {

      try {

        const { error } =
          await supabaseClient
            .from('exam_schedule_demo')
            .delete()
            .eq('id', deleteTargetId);

        if (error) throw error;

        closeDeleteModal();

        loadData(currentPage);

      } catch (err) {

        alert(err.message);
      }
    };
}



function closeDeleteModal() {

  document.getElementById('deleteModal')
    .style.display = 'none';

  deleteTargetId = null;
}



document.getElementById('deleteModal')
  .addEventListener('click', (e) => {

    if (
      e.target ===
      document.getElementById('deleteModal')
    ) {

      closeDeleteModal();
    }
  });



// HELPERS

function escHtml(str) {

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}



function csvEsc(val) {

  if (val == null) return '';

  return `"${String(val).replace(/"/g, '""')}"`;
}



function formatDate(dateStr) {

  if (!dateStr) return '-';

  return dateStr;
}



function formatTime(timeStr) {

  if (!timeStr) return '-';

  return timeStr;
}
