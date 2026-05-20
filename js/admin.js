/**
 * admin.js — Admin Panel: Load, Filter, Sort, Export, Delete
 */

let allRecords   = [];
let filteredRecs = [];
let currentPage  = 1;
const PAGE_SIZE  = 20;
let sortField    = 'exam_date';
let sortDir      = 'asc';
let deleteTargetId = null;

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => loadData(1));

// ── Load all data from API ────────────────────────────────────────────────────
async function loadData(page = 1) {
  currentPage = page;
  document.getElementById('tableBody').innerHTML =
    '<tr><td colspan="10" class="no-data"><i class="fas fa-spinner fa-spin"></i><br/>Loading…</td></tr>';

  try {
    // Fetch up to 1000 records (adjust limit if needed)
const { data, error } = await supabaseClient
  .from('exam_schedule_demo')
  .select('*');

if (error) throw error;

allRecords = (data || []).map(r => ({
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
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="10" class="no-data"><i class="fas fa-exclamation-triangle"></i><br/>Failed to load data.<br/><small>${err.message}</small></td></tr>`;
  }
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function updateStats() {
  const students  = new Set(allRecords.map(r => r.roll_no)).size;
  const programs  = new Set(allRecords.map(r => r.program)).size;
  const semesters = new Set(allRecords.map(r => r.semester)).size;

  document.getElementById('statTotal').textContent    = allRecords.length;
  document.getElementById('statStudents').textContent = students;
  document.getElementById('statPrograms').textContent = programs;
  document.getElementById('statSemesters').textContent = semesters;
}

// ── Populate filter dropdowns ─────────────────────────────────────────────────
function populateFilters() {
  const programs  = [...new Set(allRecords.map(r => r.program))].sort();
  const semesters = [...new Set(allRecords.map(r => r.semester))].sort();

  const progSel = document.getElementById('filterProgram');
  const semSel  = document.getElementById('filterSemester');

  // Keep current selections
  const curProg = progSel.value;
  const curSem  = semSel.value;

  progSel.innerHTML = '<option value="">All Programs</option>';
  programs.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    if (p === curProg) opt.selected = true;
    progSel.appendChild(opt);
  });

  semSel.innerHTML = '<option value="">All Semesters</option>';
  semesters.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    if (s === curSem) opt.selected = true;
    semSel.appendChild(opt);
  });
}

// ── Filter + Sort ─────────────────────────────────────────────────────────────
function onSearch() {
  currentPage = 1;
  applyFiltersAndSort();
}

function applyFiltersAndSort() {
  const query   = document.getElementById('searchInput').value.toLowerCase().trim();
  const progF   = document.getElementById('filterProgram').value;
  const semF    = document.getElementById('filterSemester').value;

  filteredRecs = allRecords.filter(r => {
    const matchQ = !query ||
      (r.roll_no      || '').toLowerCase().includes(query) ||
      (r.subject_name || '').toLowerCase().includes(query) ||
      (r.subject_code || '').toLowerCase().includes(query) ||
      (r.program      || '').toLowerCase().includes(query) ||
      (r.submitted_by || '').toLowerCase().includes(query);

    const matchP = !progF || r.program === progF;
    const matchS = !semF  || r.semester === semF;

    return matchQ && matchP && matchS;
  });

  // Sort
  filteredRecs.sort((a, b) => {
    const va = (a[sortField] || '').toString().toLowerCase();
    const vb = (b[sortField] || '').toString().toLowerCase();
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  renderTable();
  renderPagination();
}

function sortBy(field) {
  if (sortField === field) {
    sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    sortField = field;
    sortDir   = 'asc';
  }
  applyFiltersAndSort();
}

// ── Render Table ─────────────────────────────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('tableBody');

  if (filteredRecs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="no-data">
      <i class="fas fa-inbox"></i><br/>No entries found.
    </td></tr>`;
    return;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const end   = start + PAGE_SIZE;
  const page  = filteredRecs.slice(start, end);

  tbody.innerHTML = page.map((r, idx) => `
    <tr>
      <td style="color:#9ca3af;font-size:0.8rem;">${start + idx + 1}</td>
      <td><strong>${escHtml(r.roll_no || '—')}</strong></td>
      <td>${escHtml(r.program || '—')}</td>
      <td><span style="background:#ede9fe;color:#3730a3;padding:2px 8px;border-radius:4px;font-size:0.8rem;font-weight:600;">${escHtml(r.semester || '—')}</span></td>
      <td><span class="badge-code">${escHtml(r.subject_code || '—')}</span></td>
      <td>${escHtml(r.subject_name || '—')}</td>
      <td>${formatDate(r.exam_date)}</td>
      <td>${formatTime(r.exam_time)}</td>
      <td>${escHtml(r.submitted_by || '—')}</td>
      <td>
        <button class="btn btn-danger" style="padding:6px 12px;font-size:0.8rem;" onclick="openDeleteModal('${r.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// ── Pagination ────────────────────────────────────────────────────────────────
function renderPagination() {
  const total = filteredRecs.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  const pg    = document.getElementById('paginationRow');
  const info  = document.getElementById('pageInfo');

  info.textContent = total > 0
    ? `Showing ${Math.min((currentPage-1)*PAGE_SIZE+1, total)}–${Math.min(currentPage*PAGE_SIZE, total)} of ${total} entries`
    : '';

  if (pages <= 1) { pg.innerHTML = ''; return; }

  let html = '';
  html += `<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹ Prev</button>`;

  const maxBtns = 7;
  let start = Math.max(1, currentPage - 3);
  let end   = Math.min(pages, start + maxBtns - 1);
  if (end - start < maxBtns - 1) start = Math.max(1, end - maxBtns + 1);

  if (start > 1) html += `<button class="page-btn" onclick="goPage(1)">1</button>`;
  if (start > 2) html += `<span style="padding:0 4px;color:#9ca3af">…</span>`;

  for (let p = start; p <= end; p++) {
    html += `<button class="page-btn ${p===currentPage?'active':''}" onclick="goPage(${p})">${p}</button>`;
  }

  if (end < pages - 1) html += `<span style="padding:0 4px;color:#9ca3af">…</span>`;
  if (end < pages)     html += `<button class="page-btn" onclick="goPage(${pages})">${pages}</button>`;

  html += `<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage===pages?'disabled':''}>Next ›</button>`;
  pg.innerHTML = html;
}

function goPage(p) {
  const pages = Math.ceil(filteredRecs.length / PAGE_SIZE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderTable();
  renderPagination();
  document.querySelector('.admin-tbl-wrap').scrollIntoView({ behavior: 'smooth' });
}

// ── Export CSV ────────────────────────────────────────────────────────────────
function exportCSV() {
  if (filteredRecs.length === 0) {
    alert('No data to export.');
    return;
  }

  const headers = [
    'Roll No', 'Program', 'Semester',
    'Subject Code', 'Subject Name',
    'Exam Date', 'Exam Time',
    'Submitted By', 'Submitted At'
  ];

  const rows = filteredRecs.map(r => [
    csvEsc(r.roll_no),
    csvEsc(r.program),
    csvEsc(r.semester),
    csvEsc(r.subject_code),
    csvEsc(r.subject_name),
    csvEsc(r.exam_date),
    csvEsc(r.exam_time),
    csvEsc(r.submitted_by),
    csvEsc(r.submitted_at ? new Date(r.submitted_at).toLocaleString('en-IN') : ''),
  ]);

  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `exam_schedule_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function csvEsc(val) {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

// ── Delete ────────────────────────────────────────────────────────────────────
function openDeleteModal(id) {
  deleteTargetId = id;
  const modal = document.getElementById('deleteModal');
  modal.style.display = 'flex';

  document.getElementById('confirmDeleteBtn').onclick = async () => {
    try {
      const resp = await fetch(`tables/exam_schedule/${deleteTargetId}`, { method: 'DELETE' });
      if (resp.ok || resp.status === 204) {
        closeDeleteModal();
        await loadData(currentPage);
      } else {
        alert('Failed to delete. Please try again.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };
}

function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
  deleteTargetId = null;
}

// Click outside modal to close
document.getElementById('deleteModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('deleteModal')) closeDeleteModal();
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

function formatTime(timeStr) {
  if (!timeStr) return '—';
  try {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hr12 = hour % 12 || 12;
    return `${hr12}:${m} ${ampm}`;
  } catch { return timeStr; }
}