import nodemailer from "nodemailer";

export const emailScorecard = ({ emailAddress, filePath, teamName, date }) => {
  if (!emailAddress) {
    return; // can't email without an address
  }

  const {
    SMTP_HOST,
    SMTP_USER,
    SMTP_PASSWORD,
    SENDER_EMAIL_ADDRESS,
  } = process.env;

  const transporter = nodemailer.createTransport({
    port: 465,
    host: SMTP_HOST,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  // Make sure it doesn't send real users mail during development
  const to =
    process.env.USE_REAL_EMAILS === "true" ? emailAddress : "edmofro@gmail.com";
  const filename = filePath.split("/")[filePath.split("/").length - 1];
  return transporter.sendMail({
    from: SENDER_EMAIL_ADDRESS,
    to,
    subject: `Your Locked Down Trivia scorecard for ${date}`,
    text: `
Thanks for joining us for this week's Locked Down Trivia!

Your scorecard is attached. Nice work ${teamName} :-)


    `,
    attachments: [
      {
        filename,
        path: filePath,
      },
    ],
  });
};
