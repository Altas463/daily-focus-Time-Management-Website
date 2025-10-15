import nodemailer from "nodemailer";

export const sendDeadlineReminder = async (
  to: string,
  taskTitle: string,
  deadline: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Daily Focus" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Task Due Soon Reminder",
    html: `
      <h2>Reminder: <strong>${taskTitle}</strong></h2>
      <p>This task is due by: <strong>${deadline}</strong></p>
      <p>You've got this — stay focused!</p>
    `,
  });
};
