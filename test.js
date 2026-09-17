/* =====================================
   ข้อมูลแบบทดสอบ
===================================== */

const questions = [

    {
        question: "ถ้ามีเวลาว่าง คุณอยากทำอะไรที่สุด?",
        answers: [
            {
                text: "ทดลอง ทำการทดลอง หรือค้นคว้าสิ่งต่าง ๆ",
                type: "science"
            },
            {
                text: "ลองสร้างโปรแกรมหรือเล่นกับเทคโนโลยี",
                type: "technology"
            },
            {
                text: "วิเคราะห์ข้อมูลหรือวางแผนอะไรบางอย่าง",
                type: "business"
            },
            {
                text: "อ่านหนังสือ ดูสารคดี หรือพูดคุยเรื่องสังคม",
                type: "social"
            },
            {
                text: "วาดรูป ออกแบบ หรือสร้างผลงาน",
                type: "creative"
            }
        ]
    },


    {
        question: "งานแบบไหนที่คุณรู้สึกว่าน่าสนใจ?",
        answers: [
            {
                text: "ค้นคว้าว่าทำไมสิ่งต่าง ๆ ถึงเกิดขึ้น",
                type: "science"
            },
            {
                text: "สร้างสิ่งใหม่ด้วยคอมพิวเตอร์",
                type: "technology"
            },
            {
                text: "คิดกลยุทธ์และแก้ปัญหา",
                type: "business"
            },
            {
                text: "ช่วยเหลือหรือทำงานร่วมกับผู้คน",
                type: "social"
            },
            {
                text: "สร้างผลงานที่มีเอกลักษณ์",
                type: "creative"
            }
        ]
    },


    {
        question: "วิชาไหนที่คุณสนใจมากที่สุด?",
        answers: [
            {
                text: "วิทยาศาสตร์ / ชีววิทยา / เคมี",
                type: "science"
            },
            {
                text: "คอมพิวเตอร์ / เทคโนโลยี",
                type: "technology"
            },
            {
                text: "คณิตศาสตร์ / เศรษฐศาสตร์",
                type: "business"
            },
            {
                text: "ภาษา / สังคม / ประวัติศาสตร์",
                type: "social"
            },
            {
                text: "ศิลปะ / การออกแบบ",
                type: "creative"
            }
        ]
    },


    {
        question: "ถ้าเจอปัญหายาก ๆ คุณมักจะ...",
        answers: [
            {
                text: "ทดลองหาคำตอบด้วยตัวเอง",
                type: "science"
            },
            {
                text: "หาวิธีใช้เทคโนโลยีช่วย",
                type: "technology"
            },
            {
                text: "แยกปัญหาแล้ววิเคราะห์ทีละส่วน",
                type: "business"
            },
            {
                text: "ถามความคิดเห็นจากคนอื่น",
                type: "social"
            },
            {
                text: "คิดวิธีใหม่ที่แตกต่างจากเดิม",
                type: "creative"
            }
        ]
    },


    {
        question: "คุณอยากสร้างอะไรให้เกิดขึ้นในอนาคต?",
        answers: [
            {
                text: "ค้นพบสิ่งใหม่ที่ช่วยผู้คน",
                type: "science"
            },
            {
                text: "สร้างเทคโนโลยีหรือระบบใหม่",
                type: "technology"
            },
            {
                text: "สร้างธุรกิจหรือแก้ปัญหาขนาดใหญ่",
                type: "business"
            },
            {
                text: "สร้างการเปลี่ยนแปลงให้กับสังคม",
                type: "social"
            },
            {
                text: "สร้างผลงานที่ทำให้คนจดจำ",
                type: "creative"
            }
        ]
    },


    {
        question: "สถานที่ทำงานแบบไหนที่คุณสนใจ?",
        answers: [
            {
                text: "ห้องทดลอง / โรงพยาบาล",
                type: "science"
            },
            {
                text: "บริษัทเทคโนโลยี",
                type: "technology"
            },
            {
                text: "บริษัท / ธุรกิจ / สำนักงาน",
                type: "business"
            },
            {
                text: "โรงเรียน / ชุมชน / องค์กร",
                type: "social"
            },
            {
                text: "สตูดิโอ / สถานที่สร้างสรรค์",
                type: "creative"
            }
        ]
    },


    {
        question: "คุณอยากใช้ทักษะอะไรในการทำงานมากที่สุด?",
        answers: [
            {
                text: "การทดลองและการคิดอย่างเป็นระบบ",
                type: "science"
            },
            {
                text: "การเขียนโปรแกรมและการแก้ปัญหา",
                type: "technology"
            },
            {
                text: "การวิเคราะห์และการวางแผน",
                type: "business"
            },
            {
                text: "การสื่อสารและการเข้าใจผู้คน",
                type: "social"
            },
            {
                text: "การออกแบบและจินตนาการ",
                type: "creative"
            }
        ]
    },


    {
        question: "ถ้าเลือกได้หนึ่งอย่าง คุณอยากเป็นคนแบบไหน?",
        answers: [
            {
                text: "นักค้นคว้า",
                type: "science"
            },
            {
                text: "นักสร้างเทคโนโลยี",
                type: "technology"
            },
            {
                text: "นักวางแผน",
                type: "business"
            },
            {
                text: "คนที่ทำงานกับผู้คน",
                type: "social"
            },
            {
                text: "นักสร้างสรรค์",
                type: "creative"
            }
        ]
    }

];



