function generateOTP(length = 4) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }

    let otpElement = document.getElementById("otp");
    otpElement.textContent = otp; 


    otpElement.classList.remove("otp-show"); 
    setTimeout(() => {
        otpElement.classList.add("otp-show");
    }, 100);
}