const db = require("../config/db");
const bcrypt = require("bcrypt");

/* =========================
   Get Student Dashboard
========================= */

exports.getDashboard = async (req, res) => {

  try {

    const email = req.user.email;

    const [rows] = await db.query(
      "SELECT firstname, lastname, rollnumber, Coursecode, semoryear, profilePic FROM students WHERE emailid=?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error loading dashboard" });

  }

};
