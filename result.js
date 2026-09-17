/* =====================================
   รับผลจากแบบทดสอบ
===================================== */

const resultType =
    localStorage.getItem(
        "sentangResult"
    );


const savedScores =
    localStorage.getItem(
        "sentangScores"
    );


/* =====================================
   ตรวจสอบข้อมูล
===================================== */

if (
    !resultType ||
    !savedScores
) {

    document.getElementById(
        "result-card"
    ).innerHTML = `

        <div class="result-empty">

            <div class="result-icon">
                🧭
            </div>

            <h2>
                ยังไม่มีผลการทดสอบ
            </h2>

            <p>
                กรุณาทำแบบทดสอบก่อน
                เพื่อให้ระบบวิเคราะห์เส้นทางของคุณ
            </p>

            <a
                href="test-interest.html"
                class="main-button"
            >
                เริ่มทำแบบทดสอบ
            </a>

        </div>

    `;

}


/* =====================================
   ข้อมูลแต่ละสาย
===================================== */

else {


    const scores =
        JSON.parse(
            savedScores
        );


    const typeData = {

        science: {

            icon: "🔬",

            name:
                "วิทยาศาสตร์และการวิจัย",

            description:
                "คุณมีแนวโน้มสนใจการค้นคว้า การทดลอง การวิเคราะห์ และการค้นหาคำตอบจากหลักฐาน",

            careers: [
                "นักวิจัย",
                "นักวิทยาศาสตร์",
                "นักเทคนิคการแพทย์",
                "แพทย์",
                "เภสัชกร"
            ],

            faculties: [
                "วิทยาศาสตร์",
                "แพทยศาสตร์",
                "เภสัชศาสตร์",
                "เทคนิคการแพทย์"
            ]

        },


        technology: {

            icon: "💻",

            name:
                "เทคโนโลยีและคอมพิวเตอร์",

            description:
                "คุณมีแนวโน้มสนใจการสร้างระบบ การแก้ปัญหา และการใช้เทคโนโลยีเพื่อสร้างสิ่งใหม่",

            careers: [
                "โปรแกรมเมอร์",
                "นักพัฒนาซอฟต์แวร์",
                "นักวิเคราะห์ข้อมูล",
                "นักพัฒนาเกม",
                "วิศวกรซอฟต์แวร์"
            ],

            faculties: [
                "วิทยาการคอมพิวเตอร์",
                "วิศวกรรมคอมพิวเตอร์",
                "เทคโนโลยีสารสนเทศ",
                "วิทยาการข้อมูล"
            ]

        },


        business: {

            icon: "💼",

            name:
                "ธุรกิจและการบริหาร",

            description:
                "คุณมีแนวโน้มสนใจการวางแผน การวิเคราะห์ การจัดการ และการสร้างสิ่งต่าง ๆ ให้เกิดขึ้นจริง",

            careers: [
                "นักธุรกิจ",
                "นักการตลาด",
                "นักวิเคราะห์ธุรกิจ",
                "ผู้จัดการ",
                "ผู้ประกอบการ"
            ],

            faculties: [
                "บริหารธุรกิจ",
                "เศรษฐศาสตร์",
                "การตลาด",
                "บัญชี"
            ]

        },


        social: {

            icon: "👥",

            name:
                "สังคมและมนุษย์",

            description:
                "คุณมีแนวโน้มสนใจผู้คน สังคม การสื่อสาร และการสร้างความเปลี่ยนแปลงให้กับผู้อื่น",

            careers: [
                "ครู",
                "นักจิตวิทยา",
                "นักสังคมสงเคราะห์",
                "นักกฎหมาย",
                "นักสื่อสาร"
            ],

            faculties: [
                "มนุษยศาสตร์",
                "สังคมศาสตร์",
                "ศึกษาศาสตร์",
                "นิติศาสตร์",
                "จิตวิทยา"
            ]

        },


        creative: {

            icon: "🎨",

            name:
                "ศิลปะและความคิดสร้างสรรค์",

            description:
                "คุณมีแนวโน้มสนใจการสร้างสรรค์ การออกแบบ และการถ่ายทอดความคิดในรูปแบบของตัวเอง",

            careers: [
                "นักออกแบบ",
                "กราฟิกดีไซเนอร์",
                "นักออกแบบ UX/UI",
                "นักวาดภาพ",
                "ครีเอทีฟ"
            ],

            faculties: [
                "ศิลปกรรมศาสตร์",
                "นิเทศศาสตร์",
                "การออกแบบ",
                "สถาปัตยกรรมศาสตร์"
            ]

        }

    };


    const data =
        typeData[resultType];


    /* =====================================
       คะแนนสูงสุด
    ===================================== */

    const highestScore =
        Math.max(
            ...Object.values(scores)
        );


    const percentage =
        Math.round(
            (
                highestScore /
                8
            ) * 100
        );


    /* =====================================
       สร้างคะแนนทุกด้าน
    ===================================== */

    const scoreList =

        Object.entries(scores)

            .sort(
                (a, b) =>
                    b[1] - a[1]
            )

            .map(
                ([type, score]) => {

                    const item =
                        typeData[type];


                    const percent =
                        Math.round(
                            (
                                score /
                                8
                            ) * 100
                        );


                    return `

                        <div class="score-item">

                            <div class="score-title">

                                <span>

                                    ${item.icon}
                                    ${item.name}

                                </span>

                                <strong>

                                    ${percent}%

                                </strong>

                            </div>


                            <div class="score-bar">

                                <div
                                    style="
                                        width:
                                        ${percent}%;
                                    "
                                ></div>

                            </div>

                        </div>

                    `;

                }
            )

            .join("");


    /* =====================================
       แสดงผล
    ===================================== */

    document.getElementById(
        "result-card"
    ).innerHTML = `

        <div class="main-result">

            <div class="result-big-icon">

                ${data.icon}

            </div>


            <p class="result-label">

                แนวทางที่โดดเด่นของคุณ

            </p>


            <h2>

                ${data.name}

            </h2>


            <div class="result-percentage">

                ${percentage}%

            </div>


            <p>

                ${data.description}

            </p>

        </div>



        <hr>



        <div class="score-section">

            <h3>
                📊 คะแนนของคุณ
            </h3>


            ${scoreList}

        </div>



        <hr>



        <div class="recommend-section">

    <h3>
        💼 อาชีพที่น่าสนใจ
    </h3>

    <p class="recommend-description">
        ลองสำรวจอาชีพเหล่านี้เพิ่มเติม
        เพื่อดูว่าเส้นทางไหนตรงกับคุณมากที่สุด
    </p>

    <div class="career-recommend-list">

        ${data.careers
            .map(
                career => `

                    <button
                        class="career-recommend-card"
                        onclick="openCareer('${career}')"
                    >

                        <div class="career-recommend-icon">
                            💼
                        </div>

                        <div class="career-recommend-name">

                            <strong>
                                ${career}
                            </strong>

                            <span>
                                ดูรายละเอียดอาชีพ →
                            </span>

                        </div>

                    </button>

                `
            )
            .join("")
        }

    </div>

</div>



        <div class="recommend-section">

            <h3>
                🎓 คณะที่เกี่ยวข้อง
            </h3>


            <div class="recommend-tags">

                ${data.faculties
                    .map(
                        faculty =>
                            `<span>${faculty}</span>`
                    )
                    .join("")
                }

            </div>

        </div>

    `;

}
/* =====================================
   เปิดรายละเอียดอาชีพ
===================================== */

function openCareer(career) {

    // เก็บอาชีพที่ผู้ใช้เลือก
    localStorage.setItem(
        "selectedCareer",
        career
    );


    // ไปหน้ารายละเอียดอาชีพ
    window.location.href =
        "career-detail.html";

}