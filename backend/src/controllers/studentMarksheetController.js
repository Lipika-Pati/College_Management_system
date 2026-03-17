const db = require("../config/db");

// GET STUDENT MARKS
exports.getStudentMarks = async (req, res) => {

    try {

        const email = req.user.email;

        const query = `
            SELECT
                subject,
                internal_marks,
                external_marks,
                total_marks
            FROM marks
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
