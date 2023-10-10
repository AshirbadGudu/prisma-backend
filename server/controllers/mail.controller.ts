import { RequestHandler } from "express";
import { configs, transporter } from "../configs";

export const mailController: {
  send: RequestHandler;
} = {
  async send(req, res, next) {
    try {
      transporter()?.sendMail(
        {
          from: configs.MAIL_FROM,
          ...(req?.body || {}),
        },
        (error, info) => {
          console.log(error);
          if (error) throw new Error("Error");
          res.send({
            success: true,
            msg: "Mail sent successfully",
            data: info,
          });
        }
      );
    } catch (error) {
      next(error);
    }
  },
};
