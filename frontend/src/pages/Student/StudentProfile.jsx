import { useEffect, useState } from "react";
import api from "../../utils/api";

const StudentProfile = () => {
    const token = localStorage.getItem("token");

    const [student, setStudent] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            try {
                const res = await api.get("/api/student/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudent(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProfile();
    }, [token]);

    if (!student) {
        return (
            <p className="text-sm text-gray-500">
                Loading student profile...
            </p>
        );
    }

    return (
        <div className="space-y-8">

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6">

                <img
                    src={
                        student?.profilePic
                            ? `${api.defaults.baseURL}${student.profilePic}`
                            : `${api.defaults.baseURL}/uploads/student/default.png`
                    }
                    alt="Student"
                    className="h-24 w-24 rounded-full object-cover border shadow"
                />

                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {student.name}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Roll No: {student.rollNumber}
                    </p>
                </div>

                <div className="sm:ml-auto">
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Academic Info */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-5">
                    Academic Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <InfoField label="Course" value={student.course} />
                    <InfoField label="Year" value={student.year} />
                    <InfoField label="Department" value={student.department} />
                    <InfoField label="Semester" value={student.semester} />
                </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-5">
                    Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <InfoField label="Email" value={student.email} />
                    <InfoField label="Phone" value={student.phone} />
                    <InfoField label="Address" value={student.address} />
                    <InfoField label="Date of Birth" value={student.dob} />
                </div>
            </div>

            {showEditModal && (
                <EditStudentModal
                    student={student}
                    token={token}
                    onClose={(updatedData) => {
                        setShowEditModal(false);
                        if (updatedData) setStudent(updatedData);
                    }}
                />
            )}
        </div>
    );
};

/* Info Field */
const InfoField = ({ label, value }) => (
    <div>
        <p className="text-gray-500 text-xs mb-1">{label}</p>
        <p className="text-gray-800 break-words">
            {value || "-"}
        </p>
    </div>
);

/* ---------------- Edit Modal ---------------- */

const EditStudentModal = ({ student, token, onClose }) => {
    const [form, setForm] = useState({ ...student });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await api.put("/api/student/profile", form, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const res = await api.get("/api/student/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });

            onClose(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">

                <h2 className="text-lg font-semibold mb-5">
                    Edit Student Profile
                </h2>

                <div className="space-y-4">
                    <input
                        name="name"
                        value={form.name || ""}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full border px-3 py-2 rounded-md text-sm"
                    />

                    <input
                        name="phone"
                        value={form.phone || ""}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="w-full border px-3 py-2 rounded-md text-sm"
                    />

                    <input
                        name="address"
                        value={form.address || ""}
                        onChange={handleChange}
                        placeholder="Address"
                        className="w-full border px-3 py-2 rounded-md text-sm"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => onClose(null)}
                        className="px-4 py-2 text-sm border rounded-md"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
