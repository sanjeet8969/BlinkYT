const forgotPasswordTemplate=({name,otp})=>{    
    return`
    
    <p>Dear ${name},</p>
    <p>Please use the following OTP to reset your password.</p>
    <div style="background-color:blue;color:white;padding:10px;border-radius:5px;font-size:16px;">
    <p>OTP: 
    ${otp}
    </p>
    </div>
    
    <p>This otp is valid for only 1 hour. Enter the otp in blinkyIt app to reset your password.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Blinkyt Team</p>
    <p>Blinkyt.com</p>
    <p>+91 9876543210</p>
    <p>info@blinkyt.com</p>
    
    
    `

}

export default forgotPasswordTemplate;