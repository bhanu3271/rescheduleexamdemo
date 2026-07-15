/**
 * admin.js
 * Displays the uploaded exam schedule master data.
 */

let allRecords = [];
let filteredRecords = [];

let currentPage = 1;
const PAGE_SIZE = 20;

let sortField = "exam_date";
let sortDir = "asc";

let deleteTargetId = null;


//--------------------------------------------------
// LOAD DATA
//--------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    loadData(1);
});


//--------------------------------------------------
// FETCH DATA FROM SUPABASE
//--------------------------------------------------

async function loadData(page = 1) {

    currentPage = page;

    document.getElementById("tableBody").innerHTML = `
    <tr>
        <td colspan="8" class="no-data">
            <i class="fas fa-spinner fa-spin"></i>
            <br>
            Loading...
        </td>
    </tr>
    `;

    try {

        const { data, error } = await supabaseClient
            .from("exam_schedule")
            .select("*");

        if (error) throw error;


        allRecords = (data || []).map(record => ({

            id: record.id,

            program: record.program,

            semester: record.semester,

            subject_code: record.paper_code,

            subject_name: record.course_name,

            exam_date: record.exam_date,

            exam_time: record.exam_time

        }));


        updateStats();
        populateFilters();
        applyFiltersAndSort();

    }

    catch (error) {

        document.getElementById("tableBody").innerHTML = `
        <tr>
            <td colspan="8" class="no-data">
                Failed to load data.
                <br>
                ${error.message}
            </td>
        </tr>
        `;

    }

}



//--------------------------------------------------
// UPDATE STATS
//--------------------------------------------------

function updateStats() {

    document.getElementById("statTotal").textContent =
        allRecords.length;

    document.getElementById("statStudents").textContent =
        "-";

    document.getElementById("statPrograms").textContent =
        new Set(allRecords.map(r => r.program)).size;

    document.getElementById("statSemesters").textContent =
        new Set(allRecords.map(r => r.semester)).size;

}



//--------------------------------------------------
// FILTERS
//--------------------------------------------------

function populateFilters() {

    const programs =
        [...new Set(allRecords.map(r => r.program))];

    const semesters =
        [...new Set(allRecords.map(r => r.semester))];


    const programFilter =
        document.getElementById("filterProgram");

    const semesterFilter =
        document.getElementById("filterSemester");


    programFilter.innerHTML =
        '<option value="">All Programs</option>';

    semesterFilter.innerHTML =
        '<option value="">All Semesters</option>';


    programs.forEach(program => {

        programFilter.innerHTML += `
        <option value="${program}">
            ${program}
        </option>
        `;

    });


    semesters.forEach(semester => {

        semesterFilter.innerHTML += `
        <option value="${semester}">
            ${semester}
        </option>
        `;

    });

}



//--------------------------------------------------
// SEARCH
//--------------------------------------------------

function onSearch() {

    currentPage = 1;

    applyFiltersAndSort();

}



//--------------------------------------------------
// APPLY FILTERS
//--------------------------------------------------

function applyFiltersAndSort() {

    const searchText =
        document.getElementById("searchInput")
            .value.toLowerCase();

    const program =
        document.getElementById("filterProgram")
            .value;

    const semester =
        document.getElementById("filterSemester")
            .value;


    filteredRecords = allRecords.filter(record => {

        const matchSearch =

            !searchText ||

            record.program?.toLowerCase().includes(searchText) ||

            record.subject_code?.toLowerCase().includes(searchText) ||

            record.subject_name?.toLowerCase().includes(searchText);


        const matchProgram =
            !program || record.program === program;


        const matchSemester =
            !semester || record.semester === semester;


        return (
            matchSearch &&
            matchProgram &&
            matchSemester
        );

    });


    filteredRecords.sort((a, b) => {

        const valueA =
            (a[sortField] || "").toString().toLowerCase();

        const valueB =
            (b[sortField] || "").toString().toLowerCase();


        if (valueA < valueB)
            return sortDir === "asc" ? -1 : 1;

        if (valueA > valueB)
            return sortDir === "asc" ? 1 : -1;

        return 0;

    });


    renderTable();
    renderPagination();

}



