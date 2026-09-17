/* =====================================
   SENTANG CHECKPOINT
   Free Thinking Analysis
===================================== */


/* =====================================
   วิเคราะห์ Free Thinking
===================================== */

function analyzeThinking() {

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
       เก็บข้อความ
    ===================================== */

    localStorage.setItem(
        "freeThinking",
        input
    );


    const text =
        input.toLowerCase();


    /* =====================================
       คะแนนจากแบบทดสอบ
       
       ถ้าไม่มี = เริ่ม Free Thinking โดยตรง
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
       คำสำคัญ
    ===================================== */

    const keywords = {

        science: [

            "ทดลอง",
            "วิจัย",
            "วิทยาศาสตร์",
            "ชีววิทยา",
            "เคมี",
            "ฟิสิกส์",
            "ห้องทดลอง",
            "นักวิจัย",
            "ค้นคว้า",
            "ค้นพบ",
            "การแพทย์",
            "แพทย์",
            "ยา"

        ],


        technology: [

            "คอม",
            "คอมพิวเตอร์",
            "โปรแกรม",
            "เขียนโค้ด",
            "โค้ด",
            "เทคโนโลยี",
            "ai",
            "ปัญญาประดิษฐ์",
            "ซอฟต์แวร์",
            "เกม",
            "แอป",
            "เว็บไซต์",
            "ระบบ"

        ],


        business: [

            "ธุรกิจ",
            "บริษัท",
            "การตลาด",
            "ขาย",
            "ผู้ประกอบการ",
            "บริหาร",
            "วางแผน",
            "การเงิน",
            "ลงทุน",
            "ร้าน",
            "แบรนด์"

        ],


        social: [

            "คน",
            "ผู้คน",
            "สังคม",
            "ช่วยเหลือ",
            "ครู",
            "เด็ก",
            "กฎหมาย",
            "ชุมชน",
            "สื่อสาร",
            "ให้คำปรึกษา",
            "ผู้ป่วย"

        ],


        creative: [

            "วาด",
            "ออกแบบ",
            "ศิลปะ",
            "สร้างสรรค์",
            "ดีไซน์",
            "กราฟิก",
            "ภาพ",
            "เขียน",
            "ถ่ายรูป",
            "ดนตรี",
            "แฟชั่น",
            "คอนเทนต์"

        ]

    };


    /* =====================================
       วิเคราะห์คำสำคัญ
    ===================================== */

    const keywordScores = {

        science: 0,
        technology: 0,
        business: 0,
        social: 0,
        creative: 0

    };


    for (
        const type in keywords
    ) {

        keywords[type].forEach(
            function(keyword) {

                if (
                    text.includes(keyword)
                ) {

                    keywordScores[type]++;

                }

            }
        );

    }


    /* =====================================
       สร้างคะแนนเริ่มต้น
    ===================================== */

    const finalScores = {

        science: 0,
        technology: 0,
        business: 0,
        social: 0,
        creative: 0

    };


    /* =====================================
       ถ้ามีคะแนนจากแบบทดสอบ
       ให้นำมารวม
    ===================================== */

    if (quizScores) {

        finalScores.science +=
            quizScores.science || 0;

        finalScores.technology +=
            quizScores.technology || 0;

        finalScores.business +=
            quizScores.business || 0;

        finalScores.social +=
            quizScores.social || 0;

        finalScores.creative +=
            quizScores.creative || 0;

    }


    /* =====================================
       เพิ่มคะแนนจาก Free Thinking
    ===================================== */

    finalScores.science +=
        keywordScores.science;

    finalScores.technology +=
        keywordScores.technology;

    finalScores.business +=
        keywordScores.business;

    finalScores.social +=
        keywordScores.social;

    finalScores.creative +=
        keywordScores.creative;


    /* =====================================
       หาคะแนนสูงสุด
    ===================================== */

    const highestScore =
        Math.max(
            ...Object.values(
                finalScores
            )
        );


    const highestTypes =
        Object.keys(
            finalScores
        ).filter(
            type =>
                finalScores[type]
                === highestScore
        );


    /* =====================================
       ไม่มีข้อมูลเพียงพอ
    ===================================== */

    if (
        highestScore === 0
    ) {

        localStorage.setItem(
            "freeThinkingResult",
            "unknown"
        );

    }


    /* =====================================
       คะแนนเสมอ
    ===================================== */

    else if (
        highestTypes.length > 1
    ) {

        localStorage.setItem(
            "freeThinkingResult",
            "unclear"
        );

    }


    /* =====================================
       มีสายที่ชัดเจน
    ===================================== */

    else {

        localStorage.setItem(
            "freeThinkingResult",
            highestTypes[0]
        );

    }


    /* =====================================
       เก็บคะแนนรวม
    ===================================== */

    localStorage.setItem(
        "freeThinkingScores",
        JSON.stringify(
            finalScores
        )
    );


    /* =====================================
       บันทึกว่าใช้คะแนนแบบทดสอบหรือไม่
    ===================================== */

    localStorage.setItem(
        "freeThinkingMode",
        quizScores
            ? "combined"
            : "direct"
    );


    /* =====================================
       ไปหน้าผลลัพธ์
    ===================================== */

    window.location.href =
        "free-thinking-result.html";

}