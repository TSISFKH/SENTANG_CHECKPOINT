const universityList =
    document.getElementById("universityList");

const searchInput =
    document.getElementById("searchInput");

const regionFilter =
    document.getElementById("regionFilter");

const typeFilter =
    document.getElementById("typeFilter");

const compareCount =
    document.getElementById("compareCount");

const favoriteSection =
    document.getElementById("favoriteSection");

const favoriteListElement =
    document.getElementById("favoriteList");

const favoriteCount =
    document.getElementById("favoriteCount");


// ========================================
// ข้อมูลมหาวิทยาลัย
// ========================================

let universityData = {};


// ========================================
// แปลงชื่อภูมิภาค
// ========================================

function getRegionName(region) {

    const regions = {

        central: "ภาคกลาง",

        north: "ภาคเหนือ",

        northeast: "ภาคตะวันออกเฉียงเหนือ",

        east: "ภาคตะวันออก",

        south: "ภาคใต้"

    };

    return regions[region] || region;

}


// ========================================
// แปลงชื่อประเภท
// ========================================

function getTypeName(type) {

    const types = {

        public: "มหาวิทยาลัยรัฐ",

        private: "มหาวิทยาลัยเอกชน"

    };

    return types[type] || type;

}


// ========================================
// มหาวิทยาลัยที่เลือกเปรียบเทียบ
// ========================================

let compareList =
    JSON.parse(
        localStorage.getItem("compareUniversities")
    ) || [];


// ========================================
// มหาวิทยาลัยที่สนใจ
// ========================================

let favoriteUniversities =
    JSON.parse(
        localStorage.getItem("favoriteUniversities")
    ) || [];


// ========================================
// เปิดรายละเอียดมหาวิทยาลัย
// ========================================

function openUniversity(universityName) {

    localStorage.setItem(
        "selectedUniversity",
        universityName
    );

    window.location.href =
        "university-detail.html";

}


// ========================================
// เลือกมหาวิทยาลัยเพื่อเปรียบเทียบ
// ========================================

function toggleCompare(universityName) {

    const index =
        compareList.indexOf(universityName);

    if (index !== -1) {

        compareList.splice(index, 1);

    }

    else {

        if (compareList.length >= 3) {

            alert(
                "สามารถเลือกเปรียบเทียบได้สูงสุด 3 มหาวิทยาลัย"
            );

            return;

        }

        compareList.push(universityName);

    }

    localStorage.setItem(
        "compareUniversities",
        JSON.stringify(compareList)
    );

    renderUniversities();

}


// ========================================
// เพิ่ม / ลบมหาวิทยาลัยที่สนใจ
// ========================================

function toggleFavorite(universityName) {

    const index =
        favoriteUniversities.indexOf(universityName);

    if (index !== -1) {

        favoriteUniversities.splice(index, 1);

    }

    else {

        favoriteUniversities.push(universityName);

    }

    localStorage.setItem(
        "favoriteUniversities",
        JSON.stringify(favoriteUniversities)
    );

    renderUniversities();

}


// ========================================
// ไปหน้าเปรียบเทียบ
// ========================================

function goToCompare() {

    if (compareList.length < 2) {

        alert(
            "กรุณาเลือกมหาวิทยาลัยอย่างน้อย 2 แห่งเพื่อเปรียบเทียบ"
        );

        return;

    }

    window.location.href =
        "compare.html";

}


// ========================================
// สร้าง Card มหาวิทยาลัย
// ========================================

function createUniversityCard(universityName) {

    const university =
        universityData[universityName];

    if (!university) {

        return "";

    }

    const isFavorite =
        favoriteUniversities.includes(
            universityName
        );

    const isCompared =
        compareList.includes(
            universityName
        );

    return `

        <div class="university-card">

            <div
                class="university-card-main"
                onclick="openUniversity('${universityName}')"
            >

                <div class="university-icon">

                    ${
                        university.image
                            ? `
                                <img
                                    src="${university.image}"
                                    alt="${universityName}"
                                >
                            `
                            : "🎓"
                    }

                </div>

                <div class="university-info">

                    <h3>
                        ${universityName}
                    </h3>

                    <p>
                        📍 ${university.province}
                    </p>

                    <p>
                        ${university.description || ""}
                    </p>

                    <div class="career-tag-list">

                        <span>
                            ${getRegionName(
                                university.region
                            )}
                        </span>

                        <span>
                            ${getTypeName(
                                university.type
                            )}
                        </span>

                    </div>

                </div>

            </div>

            <div class="university-card-actions">

                <button
                    class="favorite-button ${
                        isFavorite
                            ? "selected"
                            : ""
                    }"
                    onclick="
                        event.stopPropagation();
                        toggleFavorite('${universityName}')
                    "
                >

                    ${
                        isFavorite
                            ? "★ สนใจแล้ว"
                            : "☆ สนใจ"
                    }

                </button>

                <button
                    class="compare-button ${
                        isCompared
                            ? "selected"
                            : ""
                    }"
                    onclick="
                        event.stopPropagation();
                        toggleCompare('${universityName}')
                    "
                >

                    ${
                        isCompared
                            ? "✓ เลือกแล้ว"
                            : "เปรียบเทียบ"
                    }

                </button>

            </div>

        </div>

    `;

}


