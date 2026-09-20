// ========================================
// SENTANG CHECKPOINT
// รายละเอียดอาชีพ
// ========================================


const selectedCareer =
    localStorage.getItem(
        "selectedCareer"
    );


// ========================================
// โหลดข้อมูลจาก API
// ========================================

async function loadCareer() {

    const careerHero =
        document.getElementById(
            "careerHero"
        );


    const careerInformation =
        document.getElementById(
            "careerInformation"
        );


    const studyPath =
        document.getElementById(
            "studyPath"
        );


    if (!selectedCareer) {

        careerHero.innerHTML = `

            <h1>
                ไม่พบข้อมูลอาชีพ
            </h1>

            <p>
                กรุณากลับไปเลือกอาชีพใหม่
            </p>

        `;

        return;

    }


    careerHero.innerHTML = `

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
                "https://sentang-checkpoint-api.onrender.com/api/careers/" +
                encodeURIComponent(
                    selectedCareer
                )
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                "ไม่พบข้อมูลอาชีพ"
            );

        }


        const data =
            result.data;


        // ========================================
        // HERO
        // ========================================

        careerHero.innerHTML = `

            <div class="career-detail-icon">

                ${data.icon || "💼"}

            </div>


            <p class="subtitle">
                CAREER
            </p>


            <h1>
                ${selectedCareer}
            </h1>


            <p>
                ${data.description || ""}
            </p>

        `;


        // ========================================
        // INFORMATION
        // ========================================

        careerInformation.innerHTML = `

            <div class="career-info-section">

                <h2>
                    💼 ลักษณะงาน
                </h2>

                <p>
                    ${data.work || "ยังไม่มีข้อมูล"}
                </p>

            </div>


            <div class="career-info-section">

                <h2>
                    🧠 ทักษะที่ควรมี
                </h2>

                <div class="career-tag-list">

                    ${
                        data.skills &&
                        data.skills.length > 0

                        ? data.skills
                            .map(
                                skill =>
                                    `<span>${skill}</span>`
                            )
                            .join("")

                        : `<p>ยังไม่มีข้อมูล</p>`
                    }

                </div>

            </div>


            <div class="career-info-section">

                <h2>
                    💭 ทัศนคติที่เหมาะกับสายงาน
                </h2>

                <ul>

                    ${
                        data.attitude &&
                        data.attitude.length > 0

                        ? data.attitude
                            .map(
                                item =>
                                    `<li>${item}</li>`
                            )
                            .join("")

                        : `<li>ยังไม่มีข้อมูล</li>`
                    }

                </ul>

            </div>


            <div class="career-info-section">

                <h2>
                    🎓 คณะที่เกี่ยวข้อง
                </h2>

                <div class="career-faculty-list">

                    ${
                        data.faculties &&
                        data.faculties.length > 0

                        ? data.faculties
                            .map(
                                faculty => `

                                    <div
                                        class="career-faculty"
                                        data-faculty="${faculty}"
                                    >

                                        🎓 ${faculty}

                                    </div>

                                `
                            )
                            .join("")

                        : `<p>ยังไม่มีข้อมูลคณะ</p>`
                    }

                </div>

            </div>

        `;


        // ========================================
        // มหาวิทยาลัย + เส้นทาง
        // ========================================

        studyPath.innerHTML = `

            <h2>
                🏫 มหาวิทยาลัยที่เกี่ยวข้อง
            </h2>


            <p class="career-section-description">

                ตัวอย่างมหาวิทยาลัยที่มีเส้นทางการเรียน
                ที่เกี่ยวข้องกับอาชีพนี้

            </p>


            <div class="career-university-list">

                <p>
                    สามารถดูมหาวิทยาลัยที่เปิดสอน
                    คณะที่เกี่ยวข้องได้จากรายละเอียดของคณะ
                </p>

            </div>


            <div class="career-path-title">

                <h2>
                    🧭 แนวทางการเรียน
                </h2>

            </div>


            <div class="career-path">

                ${
                    data.path &&
                    data.path.length > 0

                    ? data.path
                        .map(
                            (step, index) => `

                                <div
                                    class="career-path-item"
                                >

                                    <div
                                        class="career-path-number"
                                    >

                                        ${index + 1}

                                    </div>

                                    <p>
                                        ${step}
                                    </p>

                                </div>

                            `
                        )
                        .join("")

                    : `<p>ยังไม่มีข้อมูลแนวทางการเรียน</p>`
                }

            </div>

        `;


        // ========================================
        // กดคณะ
        // ========================================

        document
            .querySelectorAll(
                ".career-faculty"
            )
            .forEach(
                item => {

                    item.addEventListener(
                        "click",
                        () => {

                            localStorage.setItem(
                                "selectedFaculty",
                                item.dataset.faculty
                            );


                            window.location.href =
                                "faculty-detail.html";

                        }
                    );

                }
            );


    } catch (error) {

        console.error(
            "API Error:",
            error
        );


        careerHero.innerHTML = `

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


        careerInformation.innerHTML = "";
        studyPath.innerHTML = "";

    }

}


loadCareer();