import { resend } from "@/lib/resend";
import { ApiResponce } from "@/types/Apiresponce"; 
import EmailTemplate from "../../email/verificationEmail";
export async function  sendVerificationEmail(email:string,
    username : string,
    verifyCode :string
):Promise<ApiResponce> {
   try {

    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'verification code mistry-message',
        react: EmailTemplate({username, otp: verifyCode}) ,
      });
    
    console.log(data, error)
    
    return {success : true , message : "verification email sent successFully", statusCode: 200}
   } catch (emailError) {
    console.error("error sending verification email",
        emailError
    )

    return {success : false , message : "Failed to send verification email ", statusCode: 400}
    
   }
}
