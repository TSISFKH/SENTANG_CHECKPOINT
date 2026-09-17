// ========================================
// SENTANG CHECKPOINT
// เปรียบเทียบมหาวิทยาลัย
// ========================================


// ========================================
// เรียก HTML
// ========================================

const compareContainer =
    document.getElementById(
        "compareContainer"
    );


// ========================================
// รับมหาวิทยาลัยที่เลือก
// ========================================

let compareList =
    JSON.parse(
        localStorage.getItem(
            "compareUniversities"
        )
    ) || [];


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

    window.location.href =
        "university-detail.html";

}


// ========================================
// เอามหาวิทยาลัยออกจากการเปรียบเทียบ
// ========================================

function removeFromCompare(
    universityName
) {

    compareList =
        compareList.filter(
            name =>
                name !== universityName
        );


    localStorage.setItem(
        "compareUniversities",
        JSON.stringify(
            compareList
        )
    );


    displayComparison();

}


// ========================================
// แสดงผลการเปรียบเทียบ
// ========================================

function displayComparison() {


    // ====================================
    // ตรวจสอบจำนวน
    // ====================================

    if (compareList.length < 2) {

        compareContainer.innerHTML = `

            <div class="no-result">

                <div class="no-result-icon">
                    ⚖️
                </div>


                <h2>
                    ยังเปรียบเทียบไม่ได้
                </h2>


                <p>
                    กรุณาเลือกมหาวิทยาลัย
                    อย่างน้อย 2 แห่ง
                </p>


                <a
                    href="universities.html"
                    class="detail-button"
                >
                    เลือกมหาวิทยาลัย
                </a>

            </div>

        `;

        return;

    }


    // ====================================
    // ตรวจสอบข้อมูล
    // ====================================

    const universities =
        compareList
            .map(
                universityName =>
                    universityData[
                        universityName
                    ]
            )
            .filter(
                university =>
                    university
            );


    if (
        universities.length < 2
    ) {

        compareContainer.innerHTML = `

            <div class="no-result">

                <div class="no-result-icon">
                    ⚠️
                </div>


                <h2>
                    ไม่พบข้อมูล
                </h2>


                <p>
                    ข้อมูลมหาวิทยาลัย
                    ที่เลือกไม่พร้อมใช้งาน
                </p>

            </div>

        `;

        return;

    }


    // ====================================
    // หาชื่อมหาวิทยาลัยที่ใช้จริง
    // ====================================

    const validNames =
        compareList.filter(
            universityName =>
                universityData[
                    universityName
                ]
        );


    // ====================================
    // ส่วนหัว
    // ====================================

    let html = `

        <div class="compare-header">

            <h2>
                ⚖️ เปรียบเทียบ
            </h2>

            <p>
                เปรียบเทียบข้อมูล
                ${validNames.length}
                มหาวิทยาลัย
            </p>

        </div>


        <div class="compare-table-wrapper">

            <table class="compare-table">

                <thead>

                    <tr>

                        <th>
                            ข้อมูล
                        </th>

    `;


    // ====================================
    // ชื่อมหาวิทยาลัย
    // ====================================

    validNames.forEach(
        universityName => {

            html += `

                <th>

                    <div class="compare-university-name">

                        <span>
                            🎓
                        </span>

                        <strong>
                            ${universityName}
                        </strong>

                    </div>


                    <button
                        class="compare-remove-button"
                        onclick="
                            removeFromCompare(
                                '${universityName}'
                            )
                        "
                    >
                        ✕ เอาออก
                    </button>

                </th>

            `;

        }
    );


    html += `

                    </tr>

                </thead>


                <tbody>

    `;


    // ====================================
    // จังหวัด
    // ====================================

    html += createComparisonRow(
        "📍 จังหวัด",
        validNames,
        university =>
            university.province
    );


    // ====================================
    // ภูมิภาค
    // ====================================

    html += createComparisonRow(
        "🗺️ ภูมิภาค",
        validNames,
        university =>
            getRegionName(
                university.region
            )
    );


    // ====================================
    // ประเภท
    // ====================================

    html += createComparisonRow(
        "🏛️ ประเภท",
        validNames,
        university =>
            getTypeName(
                university.type
            )
    );


    // ====================================
    // คณะ
    // ====================================

    html += createComparisonRow(
        "📚 คณะที่เปิดสอน",
        validNames,
        university => `

            <div class="compare-faculties">

                ${
                    university.faculties
                        .map(
                            faculty =>
                                `<span>${faculty}</span>`
                        )
                        .join("")
                }

            </div>

        `
    );


    // ====================================
    // รายละเอียด
    // ====================================

    html += createComparisonRow(
        "📝 รายละเอียด",
        validNames,
        university =>
            university.description
    );


    html += `

                </tbody>

            </table>

        </div>


        <div class="compare-actions">

            <a
                href="universities.html"
                class="detail-button"
            >
                ← เลือกมหาวิทยาลัยเพิ่ม
            </a>

        </div>

    `;


    compareContainer.innerHTML =
        html;

}


// ========================================
// สร้างแถวเปรียบเทียบ
// ========================================

function createComparisonRow(
    title,
    universityNames,
    valueFunction
) {

    let row = `

        <tr>

            <th>
                ${title}
            </th>

    `;


    universityNames.forEach(
        universityName => {

            const university =
                universityData[
                    universityName
                ];


            row += `

                <td>
                    ${
                        valueFunction(
                            university
                        )
                    }
                </td>

            `;

        }
    );


    row += `

        </tr>

    `;


    return row;

}


// ========================================
// เริ่มต้น
// ========================================

displayComparison();