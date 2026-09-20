// ========================================
// SENTANG CHECKPOINT
// Account JavaScript
// ========================================

const API_URL =
    "https://sentang-checkpoint-api.onrender.com";

const accountLoading =
    document.getElementById("accountLoading");

const accountContent =
    document.getElementById("accountContent");

const loginRequired =
    document.getElementById("loginRequired");

const displayNameElement =
    document.getElementById("displayName");

const usernameElement =
    document.getElementById("username");

const emailElement =
    document.getElementById("email");

const editDisplayNameButton =
    document.getElementById("editDisplayNameButton");

const displayNameEditor =
    document.getElementById("displayNameEditor");

const newDisplayNameInput =
    document.getElementById("newDisplayName");

const saveDisplayNameButton =
    document.getElementById("saveDisplayNameButton");

const cancelDisplayNameButton =
    document.getElementById("cancelDisplayNameButton");

const displayNameStatus =
    document.getElementById("displayNameStatus");

const logoutButton =
    document.getElementById("logoutButton");


// ========================================
// ตรวจสอบ Login และโหลดข้อมูลบัญชี
// ========================================

async function loadAccount() {

    const token =
        localStorage.getItem("sentangToken");


    // ========================================
    // ยังไม่ได้ Login
    // ========================================

    if (!token) {

        accountLoading.hidden = true;
        loginRequired.hidden = false;

        return;
    }


    // ========================================
    // ขอข้อมูลจาก Server
    // ========================================

    try {

        const response =
            await fetch(
                `${API_URL}/api/auth/me`,
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
        // Token ไม่ถูกต้อง
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

            accountLoading.hidden = true;
            loginRequired.hidden = false;

            return;
        }


        // ========================================
        // ข้อมูล User
        // ========================================

        const user =
            result.user;


        displayNameElement.textContent =
            user.displayName || "-";

        usernameElement.textContent =
            user.username || "-";

        emailElement.textContent =
            user.email || "ยังไม่มีข้อมูล";


        accountLoading.hidden = true;
        accountContent.hidden = false;


        // ========================================
        // เก็บข้อมูลล่าสุด
        // ========================================

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
// ระบบเปลี่ยนชื่อ
// ========================================

if (
    editDisplayNameButton &&
    displayNameEditor &&
    newDisplayNameInput &&
    saveDisplayNameButton &&
    cancelDisplayNameButton &&
    displayNameStatus
) {


    // ========================================
    // เปิดช่องเปลี่ยนชื่อ
    // ========================================

    editDisplayNameButton.addEventListener(
        "click",
        function () {

            displayNameEditor.hidden = false;

            editDisplayNameButton.hidden = true;

            displayNameStatus.textContent = "";

            newDisplayNameInput.value =
                displayNameElement.textContent === "-"
                    ? ""
                    : displayNameElement.textContent;

            newDisplayNameInput.focus();
        }
    );


    // ========================================
    // ยกเลิกเปลี่ยนชื่อ
    // ========================================

    cancelDisplayNameButton.addEventListener(
        "click",
        function () {

            displayNameEditor.hidden = true;

            editDisplayNameButton.hidden = false;

            displayNameStatus.textContent = "";
        }
    );


    // ========================================
    // บันทึกชื่อใหม่
    // ========================================

    saveDisplayNameButton.addEventListener(
        "click",
        async function () {

            const token =
                localStorage.getItem(
                    "sentangToken"
                );


            // ========================================
            // ตรวจสอบ Login
            // ========================================

            if (!token) {

                alert(
                    "กรุณาเข้าสู่ระบบก่อน"
                );

                window.location.href =
                    "login.html";

                return;
            }


            const newDisplayName =
                newDisplayNameInput.value.trim();


            // ========================================
            // ตรวจสอบชื่อ
            // ========================================

            if (!newDisplayName) {

                displayNameStatus.textContent =
                    "กรุณากรอกชื่อใหม่";

                newDisplayNameInput.focus();

                return;
            }


            if (
                newDisplayName.length > 30
            ) {

                displayNameStatus.textContent =
                    "ชื่อใหม่ต้องไม่เกิน 30 ตัวอักษร";

                return;
            }


            // ========================================
            // กำลังบันทึก
            // ========================================

            saveDisplayNameButton.disabled =
                true;

            displayNameStatus.textContent =
                "กำลังบันทึก...";


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/auth/display-name`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body:
                                JSON.stringify({
                                    displayName:
                                        newDisplayName
                                })
                        }
                    );


                const result =
                    await response.json();


                // ========================================
                // เปลี่ยนชื่อไม่สำเร็จ
                // ========================================

                if (!response.ok) {

                    displayNameStatus.textContent =
                        result.message ||
                        "ไม่สามารถเปลี่ยนชื่อได้";

                    saveDisplayNameButton.disabled =
                        false;

                    return;
                }


                // ========================================
                // เปลี่ยนชื่อสำเร็จ
                // ========================================

                const user =
                    result.user;


                displayNameElement.textContent =
                    user.displayName;


                localStorage.setItem(
                    "sentangUser",
                    JSON.stringify(user)
                );


                displayNameEditor.hidden =
                    true;

                editDisplayNameButton.hidden =
                    false;

                displayNameStatus.textContent =
                    "เปลี่ยนชื่อสำเร็จ";


                alert(
                    "เปลี่ยนชื่อสำเร็จ! สามารถเปลี่ยนชื่อได้อีกครั้งหลังจาก 14 วัน"
                );


            } catch (error) {

                console.error(error);

                displayNameStatus.textContent =
                    "ไม่สามารถเชื่อมต่อกับ Server ได้";
            }


            saveDisplayNameButton.disabled =
                false;
        }
    );
}


// ========================================
// Logout
// ========================================

if (logoutButton) {

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
                        `${API_URL}/api/auth/logout`,
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


            localStorage.removeItem(
                "sentangToken"
            );

            localStorage.removeItem(
                "sentangUser"
            );


            window.location.href =
                "login.html";
        }
    );
}


// ========================================
// เริ่มระบบ
// ========================================

loadAccount();