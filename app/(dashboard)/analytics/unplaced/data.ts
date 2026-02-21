// app/analytics/unplaced/data.ts

export const students = [
    { id: "1", name: "Aditi Sharma", department: "CSE" },
    { id: "2", name: "Rahul Mehta", department: "IT" },
    { id: "3", name: "Sneha Patil", department: "ENTC" },
    { id: "4", name: "Neha Kulkarni", department: "CSE" },
    { id: "5", name: "Rohan Deshmukh", department: "CSE" },
    { id: "6", name: "Priya Nair", department: "IT" },
    { id: "7", name: "Kunal Joshi", department: "ENTC" },
    { id: "8", name: "Meera Iyer", department: "CSE" },
    { id: "9", name: "Arjun Rao", department: "IT" },
    { id: "10", name: "Tanvi Shah", department: "CSE" },
    { id: "11", name: "Yash Verma", department: "CSE" },
    { id: "12", name: "Simran Kaur", department: "IT" },
    { id: "13", name: "Dev Patel", department: "ENTC" },
    { id: "14", name: "Ishita Roy", department: "CSE" },
    { id: "15", name: "Aditya Singh", department: "IT" },
    { id: "16", name: "Ritika Menon", department: "ENTC" },
    { id: "17", name: "Ankit Tiwari", department: "ENTC" },
  ];
  
  export const applications = [
  
    /* ================= HIGH INTERVIEW RISK ================= */
  
    { studentId: "1", stage: "test" },
    { studentId: "1", stage: "interview" },
    { studentId: "1", stage: "interview" },
    { studentId: "1", stage: "interview" },
  
    { studentId: "5", stage: "test" },
    { studentId: "5", stage: "interview" },
    { studentId: "5", stage: "interview" },
    { studentId: "5", stage: "interview" },
    { studentId: "5", stage: "interview" },
  
    { studentId: "8", stage: "test" },
    { studentId: "8", stage: "interview" },
    { studentId: "8", stage: "interview" },
    { studentId: "8", stage: "interview" },
  
    /* ================= MODERATE RISK ================= */
  
    { studentId: "2", stage: "test" },
    { studentId: "2", stage: "interview" },
  
    { studentId: "10", stage: "test" },
    { studentId: "10", stage: "interview" },
    { studentId: "10", stage: "interview" },
  
    { studentId: "11", stage: "test" },
    { studentId: "11", stage: "interview" },
  
    { studentId: "16", stage: "test" },
    { studentId: "16", stage: "interview" },
    { studentId: "16", stage: "interview" },
  
    /* ================= TEST READINESS GAP ================= */
  
    { studentId: "7", stage: "test" },
    { studentId: "7", stage: "test" },
  
    { studentId: "13", stage: "test" },
    { studentId: "13", stage: "test" },
  
    /* ================= SUCCESSFUL PLACEMENTS ================= */
  
    { studentId: "4", stage: "test" },
    { studentId: "4", stage: "interview" },
    { studentId: "4", stage: "selected" },
  
    { studentId: "6", stage: "test" },
    { studentId: "6", stage: "interview" },
    { studentId: "6", stage: "selected" },
  
    { studentId: "9", stage: "test" },
    { studentId: "9", stage: "interview" },
    { studentId: "9", stage: "selected" },
  
    { studentId: "12", stage: "test" },
    { studentId: "12", stage: "interview" },
    { studentId: "12", stage: "selected" },
  
    { studentId: "14", stage: "test" },
    { studentId: "14", stage: "interview" },
    { studentId: "14", stage: "selected" },
  
    { studentId: "15", stage: "test" },
    { studentId: "15", stage: "interview" },
    { studentId: "15", stage: "selected" },
  
    { studentId: "17", stage: "test" },
    { studentId: "17", stage: "interview" },
    { studentId: "17", stage: "selected" }, // ENTC placement added
  ];