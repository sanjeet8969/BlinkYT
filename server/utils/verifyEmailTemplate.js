const verifyEmailTemplate=(name,url)=>{
    return `
    <p> Dear ${name},</p>
        <p> Thank you for signing up with Blinkyt. Please click on the link below to verify your email address.</p>
        <a href=${url} style="background-color:blue;color:white;padding:10px;border-radius:5px;font-size:16px;">
        verify email
        </a>
        <p>If you did not sign up for Blinkyt, please ignore this email.</p>
        <p>Blinkyt Team</p>
        <p>Blinkyt.com</p>
        <p>+91 9876543210</p>
        <p>info@blinkyt.com</p>
        <p>www.blinkyt.com</p>

        `
}

export default verifyEmailTemplate;