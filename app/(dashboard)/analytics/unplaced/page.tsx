"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { students, applications } from "./data";

export default function AdvancedPlacementDiagnostics() {

  /* ================= STAGE COUNTS ================= */
  const stageCounts: Record<string, number> = {
    applied: 0,
    test: 0,
    interview: 0,
    selected: 0,
  };

  applications.forEach((app) => {
    if (stageCounts[app.stage] !== undefined) {
      stageCounts[app.stage]++;
    }
  });

  /* ================= STUDENT ANALYSIS ================= */
  const studentStats = students.map((student) => {
    const apps = applications.filter(
      (a) => a.studentId === student.id
    );

    const interviews = apps.filter(
      (a) => a.stage === "interview"
    ).length;

    const tests = apps.filter(
      (a) => a.stage === "test"
    ).length;

    const isPlaced = apps.some(
      (a) => a.stage === "selected"
    );

    let risk = "Low Risk";

    if (!isPlaced && interviews >= 3) {
      risk = "High Interview Risk";
    } else if (!isPlaced && tests >= 2 && interviews === 0) {
      risk = "Test Readiness Gap";
    } else if (!isPlaced && interviews > 0 && interviews < 3) {
      risk = "Moderate Interview Risk";
    }

    return {
      ...student,
      interviews,
      tests,
      isPlaced,
      risk,
    };
  });

  const unplaced = studentStats
    .filter((s) => !s.isPlaced)
    .sort((a, b) => b.interviews - a.interviews);


    const [selectedDept, setSelectedDept] = useState("All");

const departments = [
  "All",
  ...Array.from(new Set(students.map((s) => s.department))),
];

const filteredUnplaced =
  selectedDept === "All"
    ? unplaced
    : unplaced.filter(
        (s) => s.department === selectedDept
      );

  /* ================= CORRECT CONVERSION LOGIC ================= */

  const studentsWithTest = studentStats.filter(
    (s) => s.tests > 0
  ).length;

  const studentsWithInterview = studentStats.filter(
    (s) => s.interviews > 0
  ).length;

  const studentsPlaced = studentStats.filter(
    (s) => s.isPlaced
  ).length;

  const testConversion =
    students.length > 0
      ? (studentsWithTest / students.length) * 100
      : 0;

  const interviewConversion =
    studentsWithTest > 0
      ? (studentsWithInterview / studentsWithTest) * 100
      : 0;

  const selectionConversion =
    studentsWithInterview > 0
      ? (studentsPlaced / studentsWithInterview) * 100
      : 0;

  const interviewRejectionRate =
    100 - selectionConversion;

  /* ================= DEPARTMENT ANALYSIS ================= */

  const deptStats: Record<
    string,
    { total: number; placed: number }
  > = {};

  studentStats.forEach((s) => {
    if (!deptStats[s.department]) {
      deptStats[s.department] = {
        total: 0,
        placed: 0,
      };
    }

    deptStats[s.department].total += 1;
    if (s.isPlaced) deptStats[s.department].placed += 1;
  });

  const deptData = Object.entries(deptStats).map(
    ([department, data]) => ({
      department,
      successRate:
        data.total > 0
          ? (data.placed / data.total) * 100
          : 0,
      total: data.total,
    })
  );

  // Only consider departments with >= 3 students
  const validDeptData = deptData.filter(
    (d) => d.total >= 3
  );

  const lowestDept =
    validDeptData.length > 0
      ? validDeptData.reduce((prev, curr) =>
          curr.successRate < prev.successRate
            ? curr
            : prev
        )
      : null;

  /* ================= INSIGHT ================= */

  const primaryInsight =
    interviewRejectionRate > 60
      ? "⚠ Interview stage is the primary bottleneck."
      : "Placement flow healthy.";

  const recommendation =
    interviewRejectionRate > 60
      ? "Conduct structured mock interview workshops and communication training."
      : "Continue monitoring performance trends.";

  const funnelData = [
    { stage: "Applied", value: students.length },
    { stage: "Test", value: studentsWithTest },
    { stage: "Interview", value: studentsWithInterview },
    { stage: "Selected", value: studentsPlaced },
  ];

  /* ================= UI ================= */

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">
          Advanced Placement Diagnostics
        </h2>
        <p className="text-muted-foreground">
          Root cause analysis of placement bottlenecks
        </p>
      </div>

      {/* PRIMARY INSIGHT */}
      <Card className="p-6 border-l-4 border-red-500 bg-red-50">
        <p className="font-semibold text-red-700">
          {primaryInsight}
        </p>
      </Card>

      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-4">

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Interview Rejection Rate
          </p>
          <p
            className={`text-2xl font-bold mt-2 ${
              interviewRejectionRate > 60
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {interviewRejectionRate.toFixed(1)}%
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Test → Interview Conversion
          </p>
          <p className="text-2xl font-bold mt-2">
            {interviewConversion.toFixed(1)}%
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Interview → Selection Conversion
          </p>
          <p className="text-2xl font-bold mt-2">
            {selectionConversion.toFixed(1)}%
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-yellow-500 bg-yellow-50">
          <p className="text-sm font-medium">
            Recommended Action
          </p>
          <p className="mt-2 text-sm">
            {recommendation}
          </p>
        </Card>
      </div>

      {/* FUNNEL */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">
          Placement Funnel
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData}>
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#111827"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* INTERVENTION INSIGHTS */}
      <Card className="p-6">
        <h3 className="font-semibold mb-6">
          Critical Intervention Insights
        </h3>

        <div className="mb-6">
          <p className="text-sm font-medium mb-2">
            🔴 Students Requiring Immediate Attention
          </p>
          {unplaced.slice(0, 3).map((s) => (
            <div
              key={s.id}
              className="flex justify-between bg-red-50 px-4 py-2 rounded-md mb-2"
            >
              <span>{s.name}</span>
              <span className="text-red-600">
                {s.interviews} interviews
              </span>
            </div>
          ))}
        </div>

        <div>
          <p className="text-sm font-medium mb-2">
            📉 Lowest Performing Department
          </p>
          <p className="text-muted-foreground text-sm">
            {lowestDept
              ? `${lowestDept.department} has the lowest placement success rate at ${lowestDept.successRate.toFixed(
                  1
                )}%.`
              : "No department has enough data for comparison."}
          </p>
        </div>
      </Card>

      {/* TABLE */}
      {/* TABLE WITH FILTER */}
<Card className="p-6">
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-semibold">
      Top At-Risk Students
    </h3>

    {/* Department Filter */}
    <select
      value={selectedDept}
      onChange={(e) =>
        setSelectedDept(e.target.value)
      }
      className="border px-3 py-1 rounded-md text-sm"
    >
      {departments.map((dept) => (
        <option key={dept} value={dept}>
          {dept}
        </option>
      ))}
    </select>
  </div>

  <table className="w-full text-sm">
    <thead>
      <tr className="border-b text-muted-foreground">
        <th className="py-2 text-left">Name</th>
        <th className="py-2 text-left">Department</th>
        <th className="py-2 text-left">Test Attempts</th>
        <th className="py-2 text-left">Interview Attempts</th>
        <th className="py-2 text-left">Risk</th>
      </tr>
    </thead>
    <tbody>
      {filteredUnplaced.map((s) => (
        <tr key={s.id} className="border-b">
          <td className="py-2">{s.name}</td>
          <td className="py-2">{s.department}</td>
          <td className="py-2">{s.tests}</td>
          <td className="py-2">{s.interviews}</td>
          <td className="py-2">
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                s.risk === "High Interview Risk"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {s.risk}
            </span>
          </td>
        </tr>
      ))}

      {filteredUnplaced.length === 0 && (
        <tr>
          <td
            colSpan={5}
            className="text-center py-4 text-muted-foreground"
          >
            No at-risk students in this department.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</Card>
    </div>
  );
}