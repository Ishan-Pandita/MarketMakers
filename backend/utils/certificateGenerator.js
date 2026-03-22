const PDFDocument = require("pdfkit");

/**
 * Generates a professional certificate PDF as a readable stream.
 * @param {Object} data - Certificate data
 * @param {string} data.learnerName - Name of the learner
 * @param {string} data.courseName - Name of the course
 * @param {string} data.instructorName - Name of the course instructor
 * @param {string} data.examTitle - Title of the exam
 * @param {number} data.score - Score achieved
 * @param {string} data.date - Completion date
 * @param {string} data.certificateId - Unique certificate ID
 * @returns {PDFDocument} PDF document stream
 */
const generateCertificate = (data) => {
  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const width = doc.page.width;
  const height = doc.page.height;

  // ─── Background ───
  doc.rect(0, 0, width, height).fill("#FAFBFF");

  // Outer border
  doc
    .lineWidth(3)
    .rect(20, 20, width - 40, height - 40)
    .stroke("#6366F1");

  // Inner border
  doc
    .lineWidth(1)
    .rect(30, 30, width - 60, height - 60)
    .stroke("#A5B4FC");

  // Corner decorations
  const cornerSize = 40;
  const corners = [
    [35, 35],
    [width - 35 - cornerSize, 35],
    [35, height - 35 - cornerSize],
    [width - 35 - cornerSize, height - 35 - cornerSize],
  ];

  corners.forEach(([x, y]) => {
    doc
      .rect(x, y, cornerSize, cornerSize)
      .lineWidth(1.5)
      .stroke("#6366F1");
  });

  // ─── Header accent line ───
  doc
    .moveTo(100, 80)
    .lineTo(width - 100, 80)
    .lineWidth(2)
    .stroke("#6366F1");

  // ─── Platform name ───
  doc
    .fontSize(14)
    .font("Helvetica")
    .fillColor("#6366F1")
    .text("MARKETMAKERS", 0, 95, { align: "center" });

  // ─── Title ───
  doc
    .fontSize(38)
    .font("Helvetica-Bold")
    .fillColor("#1E293B")
    .text("Certificate of Completion", 0, 125, { align: "center" });

  // Decorative line under title
  const lineY = 175;
  const lineW = 200;
  doc
    .moveTo(width / 2 - lineW / 2, lineY)
    .lineTo(width / 2 + lineW / 2, lineY)
    .lineWidth(2)
    .stroke("#14B8A6");

  // ─── "This is to certify" ───
  doc
    .fontSize(13)
    .font("Helvetica")
    .fillColor("#64748B")
    .text("This is to certify that", 0, 200, { align: "center" });

  // ─── Learner name ───
  doc
    .fontSize(32)
    .font("Helvetica-Bold")
    .fillColor("#6366F1")
    .text(data.learnerName, 0, 225, { align: "center" });

  // Underline for name
  const nameWidth = doc.widthOfString(data.learnerName);
  doc
    .moveTo(width / 2 - nameWidth / 2 - 20, 265)
    .lineTo(width / 2 + nameWidth / 2 + 20, 265)
    .lineWidth(1)
    .stroke("#A5B4FC");

  // ─── "has successfully completed" ───
  doc
    .fontSize(13)
    .font("Helvetica")
    .fillColor("#64748B")
    .text("has successfully completed the certification exam for", 0, 280, {
      align: "center",
    });

  // ─── Course name ───
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor("#1E293B")
    .text(data.courseName, 0, 305, { align: "center" });

  // ─── Score badge ───
  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor("#64748B")
    .text(`with a score of ${data.score}%`, 0, 340, { align: "center" });

  // ─── Bottom section: Instructor & Date ───
  const bottomY = 390;

  // Left: Date
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#94A3B8")
    .text("Date of Completion", 120, bottomY, { align: "left" });

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor("#1E293B")
    .text(data.date, 120, bottomY + 18, { align: "left" });

  doc
    .moveTo(120, bottomY + 38)
    .lineTo(300, bottomY + 38)
    .lineWidth(1)
    .stroke("#CBD5E1");

  // Right: Instructor
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#94A3B8")
    .text("Course Instructor", width - 300, bottomY, {
      width: 180,
      align: "right",
    });

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor("#1E293B")
    .text(data.instructorName, width - 300, bottomY + 18, {
      width: 180,
      align: "right",
    });

  doc
    .moveTo(width - 300, bottomY + 38)
    .lineTo(width - 120, bottomY + 38)
    .lineWidth(1)
    .stroke("#CBD5E1");

  // ─── Certificate ID footer ───
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("#94A3B8")
    .text(
      `Certificate ID: ${data.certificateId}`,
      0,
      height - 55,
      { align: "center" }
    );

  // Bottom accent line
  doc
    .moveTo(100, height - 80)
    .lineTo(width - 100, height - 80)
    .lineWidth(2)
    .stroke("#6366F1");

  doc.end();
  return doc;
};

module.exports = { generateCertificate };
