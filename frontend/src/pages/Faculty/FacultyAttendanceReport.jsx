import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";

function InfoCard({ label, value, danger = false }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p
        className={`text-base font-semibold mt-1 ${
          danger
            ? "text-red-600 dark:text-red-400"
            : "text-gray-800 dark:text-gray-100"
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}

export default function FacultyAttendanceReport() {
  const token = localStorage.getItem("token");

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [reportData, setReportData] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignedSubjects = async () => {
      try {
        setLoadingSubjects(true);
        setError("");

        const res = await api.get("/api/faculty/assigned-subjects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAssignedSubjects(res.data || []);
      } catch (err) {
        console.error("Assigned subjects fetch error:", err);
        setAssignedSubjects([]);
        setError("Failed to load assigned subjects.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    if (token) fetchAssignedSubjects();
  }, [token]);

  const selectedSubjectObj = useMemo(() => {
    return assignedSubjects.find(
      (item) => String(item.subjectcode) === String(selectedSubject)
    );
  }, [assignedSubjects, selectedSubject]);

  const selectedCourse = selectedSubjectObj?.courcecode || "";
  const selectedSem = selectedSubjectObj?.semoryear || "";

  useEffect(() => {
    if (!selectedSubject || !selectedCourse || !selectedSem) {
      setReportData([]);
      return;
    }

    const fetchReport = async () => {
      try {
        setLoadingReport(true);
        setError("");

        const res = await api.get(
          `/api/attendance/report?course=${selectedCourse}&sem=${selectedSem}&subject=${selectedSubject}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReportData(res.data || []);
      } catch (err) {
        console.error("Attendance report fetch error:", err);
        setReportData([]);
        setError("Failed to load attendance report.");
      } finally {
        setLoadingReport(false);
      }
    };

    fetchReport();
  }, [selectedSubject, selectedCourse, selectedSem, token]);

  const summary = useMemo(() => {
    if (reportData.length === 0) return null;

    const totalStudents = reportData.length;
    const totalClasses = reportData[0]?.total_classes || 0;

    const average =
      reportData.reduce((acc, student) => acc + Number(student.percentage || 0), 0) /
      totalStudents;

    const below75 = reportData.filter(
      (student) => Number(student.percentage) < 75
    ).length;

    return {
      totalStudents,
      totalClasses,
      average: average.toFixed(2),
      below75,
    };
  }, [reportData]);

  const isReady = selectedSubject && selectedCourse && selectedSem;

  return (
    <div className="w-[94vw] sm:w-full min-h-[90vh] sm:min-h-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 transition-colors mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Attendance Report
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Subject-wise attendance analytics for your subjects.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 shadow-sm">
        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setReportData([]);
            setError("");
          }}
          disabled={loadingSubjects}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md text-sm"
        >
          <option value="">
            {loadingSubjects ? "Loading Subjects..." : "Select Subject"}
          </option>

          {assignedSubjects.map((sub, index) => (
            <option key={`${sub.subjectcode}-${index}`} value={sub.subjectcode}>
              {sub.subjectname}
            </option>
          ))}
        </select>
      </div>

      {selectedSubjectObj && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard label="Course" value={selectedCourse} />
          <InfoCard label="Semester / Year" value={selectedSem} />
          <InfoCard label="Subject" value={selectedSubjectObj?.subjectname} />
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard label="Students" value={summary.totalStudents} />
          <InfoCard label="Total Classes" value={summary.totalClasses} />
          <InfoCard label="Average %" value={`${summary.average}%`} />
          <InfoCard label="Below 75%" value={summary.below75} danger />
        </div>
      )}

      {isReady && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-[10px] sm:text-xs tracking-wide">
                <tr>
                  <th className="sm:hidden px-2 py-2">Student</th>

                  <th className="hidden sm:table-cell px-4 py-3">Roll No</th>
                  <th className="hidden sm:table-cell px-4 py-3">Name</th>

                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-center">Total</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-center">Present</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-center">%</th>
                </tr>
              </thead>

              <tbody>
                {loadingReport ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-2 sm:px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      Loading report...
                    </td>
                  </tr>
                ) : reportData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-2 sm:px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No report data available.
                    </td>
                  </tr>
                ) : (
                  reportData.map((student) => {
                    const low = Number(student.percentage) < 75;

                    return (
                      <tr
                        key={student.rollnumber}
                        className={`border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${
                          low ? "bg-red-50 dark:bg-red-900/20" : ""
                        }`}
                      >
                        <td className="sm:hidden px-2 py-2 dark:text-gray-200">
                          <div className="flex flex-col leading-tight">
                            <span className="font-medium text-xs truncate">
                              {student.rollnumber}
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                              {student.name}
                            </span>
                          </div>
                        </td>

                        <td className="hidden sm:table-cell px-4 py-3 dark:text-gray-200">
                          {student.rollnumber}
                        </td>

                        <td className="hidden sm:table-cell px-4 py-3 dark:text-gray-200 font-medium">
                          {student.name}
                        </td>

                        <td className="px-2 py-2 sm:px-4 sm:py-3 text-center dark:text-gray-200">
                          {student.total_classes}
                        </td>

                        <td className="px-2 py-2 sm:px-4 sm:py-3 text-center dark:text-gray-200">
                          {student.present_count}
                        </td>

                        <td
                          className={`px-2 py-2 sm:px-4 sm:py-3 text-center font-semibold ${
                            low
                              ? "text-red-600 dark:text-red-400"
                              : "dark:text-gray-100"
                          }`}
                        >
                          {student.percentage}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}