// ========================================
// แสดงมหาวิทยาลัยที่สนใจ
// ========================================

function renderFavorites() {

    if (
        !favoriteSection ||
        !favoriteListElement
    ) {

        return;

    }

    const validFavorites =
        favoriteUniversities.filter(
            universityName =>
                universityData[universityName]
        );

    favoriteUniversities =
        validFavorites;

    localStorage.setItem(
        "favoriteUniversities",
        JSON.stringify(
            favoriteUniversities
        )
    );

    if (
        favoriteUniversities.length === 0
    ) {

        favoriteSection.style.display =
            "none";

        return;

    }

    favoriteSection.style.display =
        "block";

    if (favoriteCount) {

        favoriteCount.textContent =
            `${favoriteUniversities.length} แห่ง`;

    }

    favoriteListElement.innerHTML =

        favoriteUniversities
            .map(
                universityName =>
                    createUniversityCard(
                        universityName
                    )
            )
            .join("");

}


// ========================================
// แสดงมหาวิทยาลัยทั้งหมด
// ========================================

function renderUniversities() {

    if (!universityList) {

        return;

    }

    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const selectedRegion =
        regionFilter
            ? regionFilter.value
            : "all";

    const selectedType =
        typeFilter
            ? typeFilter.value
            : "all";

    const universities =
        Object.keys(
            universityData
        ).filter(
            universityName => {

                const university =
                    universityData[
                        universityName
                    ];

                const matchesSearch =
                    universityName
                        .toLowerCase()
                        .includes(searchText);

                const matchesRegion =
                    selectedRegion === "all" ||
                    university.region ===
                        selectedRegion;

                const matchesType =
                    selectedType === "all" ||
                    university.type ===
                        selectedType;

                return (
                    matchesSearch &&
                    matchesRegion &&
                    matchesType
                );

            }
        );


    if (universities.length === 0) {

        universityList.innerHTML = `

            <div class="no-result">

                <div class="no-result-icon">
                    🎓
                </div>

                <h2>
                    ไม่พบมหาวิทยาลัย
                </h2>

                <p>
                    ลองเปลี่ยนคำค้นหา
                    หรือเปลี่ยนตัวกรอง
                </p>

            </div>

        `;

    }

    else {

        universityList.innerHTML =

            universities
                .map(
                    universityName =>
                        createUniversityCard(
                            universityName
                        )
                )
                .join("");

    }


    if (compareCount) {

        compareCount.textContent =
            compareList.length;

    }

    renderFavorites();

}


// ========================================
// ค้นหาขณะพิมพ์
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderUniversities
    );

}


// ========================================
// เปลี่ยนภูมิภาค
// ========================================

if (regionFilter) {

    regionFilter.addEventListener(
        "change",
        renderUniversities
    );

}


// ========================================
// เปลี่ยนประเภท
// ========================================

if (typeFilter) {

    typeFilter.addEventListener(
        "change",
        renderUniversities
    );

}


// ========================================
// โหลดข้อมูลมหาวิทยาลัยจาก API
// ========================================

async function loadUniversities() {

    try {

        const response =
            await fetch(
                "https://sentang-checkpoint-api.onrender.com/api/universities"
            );

        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }

        const data =
            await response.json();

        if (
            !data.success ||
            !Array.isArray(data.results)
        ) {

            throw new Error(
                "รูปแบบข้อมูลจาก API ไม่ถูกต้อง"
            );

        }


        universityData = {};


        data.results.forEach(
            university => {

                universityData[
                    university.name
                ] = {

                    province:
                        university.province,

                    region:
                        university.region,

                    type:
                        university.type,

                    image:
                        university.image,

                    description:
                        university.description,

                    faculties:
                        university.faculties || []

                };

            }
        );


        renderUniversities();

    }

    catch (error) {

        console.error(
            "API Error:",
            error
        );

        if (universityList) {

            universityList.innerHTML = `

                <div class="no-result">

                    <div class="no-result-icon">
                        ⚠️
                    </div>

                    <h2>
                        ไม่สามารถโหลดข้อมูลได้
                    </h2>

                    <p>
                        กรุณาตรวจสอบว่า API Server
                        กำลังทำงานอยู่
                    </p>

                </div>

            `;

        }

    }

}


// ========================================
// เริ่มต้นระบบ
// ========================================

loadUniversities();