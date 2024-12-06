import nodemailer from "nodemailer";
import configs from "../../../configs";

const emailSender = async (email: string, html: string)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",  // add gmail host name
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: configs.emailSender.email,
          pass: configs.emailSender.app_pass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
  
        const info = await transporter.sendMail({
          from: '"Online Shop" <anamulhaque9901@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Reset Password Link", // Subject line
          // text: "Hello world?", // plain text body
          html, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
       
}

export default emailSender;
