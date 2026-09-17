// ========================================
// SENTANG CHECKPOINT
// Forum JavaScript
// ========================================

// ========================================
// DOM
// ========================================

const forumList = document.getElementById("forumList");

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


// ========================================
// แปลงวันที่
// ========================================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    return date.toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short"
    });

}


// ========================================
// โหลดกระทู้ทั้งหมด
// ========================================

async function loadPosts() {

    try {

        forumList.innerHTML =
            "<p>กำลังโหลดกระทู้...</p>";

        const response =
            await fetch("/api/forum");

        if (!response.ok) {
            throw new Error("ไม่สามารถโหลดกระทู้ได้");
        }

        const result =
            await response.json();

        if (!result.success) {
            throw new Error(
                result.message || "ไม่สามารถโหลดกระทู้ได้"
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

        postElement.className = "forum-post";


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
                ${post.replies ? post.replies.length : 0}
            </p>

            <button
                type="button"
                onclick="openPost(${post.id})"
            >
                ดูกระทู้
            </button>

        `;


        forumList.appendChild(postElement);

    });

}


// ========================================
// เปิดกระทู้
// ========================================

async function openPost(id) {

    try {

        const response =
            await fetch(`/api/forum/${id}`);

        if (!response.ok) {
            throw new Error("ไม่พบกระทู้นี้");
        }

        const result =
            await response.json();

        if (!result.success) {
            throw new Error(
                result.message || "ไม่สามารถโหลดกระทู้ได้"
            );
        }

        currentPostId = id;

        displayPost(result.data);

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

    postDetailSection.hidden = false;


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


    postDetailSection.scrollIntoView({
        behavior: "smooth"
    });

}


// ========================================
// แสดงความคิดเห็น
// ========================================

function renderReplies(replies) {

    if (!replies || replies.length === 0) {

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
                โดย ${escapeHTML(reply.author)}
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

createPostForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        createPostMessage.textContent =
            "กำลังสร้างกระทู้...";


        const data = {

            title:
                postTitle.value.trim(),

            content:
                postContent.value.trim(),

            author:
                postAuthor.value.trim()

        };


        try {

            const response =
                await fetch("/api/forum", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                });


            const result =
                await response.json();


            if (!response.ok ||
                !result.success) {

                throw new Error(
                    result.message ||
                    "ไม่สามารถสร้างกระทู้ได้"
                );

            }


            createPostMessage.textContent =
                "สร้างกระทู้สำเร็จ";


            createPostForm.reset();


            await loadPosts();


            openPost(
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


// ========================================
// แสดงความคิดเห็น
// ========================================

replyForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!currentPostId) {

            replyMessage.textContent =
                "กรุณาเลือกกระทู้ก่อน";

            return;
        }


        replyMessage.textContent =
            "กำลังส่งความคิดเห็น...";


        const data = {

            content:
                replyContent.value.trim(),

            author:
                replyAuthor.value.trim()

        };


        try {

            const response =
                await fetch(
                    `/api/forum/${currentPostId}/replies`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json();


            if (!response.ok ||
                !result.success) {

                throw new Error(
                    result.message ||
                    "ไม่สามารถเพิ่มความคิดเห็นได้"
                );

            }


            replyMessage.textContent =
                "เพิ่มความคิดเห็นสำเร็จ";


            replyForm.reset();


            // โหลดกระทู้ล่าสุด
            await openPost(
                currentPostId
            );


            // โหลดรายการกระทู้ใหม่
            await loadPosts();


        } catch (error) {

            console.error(error);

            replyMessage.textContent =
                error.message ||
                "ไม่สามารถเพิ่มความคิดเห็นได้";

        }

    }
);


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

loadPosts();