//--------------------------------------------------
// SORTING
//--------------------------------------------------

function sortBy(field) {

    if (sortField === field) {

        sortDir =
            sortDir === "asc"
                ? "desc"
                : "asc";

    }

    else {

        sortField = field;
        sortDir = "asc";

    }

    applyFiltersAndSort();

}



//--------------------------------------------------
// RENDER TABLE
//--------------------------------------------------

function renderTable() {

    const tbody =
        document.getElementById("tableBody");


    if (!filteredRecords.length) {

        tbody.innerHTML = `
        <tr>
            <td colspan="8" class="no-data">
                No records found.
            </td>
        </tr>
        `;

        return;

    }


    const start =
        (currentPage - 1) * PAGE_SIZE;


    const pageRecords =
        filteredRecords.slice(
            start,
            start + PAGE_SIZE
        );


    tbody.innerHTML = pageRecords.map((record, index) => `

    <tr>

        <td>${start + index + 1}</td>

        <td>${record.program}</td>

        <td>${record.semester}</td>

        <td>${record.subject_code}</td>

        <td>${record.subject_name}</td>

        <td>${record.exam_date}</td>

        <td>${record.exam_time}</td>

        <td>

        <button
        class="btn btn-danger"
        onclick="openDeleteModal('${record.id}')">

        <i class="fas fa-trash"></i>

        </button>

        </td>

    </tr>

    `).join("");

}



//--------------------------------------------------
// PAGINATION
//--------------------------------------------------

function renderPagination() {

    const totalPages =
        Math.ceil(
            filteredRecords.length / PAGE_SIZE
        );


    const pagination =
        document.getElementById("paginationRow");


    pagination.innerHTML = "";


    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `

        <button
        class="page-btn ${i === currentPage ? "active" : ""}"
        onclick="goPage(${i})">

        ${i}

        </button>

        `;

    }


    document.getElementById("pageInfo").textContent =
        `Total Records : ${filteredRecords.length}`;

}



function goPage(page) {

    currentPage = page;

    renderTable();
    renderPagination();

}



//--------------------------------------------------
// EXPORT CSV
//--------------------------------------------------

function exportCSV() {

    if (!filteredRecords.length) {

        alert("No records found.");

        return;

    }


    const headers = [

        "Program",
        "Semester",
        "Paper Code",
        "Course Name",
        "Exam Date",
        "Exam Time"

    ];


    const rows = filteredRecords.map(record => [

        record.program,
        record.semester,
        record.subject_code,
        record.subject_name,
        record.exam_date,
        record.exam_time

    ]);


    const csvContent =
        [headers, ...rows]
            .map(row => row.join(","))
            .join("\n");


    const blob =
        new Blob([csvContent], {
            type: "text/csv"
        });


    const link =
        document.createElement("a");


    link.href =
        URL.createObjectURL(blob);

    link.download =
        "exam_schedule_master.csv";

    link.click();

}



//--------------------------------------------------
// DELETE RECORD
//--------------------------------------------------

function openDeleteModal(id) {

    deleteTargetId = id;

    document.getElementById("deleteModal")
        .style.display = "flex";


    document.getElementById("confirmDeleteBtn")
        .onclick = deleteRecord;

}


async function deleteRecord() {

    try {

        const { error } = await supabaseClient
            .from("exam_schedule")
            .delete()
            .eq("id", deleteTargetId);

        if (error) throw error;

        closeDeleteModal();

        loadData(currentPage);

    }

    catch (error) {

        alert(error.message);

    }

}


function closeDeleteModal() {

    document.getElementById("deleteModal")
        .style.display = "none";

}


document.getElementById("deleteModal")
    .addEventListener("click", function (e) {

        if (
            e.target ===
            document.getElementById("deleteModal")
        ) {

            closeDeleteModal();

        }

    });
