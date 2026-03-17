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
