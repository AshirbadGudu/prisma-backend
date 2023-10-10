import nodemailer from "nodemailer";
import { configs } from "../configs";

const transporter = () => {
  if (configs?.MAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: configs.MAIL_SERVICE,
      auth: {
        user: configs.MAIL_USER,
        pass: configs.MAIL_PASS,
      },
    });
  }

  if (configs?.MAIL_HOST.includes("zeptomail")) {
    return nodemailer.createTransport({
      host: configs.MAIL_HOST,
      port: +configs?.MAIL_PORT!,
      auth: {
        user: configs.MAIL_USER,
        pass: configs.MAIL_PASS,
      },
    });
  }
};

export { transporter };
