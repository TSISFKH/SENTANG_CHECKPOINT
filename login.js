// ========================================
// SENTANG CHECKPOINT
// Login JavaScript
// ========================================

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        loginMessage.textContent =
            "กำลังเข้าสู่ระบบ...";


        const data = {

            username:
                usernameInput.value.trim(),

            password:
                passwordInput.value

        };


        try {

            const response =
                await fetch(
                    "/api/auth/login",
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


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "เข้าสู่ระบบไม่สำเร็จ"
                );

            }


            // ========================================
            // เก็บข้อมูล Login
            // ========================================

            localStorage.setItem(
                "sentangToken",
                result.token
            );


            localStorage.setItem(
                "sentangUser",
                JSON.stringify(result.user)
            );


            loginMessage.textContent =
                "เข้าสู่ระบบสำเร็จ";


            setTimeout(() => {

                window.location.href =
                    "forum.html";

            }, 500);


        } catch (error) {

            console.error(error);

            loginMessage.textContent =
                error.message ||
                "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";

        }

    }
);