/* =====================================
   ตัวแปรระบบ
===================================== */

let currentQuestion = 0;


let scores = {

    science: 0,

    technology: 0,

    business: 0,

    social: 0,

    creative: 0

};


let selectedType = null;



/* =====================================
   แสดงคำถาม
===================================== */

function showQuestion() {

    const data =
        questions[currentQuestion];


    document.getElementById("question")
        .textContent = data.question;


    document.getElementById("question-number")
        .textContent =
        `คำถามที่ ${currentQuestion + 1} / ${questions.length}`;


    const answers =
        document.getElementById("answers");


    answers.innerHTML = "";


    data.answers.forEach(function(answer) {

        const button =
            document.createElement("button");


        button.className =
            "answer-button";


        button.textContent =
            answer.text;


        button.onclick =
            function() {

                selectAnswer(
                    answer.type,
                    button
                );

            };


        answers.appendChild(button);

    });


    updateProgress();


    selectedType = null;

}



/* =====================================
   เลือกคำตอบ
===================================== */

function selectAnswer(type, button) {

    selectedType = type;


    const buttons =
        document.querySelectorAll(
            ".answer-button"
        );


    buttons.forEach(function(btn) {

        btn.classList.remove("selected");

    });


    button.classList.add("selected");

}



/* =====================================
   ปุ่มถัดไป
===================================== */

function nextQuestion() {

    if (selectedType === null) {

        alert(
            "กรุณาเลือกคำตอบก่อนนะ 😊"
        );

        return;

    }


    scores[selectedType]++;


    currentQuestion++;


    if (
        currentQuestion >=
        questions.length
    ) {

        showResult();

        return;

    }


    showQuestion();

}



/* =====================================
   Progress Bar
===================================== */

function updateProgress() {

    const percentage =
        (
            currentQuestion /
            questions.length
        ) * 100;


    document.getElementById(
        "progress"
    ).style.width =
        percentage + "%";

}



/* =====================================
   วิเคราะห์ผล
===================================== */

function showResult() {

    /*
       หาคะแนนสูงสุด
    */

    let highestScore = 0;

    let highestTypes = [];


    for (let type in scores) {

        if (scores[type] > highestScore) {

            highestScore =
                scores[type];

            highestTypes = [type];

        }

        else if (
            scores[type] === highestScore &&
            highestScore > 0
        ) {

            highestTypes.push(type);

        }

    }


    /*
       ถ้ามีสายที่คะแนนสูงสุด
       มากกว่า 1 สาย

       แปลว่าความสนใจยังไม่ชัดเจน
    */

    if (highestTypes.length > 1) {

        localStorage.setItem(
            "sentangResult",
            "unclear"
        );


        localStorage.setItem(
            "sentangScores",
            JSON.stringify(scores)
        );


        window.location.href =
            "free-thinking.html";


        return;

    }


    /*
       ถ้ามีสายที่ชัดเจน
    */

    const highestType =
        highestTypes[0];


    localStorage.setItem(
        "sentangResult",
        highestType
    );


    localStorage.setItem(
        "sentangScores",
        JSON.stringify(scores)
    );


    window.location.href =
        "result.html";

}



/* =====================================
   เริ่มต้นแบบทดสอบ
===================================== */

showQuestion();