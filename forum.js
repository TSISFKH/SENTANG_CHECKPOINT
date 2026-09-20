// ========================================
// SENTANG CHECKPOINT
// Forum JavaScript
// ========================================

// ========================================
// API
// ========================================

const API_URL =
    "https://sentang-checkpoint-api.onrender.com";


// ========================================
// DOM
// ========================================

const forumList =
    document.getElementById("forumList");

const createPostForm =
    document.getElementById("createPostForm");

const postTitle =
    document.getElementById("postTitle");

const postAuthor =
    document.getElementById("postAuthor");

const postContent =
    document.getElementById("postContent");

const createPostMessage =
    document.getElementById("createPostMessage");


const postDetailSection =
    document.getElementById("postDetailSection");

const detailTitle =
    document.getElementById("detailTitle");

const detailAuthor =
    document.getElementById("detailAuthor");

const detailDate =
    document.getElementById("detailDate");

const detailContent =
    document.getElementById("detailContent");


const replyList =
    document.getElementById("replyList");

const replyForm =
    document.getElementById("replyForm");

const replyAuthor =
    document.getElementById("replyAuthor");

const replyContent =
    document.getElementById("replyContent");

const replyMessage =
    document.getElementById("replyMessage");


// ========================================
// ตัวแปร
// ========================================

let currentPostId = null;

let currentUser = null;


// ========================================
// ดึง Token
// ========================================

function getToken() {

    return localStorage.getItem(
        "sentangToken"
    );

}


// ========================================
// ตรวจสอบ Login
// ========================================

