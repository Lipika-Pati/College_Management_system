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
