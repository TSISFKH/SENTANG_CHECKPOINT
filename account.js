// ========================================
// SENTANG CHECKPOINT
// Account JavaScript
// ========================================


const accountLoading =
    document.getElementById(
        "accountLoading"
    );

const accountContent =
    document.getElementById(
        "accountContent"
    );

const loginRequired =
    document.getElementById(
        "loginRequired"
    );


const displayNameElement =
    document.getElementById(
        "displayName"
    );

const usernameElement =
    document.getElementById(
        "username"
    );

const emailElement =
    document.getElementById(
        "email"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


// ========================================
// ตรวจสอบ Login
// ========================================

async function loadAccount() {

    const token =
        localStorage.getItem(
            "sentangToken"
        );


    // ========================================
    // ยังไม่ได้ Login
    // ========================================

    if (!token) {

        accountLoading.hidden =
            true;

        loginRequired.hidden =
            false;

        return;

    }


    // ========================================
    // ขอข้อมูลจาก Server
    // ========================================

    try {

        const response =
            await fetch(
                "/api/auth/me",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const result =
            await response.json();


        // ========================================
        // Token หมดอายุ / ไม่ถูกต้อง
        // ========================================

        if (
            !response.ok ||
            !result.success
        ) {

            localStorage.removeItem(
                "sentangToken"
            );

            localStorage.removeItem(
                "sentangUser"
            );


            accountLoading.hidden =
                true;

            loginRequired.hidden =
                false;

            return;

        }


        // ========================================
        // แสดงข้อมูลบัญชี
        // ========================================

        const user =
            result.user;


        displayNameElement.textContent =
            user.displayName || "-";


        usernameElement.textContent =
            user.username || "-";


        emailElement.textContent =
            user.email || "ยังไม่มีข้อมูล";


        accountLoading.hidden =
            true;

        accountContent.hidden =
            false;


        // เก็บข้อมูลล่าสุด
        localStorage.setItem(
            "sentangUser",
            JSON.stringify(user)
        );


    } catch (error) {

        console.error(error);


        accountLoading.textContent =
            "ไม่สามารถโหลดข้อมูลบัญชีได้";

    }

}


// ========================================
// Logout
// ========================================

logoutButton.addEventListener(
    "click",
    async function () {

        const token =
            localStorage.getItem(
                "sentangToken"
            );


        try {

            if (token) {

                await fetch(
                    "/api/auth/logout",
                    {

                        method: "POST",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        }

                    }
                );

            }

        } catch (error) {

            console.error(error);

        }


        // ลบข้อมูล Login
        localStorage.removeItem(
            "sentangToken"
        );

        localStorage.removeItem(
            "sentangUser"
        );


        // กลับหน้า Login
        window.location.href =
            "login.html";

    }
);


// ========================================
// เริ่มระบบ
// ========================================

loadAccount();