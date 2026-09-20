const selectedUniversity =
    localStorage.getItem("selectedUniversity");

const universityDetail =
    document.getElementById("universityDetail");

let favoriteList =
    JSON.parse(
        localStorage.getItem("favoriteUniversities")
    ) || [];


// ========================================
// แปลงชื่อภาค
// ========================================

function getRegionName(region) {

    const regions = {
        central: "ภาคกลาง",
        north: "ภาคเหนือ",
        northeast: "ภาคตะวันออกเฉียงเหนือ",
        east: "ภาคตะวันออก",
        south: "ภาคใต้"
    };

    return regions[region] || region || "-";
}


// ========================================
// แปลงประเภทมหาวิทยาลัย
// ========================================

function getTypeName(type) {

    const types = {
        public: "มหาวิทยาลัยรัฐ",
        private: "มหาวิทยาลัยเอกชน"
    };

    return types[type] || type || "-";
}


// ========================================
// ไปหน้าคณะ
// ========================================

function openFaculty(facultyName) {

    localStorage.setItem(
        "selectedFaculty",
        facultyName
    );

    localStorage.setItem(
        "selectedUniversity",
        selectedUniversity
    );

    window.location.href =
        "faculty-detail.html";
}


// ========================================
// เพิ่ม / ลบ Favorite
// ========================================

function toggleFavoriteUniversity() {

    const index =
        favoriteList.indexOf(
            selectedUniversity
        );

    if (index !== -1) {

        favoriteList.splice(index, 1);

    } else {

        favoriteList.push(
            selectedUniversity
        );

    }

    localStorage.setItem(
        "favoriteUniversities",
        JSON.stringify(favoriteList)
    );

    displayUniversity(
        window.currentUniversity
    );
}


// ========================================
// แสดงข้อมูลมหาวิทยาลัย
// ========================================

function displayUniversity(university) {

    window.currentUniversity = university;

    const isFavorite =
        favoriteList.includes(
            selectedUniversity
        );


    universityDetail.innerHTML = `

        <!-- ========================================
             HERO
        ======================================== -->

        <div class="detail-hero">

            ${
                university.image
                ? `
                    <div class="detail-icon">

                        <img
                            src="${university.image}"
                            alt="${selectedUniversity}"
                        >

                    </div>
                  `
                : `
                    <div class="detail-icon">
                        <div class="no-result-icon">
                            🎓
                        </div>
                    </div>
                  `
            }


            <div>

                <p class="subtitle">
                    UNIVERSITY
                </p>

                <h1>
                    ${selectedUniversity}
                </h1>

                <p class="detail-location">
                    📍 ${university.province || "-"}
                    ·
                    ${getRegionName(university.region)}
                    ·
                    ${getTypeName(university.type)}
                </p>

            </div>

        </div>


        <!-- ========================================
             DESCRIPTION
        ======================================== -->

        <div class="detail-content">

            <section class="detail-section">

                <h2>
                    📖 เกี่ยวกับมหาวิทยาลัย
                </h2>

                <p>
                    ${university.description || "ยังไม่มีข้อมูลรายละเอียด"}
                </p>

            </section>


            <!-- ========================================
                 ข้อมูลพื้นฐาน
            ======================================== -->

            <section class="detail-section">

                <h2>
                    🏫 ข้อมูลมหาวิทยาลัย
                </h2>

                <div class="faculty-detail-list">

                    <div class="faculty-detail-item">

                        <span>📍</span>

                        <div>
                            <strong>จังหวัด</strong>
                            <br>
                            ${university.province || "-"}
                        </div>

                    </div>


                    <div class="faculty-detail-item">

                        <span>🗺️</span>

                        <div>
                            <strong>ภูมิภาค</strong>
                            <br>
                            ${getRegionName(university.region)}
                        </div>

                    </div>


                    <div class="faculty-detail-item">

                        <span>🏛️</span>

                        <div>
                            <strong>ประเภท</strong>
                            <br>
                            ${getTypeName(university.type)}
                        </div>

                    </div>

                </div>

            </section>


            <!-- ========================================
                 คณะที่เปิดสอน
            ======================================== -->

            <section class="detail-section">

                <h2>
                    🎓 คณะที่เปิดสอน
                </h2>


                <div class="faculty-detail-list">

                    ${
                        university.faculties &&
                        university.faculties.length > 0

                        ? university.faculties.map(
                            faculty => `

                                <button
                                    class="faculty-detail-item"
                                    data-faculty="${faculty}"
                                    type="button"
                                >

                                    <span>🎓</span>

                                    <span>
                                        ${faculty}
                                    </span>

                                </button>

                            `
                        ).join("")

                        : `
                            <p>
                                ยังไม่มีข้อมูลคณะ
                            </p>
                          `
                    }

                </div>

            </section>


            <!-- ========================================
                 FAVORITE
            ======================================== -->

            <section class="detail-section">

                <h2>
                    ⭐ มหาวิทยาลัยที่ฉันสนใจ
                </h2>

                <p>
                    เพิ่มมหาวิทยาลัยนี้ไว้ในรายการโปรด
                    เพื่อกลับมาดูภายหลังได้ง่ายขึ้น
                </p>

                <button
                    id="favoriteUniversityButton"
                    class="favorite-button"
                    type="button"
                >

                    ${
                        isFavorite
                        ? "★ ลบจากรายการโปรด"
                        : "☆ เพิ่มในรายการโปรด"
                    }

                </button>

            </section>

        </div>

    `;


    // ========================================
    // ปุ่ม Favorite
    // ========================================

    const favoriteButton =
        document.getElementById(
            "favoriteUniversityButton"
        );

    if (favoriteButton) {

        favoriteButton.addEventListener(
            "click",
            toggleFavoriteUniversity
        );

    }


    // ========================================
    // ปุ่มคณะ
    // ========================================

    document
        .querySelectorAll(
            ".faculty-detail-item[data-faculty]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openFaculty(
                        button.dataset.faculty
                    );

                }
            );

        });

}


// ========================================
// โหลดข้อมูลจาก API
// ========================================

async function loadUniversity() {

    if (!selectedUniversity) {

        universityDetail.innerHTML = `

            <div class="no-result">

                <div class="no-result-icon">
                    ⚠️
                </div>

                <h2>
                    ไม่พบมหาวิทยาลัย
                </h2>

                <p>
                    กรุณาเลือกมหาวิทยาลัยจากหน้ารายการ
                </p>

            </div>

        `;

        return;
    }


    // ========================================
    // Loading
    // ========================================

    universityDetail.innerHTML = `

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
                "https://sentang-checkpoint-api.onrender.com/api/universities/" +
                encodeURIComponent(
                    selectedUniversity
                )
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                "ไม่พบข้อมูลมหาวิทยาลัย"
            );

        }


        displayUniversity(
            result.data
        );


    } catch (error) {

        console.error(
            "API Error:",
            error
        );


        universityDetail.innerHTML = `

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
// เริ่มทำงาน
// ========================================

loadUniversity();