async function checkLogin() {

    const token =
        getToken();

    if (!token) {

        currentUser = null;

        return null;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/auth/me`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            localStorage.removeItem(
                "sentangToken"
            );

            localStorage.removeItem(
                "sentangUser"
            );

            currentUser = null;

            return null;

        }


        currentUser =
            result.user;


        localStorage.setItem(
            "sentangUser",
            JSON.stringify(result.user)
        );


        return currentUser;


    } catch (error) {

        console.error(
            "Auth Error:",
            error
        );

        currentUser = null;

        return null;

    }

}


// ========================================
// บังคับ Login ก่อนใช้งาน
// ========================================

async function requireLogin() {

    const user =
        await checkLogin();


    if (!user) {

        alert(
            "กรุณาเข้าสู่ระบบก่อนใช้งาน"
        );

        window.location.href =
            "login.html";

        return null;

    }


    return user;

}


// ========================================
// แปลงวันที่
// ========================================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(dateString);

    return date.toLocaleString(
        "th-TH",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


// ========================================
// โหลดกระทู้ทั้งหมด
// ========================================

async function loadPosts() {

    try {

        forumList.innerHTML =
            "<p>กำลังโหลดกระทู้...</p>";


        await checkLogin();


        const response =
            await fetch(
                `${API_URL}/api/forum`
            );


        if (!response.ok) {

            throw new Error(
                "ไม่สามารถโหลดกระทู้ได้"
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "ไม่สามารถโหลดกระทู้ได้"
            );

        }


        const posts =
            result.results || [];


        renderPosts(posts);


    } catch (error) {

        console.error(error);


        forumList.innerHTML = `
            <p>
                ไม่สามารถโหลดกระทู้ได้
            </p>
        `;

    }

}


// ========================================
// แสดงรายการกระทู้
// ========================================

function renderPosts(posts) {

    if (posts.length === 0) {

        forumList.innerHTML = `
            <p>
                ยังไม่มีกระทู้
                ลองสร้างกระทู้แรกดูสิ!
            </p>
        `;

        return;

    }


    forumList.innerHTML = "";


    posts.forEach(post => {

        const postElement =
            document.createElement("article");


        postElement.className =
            "forum-post";


        const isOwner =
            currentUser &&
            Number(post.userId) ===
            Number(currentUser.id);


        postElement.innerHTML = `

            <h4>
                ${escapeHTML(post.title)}
            </h4>

            <p>
                ${escapeHTML(post.content)}
            </p>

            <p>
                ผู้โพสต์:
                ${escapeHTML(post.author)}
            </p>

            <p>
                ${formatDate(post.createdAt)}
            </p>

            <p>
                ความคิดเห็น:
                ${post.replies
                    ? post.replies.length
                    : 0}
            </p>

            <button
                type="button"
                onclick="openPost(${post.id})"
            >
                ดูกระทู้
            </button>

            ${
                isOwner
                ? `
                    <button
                        type="button"
                        class="delete-post-button"
                        onclick="deletePost(${post.id})"
                    >
                        🗑️ ลบกระทู้
                    </button>
                  `
                : ""
            }

        `;


        forumList.appendChild(
            postElement
        );

    });

}


// ========================================
// เปิดกระทู้
// ========================================

async function openPost(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/forum/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "ไม่พบกระทู้นี้"
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "ไม่สามารถโหลดกระทู้ได้"
            );

        }


        currentPostId =
            id;


        displayPost(
            result.data
        );


    } catch (error) {

        console.error(error);


        alert(
            error.message ||
            "ไม่สามารถโหลดกระทู้ได้"
        );

    }

}


// ========================================
// แสดงรายละเอียดกระทู้
// ========================================

function displayPost(post) {

    postDetailSection.hidden =
        false;


    detailTitle.textContent =
        post.title;


    detailAuthor.textContent =
        `ผู้โพสต์: ${post.author}`;


    detailDate.textContent =
        formatDate(post.createdAt);


    detailContent.textContent =
        post.content;


    renderReplies(
        post.replies || []
    );


    // ========================================
    // ปุ่มลบกระทู้ในรายละเอียด
    // ========================================

    const existingDeleteButton =
        document.getElementById(
            "deleteCurrentPostButton"
        );


    if (existingDeleteButton) {

        existingDeleteButton.remove();

    }


    const isOwner =
        currentUser &&
        Number(post.userId) ===
        Number(currentUser.id);


    if (isOwner) {

        const deleteButton =
            document.createElement("button");


        deleteButton.id =
            "deleteCurrentPostButton";


        deleteButton.type =
            "button";


        deleteButton.className =
            "delete-post-button";


        deleteButton.textContent =
            "🗑️ ลบกระทู้นี้";


        deleteButton.addEventListener(
            "click",
            () => {
                deletePost(post.id);
            }
        );

    postDetailSection.appendChild(
        deleteButton
    );
}

postDetailSection.scrollIntoView({
    behavior: "smooth"
});

}


// ========================================
// แสดงความคิดเห็น
// ========================================

function renderReplies(replies) {

    if (
        !replies ||
        replies.length === 0
    ) {

        replyList.innerHTML = `
            <p>
                ยังไม่มีความคิดเห็น
            </p>
        `;

        return;

    }


    replyList.innerHTML = "";


    replies.forEach(reply => {

        const replyElement =
            document.createElement("div");


        replyElement.className =
            "forum-reply";


        replyElement.innerHTML = `

            <p>
                ${escapeHTML(reply.content)}
            </p>

            <p>
                โดย
                ${escapeHTML(reply.author)}
            </p>

            <p>
                ${formatDate(reply.createdAt)}
            </p>

        `;


        replyList.appendChild(
            replyElement
        );

    });

}


// ========================================
// สร้างกระทู้
// ========================================

if (createPostForm) {

    createPostForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ========================================
            // ตรวจสอบ Login ก่อน
            // ========================================

            const user =
                await requireLogin();


            if (!user) {
                return;
            }


            createPostMessage.textContent =
                "กำลังสร้างกระทู้...";


            const data = {

                title:
                    postTitle.value.trim(),

                content:
                    postContent.value.trim()

            };


            try {

                const token =
                    getToken();


                const response =
                    await fetch(
                        `${API_URL}/api/forum`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                const result =
                    await response.json();


                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "ไม่สามารถสร้างกระทู้ได้"
                    );

                }


                createPostMessage.textContent =
                    "สร้างกระทู้สำเร็จ";


                createPostForm.reset();


                if (postAuthor) {

                    postAuthor.value =
                        user.displayName || "";

                }


                await loadPosts();


                await openPost(
                    result.data.id
                );


            } catch (error) {

                console.error(error);


                createPostMessage.textContent =
                    error.message ||
                    "ไม่สามารถสร้างกระทู้ได้";

            }

        }
    );

}


// ========================================
// แสดงความคิดเห็น
// ========================================

if (replyForm) {

    replyForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!currentPostId) {

                replyMessage.textContent =
                    "กรุณาเลือกกระทู้ก่อน";

                return;

            }


            // ========================================
            // ตรวจสอบ Login
            // ========================================

            const user =
                await requireLogin();


            if (!user) {
                return;
            }


            replyMessage.textContent =
                "กำลังส่งความคิดเห็น...";


            const data = {

                content:
                    replyContent.value.trim()

            };


            try {

                const token =
                    getToken();


                const response =
                    await fetch(
                        `${API_URL}/api/forum/${currentPostId}/replies`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                const result =
                    await response.json();


                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "ไม่สามารถเพิ่มความคิดเห็นได้"
                    );

                }


                replyMessage.textContent =
                    "เพิ่มความคิดเห็นสำเร็จ";


                replyForm.reset();


                await openPost(
                    currentPostId
                );


                await loadPosts();


            } catch (error) {

                console.error(error);


                replyMessage.textContent =
                    error.message ||
                    "ไม่สามารถเพิ่มความคิดเห็นได้";

            }

        }
    );

}


// ========================================
// ลบกระทู้
// ========================================

async function deletePost(id) {

    const user =
        await requireLogin();


    if (!user) {
        return;
    }


    const confirmed =
        confirm(
            "คุณต้องการลบกระทู้นี้ใช่หรือไม่?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const token =
            getToken();


        const response =
            await fetch(
                `${API_URL}/api/forum/${id}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "ไม่สามารถลบกระทู้ได้"
            );

        }


        alert(
            "ลบกระทู้สำเร็จ"
        );


        if (
            Number(currentPostId) ===
            Number(id)
        ) {

            currentPostId =
                null;

            postDetailSection.hidden =
                true;

        }


        await loadPosts();


    } catch (error) {

        console.error(error);


        alert(
            error.message ||
            "ไม่สามารถลบกระทู้ได้"
        );

    }

}


// ========================================
// ป้องกัน HTML Injection
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text ?? "";


    return div.innerHTML;

}


// ========================================
// เริ่มต้น
// ========================================

async function initializeForum() {
    try {
        await checkLogin();
        await loadPosts();
    } catch (error) {
        console.error("Forum initialization error:", error);
    }
}

initializeForum();