// ========================================
// SENTANG CHECKPOINT
// Register JavaScript
// ========================================

const registerForm =
    document.getElementById("registerForm");

const emailInput =
    document.getElementById("email");

const displayNameInput =
    document.getElementById("displayName");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const registerMessage =
    document.getElementById("registerMessage");


// ========================================
// สมัครสมาชิก
// ========================================

registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        registerMessage.textContent =
            "กำลังสมัครสมาชิก...";


        // ========================================
        // รับค่าจากฟอร์ม
        // ========================================

        const email =
            emailInput.value.trim();

        const displayName =
            displayNameInput.value.trim();

        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        // ========================================
        // ตรวจสอบข้อมูล
        // ========================================

        if (!email) {

            registerMessage.textContent =
                "กรุณากรอกอีเมล";

            return;
        }


        if (!displayName) {

            registerMessage.textContent =
                "กรุณากรอกชื่อที่แสดง";

            return;
        }


        if (!username) {

            registerMessage.textContent =
                "กรุณากรอกชื่อผู้ใช้";

            return;
        }


        if (password !== confirmPassword) {

            registerMessage.textContent =
                "รหัสผ่านทั้งสองช่องไม่ตรงกัน";

            return;
        }


        if (password.length < 6) {

            registerMessage.textContent =
                "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";

            return;
        }


        // ========================================
        // ข้อมูลที่จะส่งให้ Server
        // ========================================

        const data = {

            email:
                email,

            displayName:
                displayName,

            username:
                username,

            password:
                password

        };


        // ========================================
        // ส่งข้อมูลไป Server
        // ========================================

        try {

            const response =
                await fetch(
                    "/api/auth/register",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json();


            // ========================================
            // สมัครไม่สำเร็จ
            // ========================================

            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "สมัครสมาชิกไม่สำเร็จ"
                );

            }


            // ========================================
            // สมัครสำเร็จ
            // ========================================

            registerMessage.textContent =
                "สมัครสมาชิกสำเร็จ กำลังไปหน้า Login...";


            registerForm.reset();


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1000);


        } catch (error) {

            console.error(error);

            registerMessage.textContent =
                error.message ||
                "เกิดข้อผิดพลาดในการสมัครสมาชิก";

        }

    }
);