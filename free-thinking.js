/* =====================================
   SENTANG CHECKPOINT
   Free Thinking Analysis
===================================== */


/* =====================================
   API
===================================== */

const API_BASE_URL =
    "https://sentang-checkpoint-api.onrender.com";


/* =====================================
   วิเคราะห์ Free Thinking
===================================== */

async function analyzeThinking() {

    const input =
        document.getElementById(
            "thinkingInput"
        ).value.trim();


    /* =====================================
       ตรวจข้อความ
    ===================================== */

    if (input.length < 10) {

        alert(
            "ลองเล่าเพิ่มเติมอีกนิดนะ 😊"
        );

        return;

    }


    /* =====================================
       เก็บข้อความที่ผู้ใช้เขียน
    ===================================== */

    localStorage.setItem(
        "freeThinking",
        input
    );

    
    /* =====================================
       คะแนนจากแบบทดสอบ
       
       ถ้าไม่มี = วิเคราะห์ Free Thinking
       โดยใช้ข้อความอย่างเดียว
    ===================================== */

    let quizScores = null;


    const savedScores =
        localStorage.getItem(
            "sentangScores"
        );


    if (savedScores) {

        try {

            quizScores =
                JSON.parse(
                    savedScores
                );

        }

        catch (error) {

            console.error(
                "อ่านคะแนนแบบทดสอบไม่ได้",
                error
            );

            quizScores = null;

        }

    }


    /* =====================================
       แสดงสถานะกำลังวิเคราะห์
    ===================================== */

    const button =
        document.querySelector(
            "button"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "กำลังวิเคราะห์...";

    }


    try {

        /* =====================================
           ส่งข้อความไปให้ Gemini ผ่าน Backend
        ===================================== */

        const response =
            await fetch(
                `${API_BASE_URL}/api/free-thinking`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        text: input,

                        quizScores:
                            quizScores

                    })

                }
            );


        /* =====================================
           อ่านผลลัพธ์
        ===================================== */

        const data =
            await response.json();


        /* =====================================
           ตรวจสอบว่า Backend ทำงานหรือไม่
        ===================================== */

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "ไม่สามารถวิเคราะห์ข้อความได้"
            );

        }


        /* =====================================
           ตรวจสอบผลจาก Gemini
        ===================================== */

        if (
            !data.result
        ) {

            throw new Error(
                "ไม่พบผลการวิเคราะห์จาก AI"
            );

        }


        /* =====================================
           เก็บผลการวิเคราะห์จาก Gemini
        ===================================== */

        localStorage.setItem(
            "freeThinkingAIResult",
            JSON.stringify(
                data.result
            )
        );


        /* =====================================
           เก็บคะแนนแบบทดสอบ
        ===================================== */

        localStorage.setItem(
            "freeThinkingScores",
            JSON.stringify(
                data.quizScores || {}
            )
        );


        /* =====================================
           บันทึกโหมด
        ===================================== */

        localStorage.setItem(
            "freeThinkingMode",
            quizScores
                ? "combined"
                : "direct"
        );


        /* =====================================
           เก็บผลลัพธ์หลัก
           
           ใช้สำหรับระบบเดิมที่อาจยังอ่าน
           freeThinkingResult อยู่
        ===================================== */

        const areas =
            Array.isArray(
                data.result.areas
            )
                ? data.result.areas
                : [];


        if (areas.length > 0) {

            localStorage.setItem(
                "freeThinkingResult",
                areas[0]
            );

        }

        else {

            localStorage.setItem(
                "freeThinkingResult",
                "unknown"
            );

        }


        /* =====================================
           ไปหน้าผลลัพธ์
        ===================================== */

        window.location.href =
            "free-thinking-result.html";


    }

    catch (error) {

        console.error(
            "Free Thinking Error:",
            error
        );


        alert(
            "ไม่สามารถวิเคราะห์ได้ในขณะนี้\n\n" +
            "กรุณาลองใหม่อีกครั้ง"
        );


        /* =====================================
           คืนค่าปุ่ม
        ===================================== */

        if (button) {

            button.disabled = false;

            button.textContent =
                "วิเคราะห์";

        }

    }

}