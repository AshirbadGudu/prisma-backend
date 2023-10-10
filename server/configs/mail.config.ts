import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import { configs } from "../configs";

let transporter: Transporter;

if (configs?.MAIL_SERVICE === "gmail") {
  transporter = nodemailer.createTransport({
    service: configs.MAIL_SERVICE,
    auth: {
      user: configs.MAIL_USER,
      pass: configs.MAIL_PASS,
    },
  });
}

if (configs?.MAIL_HOST.includes("zeptomail")) {
  transporter = nodemailer.createTransport({
    host: configs.MAIL_HOST,
    port: +configs?.PORT!,
    auth: {
      user: configs.MAIL_USER,
      pass: configs.MAIL_PASS,
    },
  });
}

export const mailService = (mailOptions: SendMailOptions) => {
  try {
    transporter.sendMail(
      {
        from: configs.MAIL_FROM,
        ...mailOptions,
      },
      (error, info) => {
        if (error) {
          console.log(error);
          throw new Error("Error");
        }
        console.log("Info", info.response);
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};
