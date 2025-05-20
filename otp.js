function generateOTP() {
    const length = parseInt(document.getElementById("otp-length").value);
    const type = document.getElementById("otp-type").value;
    let otp = '';
    const chars = {
        numeric: '0123456789',
        alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        hex: '0123456789ABCDEF'
    };
    const charset = chars[type] || chars.numeric;
    for (let i = 0; i < length; i++) {
        otp += charset[Math.floor(Math.random() * charset.length)];
    }
    let otpElement = document.getElementById("otp");
    otpElement.textContent = otp;
    otpElement.classList.remove("otp-show");
    setTimeout(() => {
        otpElement.classList.add("otp-show");
        pulseOTP(otpElement);
    }, 100);
    startOTPTimer();
    autoCopyOTP();
    showToast('OTP generated & copied!', 'success');
}

function autoCopyOTP() {
    const otp = document.getElementById("otp").textContent;
    if (!otp) return;
    navigator.clipboard.writeText(otp);
}

function copyOTP() {
    const otp = document.getElementById("otp").textContent;
    if (!otp) return;
    navigator.clipboard.writeText(otp).then(() => {
        showToast("Copied!", "success");
    });
}

function showToast(msg, type) {
    const status = document.getElementById("copy-status");
    status.textContent = msg;
    status.classList.add('show');
    status.style.color = type === 'success' ? 'var(--success)' : 'var(--error)';
    setTimeout(() => status.classList.remove('show'), 1200);
}

// Modern pulse animation for OTP
function pulseOTP(target) {
    target.style.boxShadow = '0 0 0 0 #ffd60088';
    target.animate([
        { boxShadow: '0 0 0 0 #ffd60088' },
        { boxShadow: '0 0 0 12px #ffd60044' },
        { boxShadow: '0 0 0 0 #ffd60000' }
    ], {
        duration: 600,
        easing: 'cubic-bezier(.68,-0.55,.27,1.55)'
    });
    setTimeout(() => { target.style.boxShadow = ''; }, 650);
}

function startOTPTimer() {
    const timerDisplay = document.getElementById("otp-timer");
    let time = 60;
    updateTimerCircle(1);
    timerDisplay.textContent = `Expires in: ${time}s`;
    timerDisplay.style.color = 'var(--accent)';
    if (window.otpTimer) clearInterval(window.otpTimer);
    window.otpTimer = setInterval(() => {
        time--;
        updateTimerCircle(time/60);
        if (time > 0) {
            timerDisplay.textContent = `Expires in: ${time}s`;
        } else {
            timerDisplay.textContent = "OTP expired. Generate again!";
            timerDisplay.style.color = 'var(--error)';
            document.getElementById("otp").textContent = '';
            updateTimerCircle(0);
            clearInterval(window.otpTimer);
        }
    }, 1000);
}

// Circular timer progress
function updateTimerCircle(progress) {
    const circle = document.getElementById('timer-fg');
    if (!circle) return;
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference * (1 - progress)}`;
}

// QR Code generation (uses QRCode.js CDN)
function showQR() {
    const otp = document.getElementById("otp").textContent;
    if (!otp) {
        showToast("Generate OTP first!", "error");
        return;
    }
    document.getElementById("qr-modal").style.display = "flex";
    document.getElementById("qr-otp-value").textContent = otp;
    // Remove previous QR if any
    const qrDiv = document.getElementById("qr-code");
    qrDiv.innerHTML = '';
    // Use CDN QRCode.js
    if (typeof QRCode === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.onload = () => new QRCode(qrDiv, { text: otp, width: 180, height: 180, colorDark: "#0f172a", colorLight: "#fff", correctLevel: QRCode.CorrectLevel.H });
        document.body.appendChild(script);
    } else {
        new QRCode(qrDiv, { text: otp, width: 180, height: 180, colorDark: "#0f172a", colorLight: "#fff", correctLevel: QRCode.CorrectLevel.H });
    }
}
function closeQR() {
    document.getElementById("qr-modal").style.display = "none";
}

// Speech OTP (Text-to-Speech)
function speakOTP() {
    const otp = document.getElementById("otp").textContent;
    if (!otp) {
        showToast("Generate OTP first!", "error");
        return;
    }
    const msg = new SpeechSynthesisUtterance(`Your one time password is ${otp.split('').join(' ')}`);
    msg.lang = 'en-US';
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
    showToast("Speaking OTP", "success");
}

// Loader control functions
// function showLoader() {
//   document.getElementById('loader-overlay').style.display = 'flex';
// }
// function hideLoader() {
//   document.getElementById('loader-overlay').style.display = 'none';
// }
// window.addEventListener('DOMContentLoaded', () => {
//   showLoader();
//   setTimeout(hideLoader, 900);
// });