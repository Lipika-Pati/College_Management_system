import { useState } from "react";
import api from "../../utils/api";

const StudentProfile = () => {

    const token = localStorage.getItem("token");

    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.put(
                "/api/student/profile",
                { password, dob },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Profile updated successfully");

        } catch (error) {
            console.error(error);
        }

    };

    return (

        <div>

            <h2>Update Profile</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                    />
                </div>

                <button type="submit">
                    Update Profile
                </button>

            </form>

        </div>

    );

};

export default StudentProfile;

