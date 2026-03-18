import { useEffect, useState } from "react";
import api from "../../utils/api";

const StudentAttendance = () => {

    const token = localStorage.getItem("token");

    const [attendance, setAttendance] = useState([]);

    useEffect(() => {

        const fetchAttendance = async () => {

            try {

                const res = await api.get(
                    "/api/student/attendance",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setAttendance(res.data);

            } catch (error) {
                console.error(error);
            }

        };

        fetchAttendance();

    }, []);

    return (

        <div className="space-y-8">

            <h2 className="text-2xl font-semibold">
                My Attendance
            </h2>

            <table className="w-full border">

                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Subject</th>
                        <th className="p-2 border">Total Classes</th>
                        <th className="p-2 border">Attended</th>
                        <th className="p-2 border">Percentage</th>
                    </tr>
                </thead>

                <tbody>

                    {attendance.map((item, index) => {

                        const percentage =
                            ((item.attended_classes / item.total_classes) * 100).toFixed(1);

                        return (

                            <tr key={index}>

                                <td className="border p-2">
                                    {item.subject}
                                </td>

                                <td className="border p-2">
                                    {item.total_classes}
                                </td>

                                <td className="border p-2">
                                    {item.attended_classes}
                                </td>

                                <td className="border p-2">
                                    {percentage}%
                                </td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>

        </div>

    );

};

export default StudentAttendance;

    
