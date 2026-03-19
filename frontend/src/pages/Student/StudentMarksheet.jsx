import { useEffect, useState } from "react";
import api from "../../utils/api";

const StudentMarksheet = () => {

    const token = localStorage.getItem("token");

    const [marks, setMarks] = useState([]);

    useEffect(() => {

        const fetchMarks = async () => {

            try {

                const res = await api.get(
                    "/api/student/marks",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setMarks(res.data);

            } catch (error) {
                console.error(error);
            }

        };

        fetchMarks();

    }, []);

    return (

        <div className="space-y-8">

            <h2 className="text-2xl font-semibold">
                My Marksheet
            </h2>

            <table className="w-full border">

                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Subject</th>
                        <th className="p-2 border">Internal</th>
                        <th className="p-2 border">External</th>
                        <th className="p-2 border">Total</th>
                    </tr>
                </thead>

                <tbody>

                    {marks.map((item, index) => (

                        <tr key={index}>

                            <td className="border p-2">
                                {item.subject}
                            </td>

                            <td className="border p-2">
                                {item.internal_marks}
                            </td>

                            <td className="border p-2">
                                {item.external_marks}
                            </td>

                            <td className="border p-2">
                                {item.total_marks}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

};

export default StudentMarksheet;


