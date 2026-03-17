import { useEffect, useState, useMemo } from "react";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import api from "../../utils/api";
import MarksheetLayout from "./MarksheetLayout";

const PrintMarksheet = () => {

    const token = localStorage.getItem("token");
    const params = new URLSearchParams(window.location.search);
    const isPrintMode = params.get("print") === "true";

    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSem, setSelectedSem] = useState("");
    const [selectedRoll, setSelectedRoll] = useState("");

    const [marksheet, setMarksheet] = useState(null);
    const [error, setError] = useState("");

    const [hash, setHash] = useState("");

    const getAuthHeader = () => {
        if (isPrintMode) return {};
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get("/api/courses", {
                    headers: getAuthHeader()
                });
                setCourses(res.data || []);
            } catch {
                setCourses([]);
            }
        };
        fetchCourses();
    }, []);

    const selectedCourseObj = useMemo(() => {
        return courses.find(c => c.course_code === selectedCourse);
    }, [courses, selectedCourse]);

    const semLabel =
        selectedCourseObj?.sem_or_year?.toLowerCase() === "year"
            ? "Year"
            : "Semester";

    const semesterOptions = useMemo(() => {
        if (!selectedCourseObj) return [];
        const total = Number(selectedCourseObj.total_semesters);
        return Array.from({ length: total }, (_, i) => i + 1);
    }, [selectedCourseObj]);

    useEffect(() => {
        if (!selectedCourse || !selectedSem) return;

        const fetchStudents = async () => {
            try {
                const res = await api.get(
                    `/api/marks/students?course=${selectedCourse}&sem=${selectedSem}`,
                    { headers: getAuthHeader() }
                );
                setStudents(res.data || []);
            } catch {
                setStudents([]);
            }
        };

        fetchStudents();
    }, [selectedCourse, selectedSem]);

    useEffect(() => {
        const shouldPrint = params.get("print");

        if (shouldPrint === "true") {
            const course = params.get("course");
            const sem = params.get("sem");
            const roll = params.get("roll");

            if (course && sem && roll) {
                setSelectedCourse(course);
                setSelectedSem(sem);
                setSelectedRoll(roll);

                (async () => {
                    try {
                        const res = await api.get(
                            `/api/marks/student-marks?course=${course}&sem=${sem}&roll=${roll}`,
                            { headers: getAuthHeader() }
                        );
                        setMarksheet(res.data);
                    } catch (e) {
                        console.error("Restore fetch failed:", e);
                    }
                })();
            }
        }
    }, []);

    useEffect(() => {
        if (isPrintMode && marksheet) {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [marksheet]);

    const loadMarksheet = async () => {
        if (!selectedCourse || !selectedSem || !selectedRoll) {
            setError("Please select course, semester and student.");
            return;
        }

        try {
            const res = await api.get(
                `/api/marks/student-marks?course=${selectedCourse}&sem=${selectedSem}&roll=${selectedRoll}`,
                { headers: getAuthHeader() }
            );

            setMarksheet(res.data);
            setError("");
        } catch {
            setError("Failed to load marksheet.");
        }
    };

    const getGrade = (percentage) => {
        if (percentage >= 90) return "O";
        if (percentage >= 80) return "A+";
        if (percentage >= 70) return "A";
        if (percentage >= 60) return "B+";
        if (percentage >= 50) return "B";
        if (percentage >= 40) return "C";
        return "F";
    };

    const downloadPDF = async () => {
        try {
            if (!marksheet) {
                setError("Load marksheet first.");
                return;
            }

            if (window.electronAPI) {
                window.electronAPI.printMarksheet();
                return;
            }

            if (Capacitor.isNativePlatform()) {
                try {
                    const FRONTEND_URL = import.meta.env.VITE_FRONTEND;

                    const url = new URL(`${FRONTEND_URL}/#/print-marksheet`);

                    url.searchParams.set("print", "true");
                    url.searchParams.set("course", selectedCourse);
                    url.searchParams.set("sem", selectedSem);
                    url.searchParams.set("roll", selectedRoll);

                    window.open(url.toString(), "_system");

                } catch (e) {
                    console.error("Browser open failed:", e);
                    setError("Failed to open print view.");
                }

                return;
            }

            window.print();

        } catch (e) {
            console.error("Print error:", e);
            setError("Something went wrong while printing.");
        }
    };

    const marksheetCode = `MS-${selectedCourse}-${selectedSem}-${selectedRoll}`;

    const verificationUrl =
        `${window.location.origin}/verify/marksheet/${marksheetCode}`;

    const summary = marksheet?.summary;

    useEffect(() => {
        const generateHash = async () => {
            if (!marksheet?.marks) return;

            const dataString = JSON.stringify({
                course: selectedCourse,
                semester: selectedSem,
                roll: selectedRoll,
                marks: marksheet.marks
            });

            const encoder = new TextEncoder();
            const data = encoder.encode(dataString);

            const hashBuffer = await crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));

            const hashHex = hashArray
                .map(b => b.toString(16).padStart(2, "0"))
                .join("");

            setHash(hashHex);
        };

        generateHash();
    }, [marksheet]);

    const courseDisplay = useMemo(() => {
        if (!marksheet?.marks?.length) return "";

        const code = marksheet.marks[0].courcecode;
        const course = courses.find(c => c.course_code === code);

        if (!course) return code;

        return `${course.course_name} (${code})`;
    }, [marksheet, courses]);

    return (

        <div className={isPrintMode ? "" : "space-y-10"}>

            {!isPrintMode && (
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        Student Marksheet
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Generate and download semester marksheets.
                    </p>
                </div>
            )}

            {!isPrintMode && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.course_code}>
                                {course.course_name}
                            </option>
                        ))}
                    </select>

                    <select value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)}>
                        <option value="">Select {semLabel}</option>
                        {semesterOptions.map(num => (
                            <option key={num} value={num}>
                                {semLabel} {num}
                            </option>
                        ))}
                    </select>

                    <select value={selectedRoll} onChange={(e) => setSelectedRoll(e.target.value)}>
                        <option value="">Select Student</option>
                        {students.map(s => (
                            <option key={s.rollnumber} value={s.rollnumber}>
                                {s.rollnumber} - {s.firstname} {s.lastname}
                            </option>
                        ))}
                    </select>

                    <button onClick={loadMarksheet}>
                        Load Marksheet
                    </button>
                </div>
            )}

            {marksheet && (
                <div>
                    {!isPrintMode && (
                        <button onClick={downloadPDF}>
                            Download PDF
                        </button>
                    )}

                    <MarksheetLayout
                        marksheet={marksheet}
                        semLabel={semLabel}
                        selectedSem={selectedSem}
                        marksheetCode={marksheetCode}
                        verificationUrl={verificationUrl}
                        summary={summary}
                        hash={hash}
                        courseDisplay={courseDisplay}
                        getGrade={getGrade}
                    />
                </div>
            )}

        </div>
    );
};

export default PrintMarksheet;