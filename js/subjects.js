/**
 * subjects.js
 * Define all programs, their available semesters, and subjects per semester.
 * Mentors/Admins can edit this file to add/remove subjects.
 */

const CURRICULUM = {

  BCA: {
    label: "BCA",
    semesters: [1, 2, 3, 4, 5, 6],
    subjects: {
      1: [
        { code: "BCA101", name: "Fundamentals of Computers" },
        { code: "BCA102", name: "Mathematics – I" },
        { code: "BCA103", name: "C Programming" },
        { code: "BCA104", name: "Digital Electronics" },
        { code: "BCA105", name: "Communication Skills" },
      ],
      2: [
        { code: "BCA201", name: "Data Structures" },
        { code: "BCA202", name: "Mathematics – II" },
        { code: "BCA203", name: "Object Oriented Programming (C++)" },
        { code: "BCA204", name: "Computer Organisation" },
        { code: "BCA205", name: "Operating Systems" },
      ],
      3: [
        { code: "BCA301", name: "Database Management Systems" },
        { code: "BCA302", name: "Java Programming" },
        { code: "BCA303", name: "Computer Networks" },
        { code: "BCA304", name: "Software Engineering" },
        { code: "BCA305", name: "Discrete Mathematics" },
      ],
      4: [
        { code: "BCA401", name: "Web Technologies" },
        { code: "BCA402", name: "Python Programming" },
        { code: "BCA403", name: "Computer Graphics" },
        { code: "BCA404", name: "Theory of Computation" },
        { code: "BCA405", name: "Numerical Methods" },
      ],
      5: [
        { code: "BCA501", name: "Advanced Java" },
        { code: "BCA502", name: "Artificial Intelligence" },
        { code: "BCA503", name: "Cloud Computing" },
        { code: "BCA504", name: "Mobile Application Development" },
        { code: "BCA505", name: "Information Security" },
      ],
      6: [
        { code: "BCA601", name: "Machine Learning" },
        { code: "BCA602", name: "Big Data Analytics" },
        { code: "BCA603", name: "Internet of Things" },
        { code: "BCA604", name: "Project Work" },
        { code: "BCA605", name: "Entrepreneurship & IPR" },
      ],
    },
  },

  MCA: {
    label: "MCA",
    semesters: [1, 2, 3, 4],
    subjects: {
      1: [
        { code: "MCA101", name: "Advanced Programming with C++" },
        { code: "MCA102", name: "Discrete Mathematics" },
        { code: "MCA103", name: "Data Structures & Algorithms" },
        { code: "MCA104", name: "Computer Organisation & Architecture" },
        { code: "MCA105", name: "Operating Systems" },
      ],
      2: [
        { code: "MCA201", name: "Database Management Systems" },
        { code: "MCA202", name: "Java & Web Technologies" },
        { code: "MCA203", name: "Computer Networks" },
        { code: "MCA204", name: "Software Engineering" },
        { code: "MCA205", name: "Statistical Computing" },
      ],
      3: [
        { code: "MCA301", name: "Artificial Intelligence" },
        { code: "MCA302", name: "Cloud Computing & Virtualization" },
        { code: "MCA303", name: "Mobile Computing" },
        { code: "MCA304", name: "Information Security & Cyber Laws" },
        { code: "MCA305", name: "Data Warehousing & Mining" },
      ],
      4: [
        { code: "MCA401", name: "Machine Learning" },
        { code: "MCA402", name: "Deep Learning & Neural Networks" },
        { code: "MCA403", name: "Distributed Systems" },
        { code: "MCA404", name: "Major Project" },
      ],
    },
  },

  BBA: {
    label: "BBA",
    semesters: [1, 2, 3, 4, 5, 6],
    subjects: {
      1: [
        { code: "BBA101", name: "Principles of Management" },
        { code: "BBA102", name: "Business Mathematics" },
        { code: "BBA103", name: "Financial Accounting" },
        { code: "BBA104", name: "Business Communication" },
        { code: "BBA105", name: "Computer Applications" },
      ],
      2: [
        { code: "BBA201", name: "Organisational Behaviour" },
        { code: "BBA202", name: "Business Statistics" },
        { code: "BBA203", name: "Cost Accounting" },
        { code: "BBA204", name: "Business Economics" },
        { code: "BBA205", name: "Marketing Management" },
      ],
      3: [
        { code: "BBA301", name: "Human Resource Management" },
        { code: "BBA302", name: "Financial Management" },
        { code: "BBA303", name: "Research Methodology" },
        { code: "BBA304", name: "Operations Management" },
        { code: "BBA305", name: "Business Law" },
      ],
      4: [
        { code: "BBA401", name: "Entrepreneurship Development" },
        { code: "BBA402", name: "Strategic Management" },
        { code: "BBA403", name: "Consumer Behaviour" },
        { code: "BBA404", name: "Corporate Governance" },
        { code: "BBA405", name: "E-Commerce" },
      ],
      5: [
        { code: "BBA501", name: "International Business" },
        { code: "BBA502", name: "Supply Chain Management" },
        { code: "BBA503", name: "Business Analytics" },
        { code: "BBA504", name: "Project Management" },
        { code: "BBA505", name: "Digital Marketing" },
      ],
      6: [
        { code: "BBA601", name: "Mergers & Acquisitions" },
        { code: "BBA602", name: "Leadership & Change Management" },
        { code: "BBA603", name: "Social Entrepreneurship" },
        { code: "BBA604", name: "Project & Viva" },
        { code: "BBA605", name: "Elective – Specialisation" },
      ],
    },
  },

  MBA: {
    label: "MBA",
    semesters: [1, 2, 3, 4],
    subjects: {
      1: [
        { code: "MBA101", name: "Management Concepts & Practices" },
        { code: "MBA102", name: "Managerial Economics" },
        { code: "MBA103", name: "Accounting for Managers" },
        { code: "MBA104", name: "Organisational Behaviour" },
        { code: "MBA105", name: "Business Research Methods" },
      ],
      2: [
        { code: "MBA201", name: "Financial Management" },
        { code: "MBA202", name: "Marketing Management" },
        { code: "MBA203", name: "Human Resource Management" },
        { code: "MBA204", name: "Operations Management" },
        { code: "MBA205", name: "Business Law & Ethics" },
      ],
      3: [
        { code: "MBA301", name: "Strategic Management" },
        { code: "MBA302", name: "Elective – Finance / Marketing / HR" },
        { code: "MBA303", name: "International Business" },
        { code: "MBA304", name: "Entrepreneurship" },
        { code: "MBA305", name: "Summer Internship Report" },
      ],
      4: [
        { code: "MBA401", name: "Business Analytics" },
        { code: "MBA402", name: "Corporate Governance & CSR" },
        { code: "MBA403", name: "Elective – Specialisation" },
        { code: "MBA404", name: "Major Research Project" },
      ],
    },
  },

  BSC_CS: {
    label: "B.Sc CS",
    semesters: [1, 2, 3, 4, 5, 6],
    subjects: {
      1: [
        { code: "BSC101", name: "Problem Solving & C Programming" },
        { code: "BSC102", name: "Mathematics – I" },
        { code: "BSC103", name: "Physics / Electronics" },
        { code: "BSC104", name: "Environmental Science" },
        { code: "BSC105", name: "Communication Skills" },
      ],
      2: [
        { code: "BSC201", name: "Data Structures" },
        { code: "BSC202", name: "Mathematics – II" },
        { code: "BSC203", name: "Digital Electronics" },
        { code: "BSC204", name: "OOP with Java" },
        { code: "BSC205", name: "Computer Networks Basics" },
      ],
      3: [
        { code: "BSC301", name: "DBMS" },
        { code: "BSC302", name: "Operating Systems" },
        { code: "BSC303", name: "Web Design" },
        { code: "BSC304", name: "Software Engineering" },
        { code: "BSC305", name: "Probability & Statistics" },
      ],
      4: [
        { code: "BSC401", name: "Python Programming" },
        { code: "BSC402", name: "Computer Graphics" },
        { code: "BSC403", name: "Computer Networks" },
        { code: "BSC404", name: "Advanced DBMS" },
        { code: "BSC405", name: "Microprocessors" },
      ],
      5: [
        { code: "BSC501", name: "Artificial Intelligence" },
        { code: "BSC502", name: "Mobile Computing" },
        { code: "BSC503", name: "Cloud Computing" },
        { code: "BSC504", name: "Cyber Security" },
        { code: "BSC505", name: "Linux & Open Source" },
      ],
      6: [
        { code: "BSC601", name: "Machine Learning" },
        { code: "BSC602", name: "Big Data" },
        { code: "BSC603", name: "IoT" },
        { code: "BSC604", name: "Project Work" },
        { code: "BSC605", name: "Elective" },
      ],
    },
  },

  BSC_IT: {
    label: "B.Sc IT",
    semesters: [1, 2, 3, 4, 5, 6],
    subjects: {
      1: [
        { code: "BSCIT101", name: "Fundamentals of IT" },
        { code: "BSCIT102", name: "C Programming" },
        { code: "BSCIT103", name: "Mathematics – I" },
        { code: "BSCIT104", name: "Digital Circuits" },
        { code: "BSCIT105", name: "English Communication" },
      ],
      2: [
        { code: "BSCIT201", name: "Data Structures using C" },
        { code: "BSCIT202", name: "Networking Basics" },
        { code: "BSCIT203", name: "OOP with C++" },
        { code: "BSCIT204", name: "Mathematics – II" },
        { code: "BSCIT205", name: "Web Designing" },
      ],
      3: [
        { code: "BSCIT301", name: "DBMS" },
        { code: "BSCIT302", name: "Java Programming" },
        { code: "BSCIT303", name: "Operating Systems" },
        { code: "BSCIT304", name: "Software Engineering" },
        { code: "BSCIT305", name: "Computer Architecture" },
      ],
      4: [
        { code: "BSCIT401", name: "PHP & MySQL" },
        { code: "BSCIT402", name: "Computer Networks" },
        { code: "BSCIT403", name: "Python" },
        { code: "BSCIT404", name: "Advanced DBMS" },
        { code: "BSCIT405", name: "Linux Administration" },
      ],
      5: [
        { code: "BSCIT501", name: "Cloud Computing" },
        { code: "BSCIT502", name: "Android Development" },
        { code: "BSCIT503", name: "Information Security" },
        { code: "BSCIT504", name: "Data Analytics" },
        { code: "BSCIT505", name: "ERP Systems" },
      ],
      6: [
        { code: "BSCIT601", name: "Machine Learning" },
        { code: "BSCIT602", name: "IoT Applications" },
        { code: "BSCIT603", name: "Digital Marketing" },
        { code: "BSCIT604", name: "Project" },
        { code: "BSCIT605", name: "Elective" },
      ],
    },
  },

  BE_CS: {
    label: "B.E/B.Tech CS",
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    subjects: {
      1: [
        { code: "BECS101", name: "Engineering Mathematics – I" },
        { code: "BECS102", name: "Engineering Physics" },
        { code: "BECS103", name: "C Programming" },
        { code: "BECS104", name: "Engineering Drawing" },
        { code: "BECS105", name: "Basic Electronics" },
      ],
      2: [
        { code: "BECS201", name: "Engineering Mathematics – II" },
        { code: "BECS202", name: "Data Structures" },
        { code: "BECS203", name: "Digital Logic" },
        { code: "BECS204", name: "Engineering Chemistry" },
        { code: "BECS205", name: "Communication Skills" },
      ],
      3: [
        { code: "BECS301", name: "Discrete Mathematics" },
        { code: "BECS302", name: "OOP with Java" },
        { code: "BECS303", name: "Computer Organization" },
        { code: "BECS304", name: "Operating Systems" },
        { code: "BECS305", name: "Probability & Statistics" },
      ],
      4: [
        { code: "BECS401", name: "Database Systems" },
        { code: "BECS402", name: "Computer Networks" },
        { code: "BECS403", name: "Design & Analysis of Algorithms" },
        { code: "BECS404", name: "Software Engineering" },
        { code: "BECS405", name: "Theory of Computation" },
      ],
      5: [
        { code: "BECS501", name: "Compiler Design" },
        { code: "BECS502", name: "Artificial Intelligence" },
        { code: "BECS503", name: "Web Technologies" },
        { code: "BECS504", name: "Elective – I" },
        { code: "BECS505", name: "Mini Project" },
      ],
      6: [
        { code: "BECS601", name: "Machine Learning" },
        { code: "BECS602", name: "Cloud Computing" },
        { code: "BECS603", name: "Information Security" },
        { code: "BECS604", name: "Elective – II" },
        { code: "BECS605", name: "Industrial Training" },
      ],
      7: [
        { code: "BECS701", name: "Deep Learning" },
        { code: "BECS702", name: "Big Data Analytics" },
        { code: "BECS703", name: "IoT Systems" },
        { code: "BECS704", name: "Elective – III" },
        { code: "BECS705", name: "Major Project – I" },
      ],
      8: [
        { code: "BECS801", name: "Distributed Systems" },
        { code: "BECS802", name: "Blockchain Technology" },
        { code: "BECS803", name: "Elective – IV" },
        { code: "BECS804", name: "Major Project – II" },
      ],
    },
  },

  BE_IT: {
    label: "B.E/B.Tech IT",
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    subjects: {
      1: [
        { code: "BEIT101", name: "Engineering Mathematics – I" },
        { code: "BEIT102", name: "Engineering Physics" },
        { code: "BEIT103", name: "Programming in C" },
        { code: "BEIT104", name: "Engineering Drawing" },
        { code: "BEIT105", name: "Basic Electrical Engineering" },
      ],
      2: [
        { code: "BEIT201", name: "Engineering Mathematics – II" },
        { code: "BEIT202", name: "Data Structures" },
        { code: "BEIT203", name: "Digital Logic Design" },
        { code: "BEIT204", name: "Communication Skills" },
        { code: "BEIT205", name: "Environmental Studies" },
      ],
      3: [
        { code: "BEIT301", name: "OOP with Java" },
        { code: "BEIT302", name: "Computer Organization & Architecture" },
        { code: "BEIT303", name: "Operating Systems" },
        { code: "BEIT304", name: "Discrete Structures" },
        { code: "BEIT305", name: "Statistics & Probability" },
      ],
      4: [
        { code: "BEIT401", name: "DBMS" },
        { code: "BEIT402", name: "Computer Networks" },
        { code: "BEIT403", name: "Algorithms" },
        { code: "BEIT404", name: "Software Engineering" },
        { code: "BEIT405", name: "Web Programming" },
      ],
      5: [
        { code: "BEIT501", name: "Compiler Design" },
        { code: "BEIT502", name: "AI & Expert Systems" },
        { code: "BEIT503", name: "Mobile Applications" },
        { code: "BEIT504", name: "Elective – I" },
        { code: "BEIT505", name: "Mini Project" },
      ],
      6: [
        { code: "BEIT601", name: "Cloud Infrastructure" },
        { code: "BEIT602", name: "Network Security" },
        { code: "BEIT603", name: "Data Mining" },
        { code: "BEIT604", name: "Elective – II" },
        { code: "BEIT605", name: "Industrial Internship" },
      ],
      7: [
        { code: "BEIT701", name: "Machine Learning" },
        { code: "BEIT702", name: "IoT & Embedded Systems" },
        { code: "BEIT703", name: "DevOps & Agile" },
        { code: "BEIT704", name: "Elective – III" },
        { code: "BEIT705", name: "Project – Phase I" },
      ],
      8: [
        { code: "BEIT801", name: "Blockchain & Fintech" },
        { code: "BEIT802", name: "Advanced Networking" },
        { code: "BEIT803", name: "Elective – IV" },
        { code: "BEIT804", name: "Project – Phase II" },
      ],
    },
  },

};