/* =====================================
   SENTANG CHECKPOINT
   Free Thinking Result
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       อ่านข้อมูลที่บันทึกไว้
    ===================================== */

    const result =
        localStorage.getItem("freeThinkingResult");

    const savedScores =
        localStorage.getItem("freeThinkingScores");

    const thinking =
        localStorage.getItem("freeThinking");


    const scores =
        savedScores
            ? JSON.parse(savedScores)
            : {};


    /* =====================================
       ชื่อผลลัพธ์
    ===================================== */

    const resultNames = {

        science:
            "วิทยาศาสตร์และการวิจัย",

        technology:
            "เทคโนโลยีและคอมพิวเตอร์",

        business:
            "ธุรกิจและการบริหาร",

        social:
            "สังคมและการช่วยเหลือผู้คน",

        creative:
            "ศิลปะและความคิดสร้างสรรค์",

        unknown:
            "ยังไม่สามารถระบุได้",

        unclear:
            "มีความสนใจหลายด้าน"

    };


    /* =====================================
       แสดงผลลัพธ์
    ===================================== */

    const resultElement =
        document.getElementById(
            "freeThinkingResult"
        );

    if (resultElement) {

        resultElement.textContent =
            resultNames[result] ||
            "ยังไม่พบผลการวิเคราะห์";

    }


    /* =====================================
       แสดงข้อความที่ผู้ใช้เขียน
    ===================================== */

    const thinkingElement =
        document.getElementById(
            "thinkingResult"
        );

    if (thinkingElement && thinking) {

        thinkingElement.textContent =
            thinking;

    }


    /* =====================================
       แสดงคะแนน
    ===================================== */

    const scoreElements = {

        science:
            document.getElementById(
                "scienceScore"
            ),

        technology:
            document.getElementById(
                "technologyScore"
            ),

        business:
            document.getElementById(
                "businessScore"
            ),

        social:
            document.getElementById(
                "socialScore"
            ),

        creative:
            document.getElementById(
                "creativeScore"
            )

    };


    Object.keys(scoreElements).forEach(
        function (type) {

            const element =
                scoreElements[type];

            if (element) {

                element.textContent =
                    scores[type] || 0;

            }

        }
    );

});