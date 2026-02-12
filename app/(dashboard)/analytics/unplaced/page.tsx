"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ========= SAMPLE DATA (FOR DEMO) ========= */
const students = [
  { id: "1", name: "Aditi Sharma", department: "CSE" },
  { id: "2", name: "Rahul Mehta", department: "IT" },
  { id: "3", name: "Sneha Patil", department: "ENTC" },
  { id: "4", name: "Neha Kulkarni", department: "CSE" },
];

const applications = [
  { studentId: "1", stage: "interview" },
  { studentId: "1", stage: "interview" },
  { studentId: "1", stage: "rejected" },

  { studentId: "2", stage: "interview" },
  { studentId: "2", stage: "interview" },
  { studentId: "2", stage: "interview" },

  { studentId: "3", stage: "interview" },
  { studentId: "3", stage: "rejected" },
  { studentId: "3", stage: "interview" },

  { studentId: "4", stage: "interview" },
  { studentId: "4", stage: "interview" },
  { studentId: "4", stage: "selected" }, // placed
];
/* ========================================= */

export default function UnplacedStudentsAnalysisPage() {
  /* ---------- CORE LOGIC ---------- */
  const unplacedStudents = students
    .map((student) => {
      const studentApps = applications.filter(
        (a) => a.studentId === student.id
      );

      const interviews = studentApps.length;
      const isPlaced = studentApps.some(
        (a) => a.stage === "selected"
      );

      return {
        ...student,
        interviews,
        isPlaced,
      };
    })
    .filter((s) => s.interviews >= 3 && !s.isPlaced);

  /* ---------- DEPARTMENT DISTRIBUTION ---------- */
  const deptCount: Record<string, number> = {};
  unplacedStudents.forEach((s) => {
    deptCount[s.department] =
      (deptCount[s.department] || 0) + 1;
  });

  const deptData = Object.entries(deptCount).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Unplaced Students Analysis
        </h2>
        <p className="mt-1 text-muted-foreground">
          Students who attended multiple interviews but are still not placed
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Identified Students
          </p>
          <p className="text-3xl font-bold mt-2">
            {unplacedStudents.length}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Key Insight
          </p>
          <p className="mt-2 text-sm">
            Repeated interview exposure without selection indicates
            interview readiness gaps.
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Interviews per Student */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">
            Interviews per Student
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unplacedStudents}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="interviews"
                  fill="#000000"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">
            Department Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, percent }: any) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {deptData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={index === 0 ? "#000000" : "#6b7280"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">
          Student Breakdown
        </h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Department</th>
              <th className="py-2 text-left">Interviews</th>
            </tr>
          </thead>
          <tbody>
            {unplacedStudents.map((s) => (
              <tr
                key={s.id}
                className="border-b last:border-none"
              >
                <td className="py-2">{s.name}</td>
                <td className="py-2">{s.department}</td>
                <td className="py-2 font-medium">
                  {s.interviews}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
