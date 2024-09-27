import { IOtp } from "../../interfaces/otp";
import { OtpRepository } from "../../repositories/implements/otpRepository";
import {IOtpService} from '../interfaces/otpService.interface'
import otpGenerator from 'otp-generator'
import nodemailer from 'nodemailer'

export class OtpService implements IOtpService{
    private otpRepository : OtpRepository;
    constructor(){
        this.otpRepository = new OtpRepository()
    }
    async createOtp(otpData: IOtp): Promise<IOtp | undefined> {
        const otp= await this.otpRepository.findOtp(otpData.email)
        if(!otp){
            return this.otpRepository.createOtp(otpData)
        }else{
            return this.otpRepository.updateOtp(otpData)
        }
    }
    async findOtp(email: string): Promise<IOtp | null> {
        return await this.otpRepository.findOtp(email)
    }
    generateOtp():string{
        const generatedOtp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          });
          console.log(generatedOtp);
          return generatedOtp;
    }
    async sendOtpMail(email: string, otp: string): Promise<void> {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          service: "Gmail",
          secure: true,
          auth: {
            user: process.env.TRANSPORTER_EMAIL,
            pass: process.env.TRANSPORTER_PASSWORD,
          },
        });
        transporter.sendMail({
          to: email,
          from: process.env.TRANSPORTER_EMAIL,
          subject: "Synapse OTP Verification",
          html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
              </div>
              <p style="font-size:1.1em">Hi,</p>
              <p>Thank you for choosing Synapse. Use the following OTP to complete your Sign Up procedures.
               OTP is valid for 10 minutes</p>
              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color:
               #fff;border-radius: 4px;">${otp}</h2>
              <p style="font-size:0.9em;">Regards,<br />EduVista</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>Synapse</p>
                <p>Tidel Park</p>
                <p>Chennai</p>
                <p>India</p>
              </div>
            </div>
          </div>`,
        });
      }

}