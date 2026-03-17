const db = require("../config/db");

// GET STUDENT ATTENDANCE
exports.getStudentAttendance = async (req, res) => {

    try {

        const email = req.user.email;

        const query = `
            SELECT
                subject,
                total_classes,
                attended_classes
            FROM attendance
            WHERE student_email = ?
        `;

        const [rows] = await db.query(query, [email]);

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};
