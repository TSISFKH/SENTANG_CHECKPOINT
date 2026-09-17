// ========================================
// SENTANG CHECKPOINT
// รายการอาชีพ
// ========================================


let careers = [];


// ========================================
// HTML
// ========================================

const careerList =
    document.getElementById(
        "careerList"
    );


const careerSearch =
    document.getElementById(
        "careerSearch"
    );


const careerCategory =
    document.getElementById(
        "careerCategory"
    );


// ========================================
// แสดงอาชีพ
// ========================================

function displayCareers() {

    const search =
        careerSearch.value
            .toLowerCase()
            .trim();


    const category =
        careerCategory.value;


    const filtered =
        careers.filter(
            career => {

                const matchSearch =
                    career.name
                        .toLowerCase()
                        .includes(search);


                const matchCategory =
                    category === "all" ||
                    career.category === category;


                return (
                    matchSearch &&
                    matchCategory
                );

            }
        );


    careerList.innerHTML = "";


    if (
        filtered.length === 0
    ) {

        careerList.innerHTML = `

            <div class="no-result">

                <div class="no-result-icon">
                    🔎
                </div>

                <h2>
                    ไม่พบอาชีพ
                </h2>

                <p>
                    ลองค้นหาด้วยคำอื่น
                </p>

            </div>

        `;

        return;

    }


    filtered.forEach(
        career => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "career-card";


            card.innerHTML = `

                <div class="career-icon">

                    ${career.icon}

                </div>


                <div class="career-info">

                    <h2>
                        ${career.name}
                    </h2>


                    <p>
                        ${career.description}
                    </p>


                    <div class="career-study">

                        🎓
                        ${career.study}

                    </div>

                </div>


                <button
                    class="career-detail-button"
                    type="button"
                >

                    ดูรายละเอียด →

                </button>

            `;


            card
                .querySelector(
                    ".career-detail-button"
                )
                .addEventListener(
                    "click",
                    () => {

                        openCareer(
                            career.name
                        );

                    }
                );


            careerList.appendChild(
                card
            );

        }
    );

}


// ========================================
// เปิดรายละเอียดอาชีพ
// ========================================

function openCareer(name) {

    localStorage.setItem(
        "selectedCareer",
        name
    );


    window.location.href =
        "career-detail.html";

}


// ========================================
// โหลดข้อมูลจาก API
// ========================================

async function loadCareers() {

    careerList.innerHTML = `

        <div class="no-result">

            <div class="no-result-icon">
                ⏳
            </div>

            <h2>
                กำลังโหลดข้อมูล...
            </h2>

        </div>

    `;


    try {

        const response =
            await fetch(
                "/api/careers"
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                "ไม่สามารถโหลดข้อมูลอาชีพ"
            );

        }


        careers =
            result.results || [];


        displayCareers();


    } catch (error) {

        console.error(
            "API Error:",
            error
        );


        careerList.innerHTML = `

            <div class="no-result">

                <div class="no-result-icon">
                    ⚠️
                </div>

                <h2>
                    ไม่สามารถโหลดข้อมูลได้
                </h2>

                <p>
                    กรุณาตรวจสอบว่า API Server กำลังทำงานอยู่
                </p>

            </div>

        `;

    }

}


// ========================================
// ค้นหา
// ========================================

careerSearch.addEventListener(
    "input",
    displayCareers
);


// ========================================
// กรองหมวด
// ========================================

careerCategory.addEventListener(
    "change",
    displayCareers
);


// ========================================
// เริ่มระบบ
// ========================================

loadCareers();