// ========================================
// SENTANG CHECKPOINT
// รายละเอียดคณะ
// ========================================


const selectedFaculty =
    localStorage.getItem(
        "selectedFaculty"
    );


const facultyDetail =
    document.getElementById(
        "facultyDetail"
    );


// ========================================
// เปิดรายละเอียดมหาวิทยาลัย
// ========================================

function openUniversity(
    universityName
) {

    localStorage.setItem(
        "selectedUniversity",
        universityName
    );

    localStorage.setItem(
        "selectedFaculty",
        selectedFaculty
    );

    window.location.href =
        "university-detail.html";
}


// ========================================
// แสดงข้อมูลคณะ
// ========================================

function displayFaculty(
    faculty,
    universities
) {

    facultyDetail.innerHTML = `

        <div class="detail-hero">

            <div class="detail-icon">

                ${faculty.icon || "🎓"}

            </div>


            <div>

                <p class="subtitle">
                    FACULTY
                </p>


                <h1>
                    ${selectedFaculty}
                </h1>


                <p class="detail-location">
                    🎓 รายละเอียดคณะ
                </p>

            </div>

        </div>


        <div class="detail-content">


            <section class="detail-section">

                <h2>
                    📝 เรียนเกี่ยวกับอะไร?
                </h2>


                <p>
                    ${faculty.description || "ยังไม่มีข้อมูลรายละเอียด"}
                </p>

            </section>


            <section class="detail-section">

                <h2>
                    📚 ตัวอย่างวิชาที่เรียน
                </h2>


                <div class="faculty-detail-list">

                    ${
                        faculty.subjects &&
                        faculty.subjects.length > 0

                        ? faculty.subjects
                            .map(
                                subject => `

                                    <div
                                        class="faculty-detail-item"
                                    >

                                        <span>
                                            📖
                                        </span>

                                        <span>
                                            ${subject}
                                        </span>

                                    </div>

                                `
                            )
                            .join("")

                        : `
                            <p>
                                ยังไม่มีข้อมูลวิชา
                            </p>
                          `
                    }

                </div>

            </section>


            <section class="detail-section">

                <h2>
                    🧠 เหมาะกับคนแบบไหน?
                </h2>


                <div class="faculty-detail-list">

                    ${
                        faculty.suitableFor &&
                        faculty.suitableFor.length > 0

                        ? faculty.suitableFor
                            .map(
                                item => `

                                    <div
                                        class="faculty-detail-item"
                                    >

                                        <span>
                                            ✓
                                        </span>

                                        <span>
                                            ${item}
                                        </span>

                                    </div>

                                `
                            )
                            .join("")

                        : `
                            <p>
                                ยังไม่มีข้อมูล
                            </p>
                          `
                    }

                </div>

            </section>


            <section class="detail-section">

                <h2>
                    💼 อาชีพที่ต่อยอดได้
                </h2>


                <div class="career-tag-list">

                    ${
                        faculty.careers &&
                        faculty.careers.length > 0

                        ? faculty.careers
                            .map(
                                career => `

                                    <span>
                                        ${career}
                                    </span>

                                `
                            )
                            .join("")

                        : `
                            <p>
                                ยังไม่มีข้อมูลอาชีพ
                            </p>
                          `
                    }

                </div>

            </section>


            <section class="detail-section">

                <h2>
                    🎓 มหาวิทยาลัยที่มีคณะนี้
                </h2>


                <p>
                    มหาวิทยาลัยที่เปิดสอน
                    ${selectedFaculty}
                </p>


                <div class="university-faculty-list">

                    ${
                        universities &&
                        universities.length > 0

                        ? universities
                            .map(
                                university => `

                                    <div
                                        class="university-faculty-item"
                                        data-university="${university.name}"
                                    >

                                        <div>

                                            <h3>
                                                🎓 ${university.name}
                                            </h3>

                                            <p>
                                                📍 ${university.province || "-"}
                                            </p>

                                        </div>


                                        <span>
                                            →
                                        </span>

                                    </div>

                                `
                            )
                            .join("")

                        : `
                            <p>
                                ยังไม่มีข้อมูลมหาวิทยาลัย
                            </p>
                          `
                    }

                </div>

            </section>


        </div>

    `;


    // ========================================
    // กดมหาวิทยาลัย
    // ========================================

    document
        .querySelectorAll(
            ".university-faculty-item"
        )
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    openUniversity(
                        item.dataset.university
                    );

                }
            );

        });

}


// ========================================
// โหลดข้อมูลจาก API
// ========================================

async function loadFaculty() {

    if (!selectedFaculty) {

        facultyDetail.innerHTML = `

            <div class="no-result">

                <div class="no-result-icon">
                    🎓
                </div>

                <h2>
                    ไม่พบข้อมูลคณะ
                </h2>

                <p>
                    กรุณากลับไปเลือกคณะอีกครั้ง
                </p>

                <a
                    href="universities.html"
                    class="detail-button"
                >
                    กลับไปหน้ามหาวิทยาลัย
                </a>

            </div>

        `;

        return;
    }


    facultyDetail.innerHTML = `

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
                "/api/faculties/" +
                encodeURIComponent(
                    selectedFaculty
                )
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                "ไม่พบข้อมูลคณะ"
            );

        }


        displayFaculty(
            result.data,
            result.universities
        );


    } catch (error) {

        console.error(
            "API Error:",
            error
        );


        facultyDetail.innerHTML = `

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


loadFaculty();