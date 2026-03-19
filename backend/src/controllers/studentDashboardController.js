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


/* =========================
   Update Password
========================= */

exports.updatePassword = async (req, res) => {

  try {

    const email = req.user.email;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE students SET password=? WHERE emailid=?",
      [hashedPassword, email]
    );

    res.json({ message: "Password updated successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Password update failed" });

  }

};


/* =========================
   Update Date of Birth
========================= */

exports.updateDOB = async (req, res) => {

  try {

    const email = req.user.email;
    const { dateofbirth } = req.body;

    await db.query(
      "UPDATE students SET dateofbirth=? WHERE emailid=?",
      [dateofbirth, email]
    );

    res.json({ message: "DOB updated successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "DOB update failed" });

  }

};


/* =========================
   Get Student Attendance
========================= */

exports.getStudentAttendance = async (req, res) => {

  try {

    const email = req.user.email;

    const [rows] = await db.query(
      "SELECT subject, date, status FROM attendance WHERE student_email=?",
      [email]
    );

    res.json(rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error loading attendance" });

  }

};


/* =========================
   Get Student Marksheet
========================= */

exports.getStudentMarksheet = async (req, res) => {

  try {

    const email = req.user.email;

    const [rows] = await db.query(
      "SELECT subject, marks FROM marksheets WHERE student_email=?",
      [email]
    );

    res.json(rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error loading marksheet" });

  }

};
