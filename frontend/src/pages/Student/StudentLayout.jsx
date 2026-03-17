import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Sun, Moon } from "lucide-react";

const StudentLayout = () => {

    const BASE_URL = api.defaults.baseURL;
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [student, setStudent] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme) return savedTheme;

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    /* ===================== Fetch Student ===================== */

    useEffect(() => {

        if (!token) return;

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
            }

        };

        fetchStudent();

    }, [token]);

    /* ===================== Logout ===================== */

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("lastPage");

        navigate("/", { replace: true });

    };

    /* ===================== Theme ===================== */

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    };

    /* ===================== Menu ===================== */

    const menuItems = [

        { name: "Dashboard", path: "/student/dashboard" },
        { name: "My Profile", path: "/student/profile" },
        { name: "Attendance", path: "/student/attendance" },
        { name: "Marksheet", path: "/student/marksheet" }

    ];

    return (

        <div className="h-screen flex bg-gray-100 dark:bg-gray-950 overflow-hidden">

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-40 transform transition-transform duration-300
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0`}
            >

                {/* Student Info */}
                <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700 flex flex-col items-center">

                    {/* Profile Image */}
                    <img
                        src={
                            student?.profilePic
                                ? `${BASE_URL}/uploads/${student.profilePic}`
                                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-md mb-3 hover:scale-105 transition"
                    />

                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center">
                        Student Portal
                    </p>

                    <p className="text-xs text-gray-400 text-center">
                        College Management System
                    </p>

                    {student && (
                        <div className="mt-4 text-xs space-y-1 text-center">

                            <p className="text-gray-600 dark:text-gray-300">
                                <b>Name:</b> {student.firstname} {student.lastname}
                            </p>

                            <p className="text-gray-600 dark:text-gray-300">
                                <b>Roll:</b> {student.rollnumber}
                            </p>

                            <p className="text-gray-600 dark:text-gray-300">
                                <b>Course:</b> {student.Courcecode}
                            </p>

                        </div>
                    )}

                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

                    {menuItems.map((item) => {

                        const isActive = location.pathname === item.path;

                        return (

                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => {
                                    if (window.innerWidth < 1024) {
                                        setIsSidebarOpen(false);
                                    }
                                }}
                                className={`block px-4 py-2 rounded-md text-sm font-medium transition ${
                                    isActive
                                        ? "bg-gray-900 text-white dark:bg-gray-700"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                {item.name}
                            </Link>

                        );

                    })}

                </nav>

            </aside>

            {/* Main Area */}
            <div className="flex-1 min-w-0 flex flex-col lg:ml-64">

                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 lg:px-8">

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-gray-700 dark:text-gray-300 text-xl"
                        >
                            ☰
                        </button>

                        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Student Panel
                        </h1>

                    </div>

                    <div className="flex items-center gap-6">

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                        >

                            {theme === "dark"
                                ? <Sun size={20} className="text-gray-300" />
                                : <Moon size={20} className="text-gray-700" />
                            }

                        </button>

                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                        >
                            Logout
                        </button>

                    </div>

                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 lg:p-8 min-h-[80vh]">

                        <Outlet />

                    </div>

                </main>
        </div>
    );

    

        

