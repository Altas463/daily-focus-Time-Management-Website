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
    subject: "⏰ Nhắc nhở task sắp đến hạn!",
    html: `
      <h2>🔔 Nhắc nhở task: <strong>${taskTitle}</strong></h2>
      <p>Deadline của task là: <strong>${deadline}</strong></p>
      <p>Hãy hoàn thành đúng hạn nhé! 🚀</p>
    `,
  });
};
