import { useEffect, useState } from "react";
import api from "../../utils/api";

const StudentDashboard = () => {

    const token = localStorage.getItem("token");

    const [student, setStudent] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchStudent = async () => {

            try {

                const res = await api.get(
                    "/api/student/dashboard",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setStudent(res.data);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }

        };

        if (token) fetchStudent();

    }, [token]);

    return (

        <div className="space-y-10">

            {/* Page Title */}

            <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    Student Dashboard
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    View your profile, attendance, and marks.
                </p>
            </div>

            {/* Student Information Cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <DashboardCard
                    title="Name"
                    value={
                        loading
                            ? "--"
                            : `${student.firstname || ""} ${student.lastname || ""}`
                    }
                />

                <DashboardCard
                    title="Roll Number"
                    value={loading ? "--" : student.rollnumber}
                />

                <DashboardCard
                    title="Course"
                    value={loading ? "--" : student.Courcecode}
                />

                <DashboardCard
                    title="Semester"
                    value={loading ? "--" : student.semoryear}
                />

            </div>

            {/* System Information */}

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm transition-colors">

                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-6">
                    Student Portal
                </h3>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">

                    <p>
                        Access your attendance reports and marksheets.
                    </p>

                    <p>
                        Update your profile information anytime.
                    </p>

                </div>

            </div>

        </div>

    );

};

const DashboardCard = ({ title, value }) => (

    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm transition-colors">

        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {title}
        </p>

        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-2">
            {value}
        </p>

    </div>

);

export default StudentDashboard;
    
