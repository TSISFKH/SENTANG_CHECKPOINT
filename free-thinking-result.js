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
       เก็บข้อความของผู้ใช้
    ===================================== */

    localStorage.setItem(
        "freeThinking",
        input
    );


    const text =
        input.toLowerCase();


    /* =====================================
       คะแนนจากแบบทดสอบเดิม
       
       ถ้าไม่มี แปลว่าเข้ามา
       Free Thinking โดยตรง
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

        } catch (error) {

            console.error(
                "ไม่สามารถอ่านคะแนนแบบทดสอบได้",
                error
            );

            quizScores = null;

        }

    }


    /* =====================================
       คำสำคัญแต่ละด้าน
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
       สร้างคะแนนรวม
    ===================================== */

    const finalScores = {

        science: 0,
        technology: 0,
        business: 0,
        social: 0,
        creative: 0

    };


    /* =====================================
       เพิ่มคะแนนจากแบบทดสอบ
       
       ถ้าไม่มีคะแนนส่วนนี้
       จะเริ่มจาก 0
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
       เพิ่มคะแนนจากข้อความ
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
            function(type) {

                return (
                    finalScores[type]
                    === highestScore
                );

            }
        );


    /* =====================================
       สรุปผล
    ===================================== */

    let result;


    if (
        highestScore === 0
    ) {

        result = "unknown";

    }

    else if (
        highestTypes.length > 1
    ) {

        result = "unclear";

    }

    else {

        result =
            highestTypes[0];

    }


    /* =====================================
       บันทึกผล
    ===================================== */

    localStorage.setItem(
        "freeThinkingResult",
        result
    );


    localStorage.setItem(
        "freeThinkingScores",
        JSON.stringify(
            finalScores
        )
    );


    /* =====================================
       บันทึกว่าเป็นการวิเคราะห์แบบไหน
    ===================================== */

    localStorage.setItem(
        "freeThinkingMode",
        quizScores
            ? "combined"
            : "direct"
    );


    /* =====================================
       ไปหน้าผลลัพธ์ทันที
    ===================================== */

    window.location.href =
        "free-thinking-result.html";

}