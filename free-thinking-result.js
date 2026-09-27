/* =====================================
   SENTANG CHECKPOINT
   Free Thinking Result
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================
           อ่านข้อมูลที่บันทึกไว้
        ===================================== */

        const result =
            localStorage.getItem(
                "freeThinkingResult"
            );

        const savedScores =
            localStorage.getItem(
                "freeThinkingScores"
            );

        const thinking =
            localStorage.getItem(
                "freeThinking"
            );

        const savedAIResult =
            localStorage.getItem(
                "freeThinkingAIResult"
            );


        /* =====================================
           แปลงข้อมูล
        ===================================== */

        let scores = {};

        let aiResult = null;


        if (savedScores) {

            try {

                scores =
                    JSON.parse(
                        savedScores
                    );

            }

            catch (error) {

                console.error(
                    "อ่านคะแนนไม่ได้",
                    error
                );

                scores = {};

            }

        }


        if (savedAIResult) {

            try {

                aiResult =
                    JSON.parse(
                        savedAIResult
                    );

            }

            catch (error) {

                console.error(
                    "อ่านผลวิเคราะห์ AI ไม่ได้",
                    error
                );

                aiResult = null;

            }

        }


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
           แสดงผลลัพธ์หลัก
        ===================================== */

        const resultElement =
            document.getElementById(
                "freeThinkingResult"
            );


        if (resultElement) {

            /*
             * ถ้ามีผลจาก Gemini
             * ใช้ผลจาก AI
             */

            if (
                aiResult &&
                Array.isArray(
                    aiResult.areas
                ) &&
                aiResult.areas.length > 0
            ) {

                const areaNames =
                    aiResult.areas.map(
                        function (area) {

                            return (
                                resultNames[area] ||
                                area
                            );

                        }
                    );


                resultElement.textContent =
                    areaNames.join(" • ");

            }

            /*
             * ถ้าไม่มีผลจาก Gemini
             * ใช้ระบบเดิม
             */

            else {

                resultElement.textContent =
                    resultNames[result] ||
                    "ยังไม่พบผลการวิเคราะห์";

            }

        }


        /* =====================================
           แสดงข้อความสรุปจาก AI
        ===================================== */

        const summaryElement =
            document.getElementById(
                "freeThinkingSummary"
            );


        if (
            summaryElement &&
            aiResult &&
            aiResult.summary
        ) {

            summaryElement.textContent =
                aiResult.summary;

        }


        /* =====================================
           แสดงความสนใจ
        ===================================== */

        const interestsElement =
            document.getElementById(
                "freeThinkingInterests"
            );


        if (
            interestsElement &&
            aiResult &&
            Array.isArray(
                aiResult.interests
            )
        ) {

            interestsElement.innerHTML = "";


            aiResult.interests.forEach(
                function (interest) {

                    const item =
                        document.createElement(
                            "li"
                        );

                    item.textContent =
                        interest;

                    interestsElement.appendChild(
                        item
                    );

                }
            );

        }


        /* =====================================
           แสดงจุดแข็ง
        ===================================== */

        const strengthsElement =
            document.getElementById(
                "freeThinkingStrengths"
            );


        if (
            strengthsElement &&
            aiResult &&
            Array.isArray(
                aiResult.strengths
            )
        ) {

            strengthsElement.innerHTML = "";


            aiResult.strengths.forEach(
                function (strength) {

                    const item =
                        document.createElement(
                            "li"
                        );

                    item.textContent =
                        strength;

                    strengthsElement.appendChild(
                        item
                    );

                }
            );

        }


        /* =====================================
           แสดงเหตุผลจาก AI
        ===================================== */

        const reasonElement =
            document.getElementById(
                "freeThinkingReason"
            );


        if (
            reasonElement &&
            aiResult &&
            aiResult.reason
        ) {

            reasonElement.textContent =
                aiResult.reason;

        }


        /* =====================================
           แสดงข้อความที่ผู้ใช้เขียน
        ===================================== */

        const thinkingElement =
            document.getElementById(
                "thinkingResult"
            );


        if (
            thinkingElement &&
            thinking
        ) {

            thinkingElement.textContent =
                thinking;

        }


        /* =====================================
           แสดงคะแนน
           
           คะแนนนี้เป็นคะแนนจากแบบทดสอบ
           ไม่ใช่คะแนนที่ Gemini ใช้ตัดสิน
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


        Object.keys(
            scoreElements
        ).forEach(
            function (type) {

                const element =
                    scoreElements[type];


                if (element) {

                    element.textContent =
                        scores[type] || 0;

                }

            }
        );


        /* =====================================
           แสดงสถานะกรณีไม่มี AI Result
        ===================================== */

        if (!aiResult) {

            console.warn(
                "ไม่พบผลการวิเคราะห์จาก Gemini"
            );

        }

    }
);