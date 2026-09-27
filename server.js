// ========================================
// SENTANG CHECKPOINT
// SERVER
// ========================================

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { GoogleGenAI, Type } = require("@google/genai");

const {
    universityData,
    getRegionName,
    getTypeName,
    getUniversitiesByFaculty
} = require("./university-data");

const {
    facultyData
} = require("./faculty-data");

const {
    careerData
} = require("./career-data");


const app = express();

const PORT = process.env.PORT || 3000;


// ========================================
// Middleware
// ========================================

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname));

// ========================================
// Gemini AI
// ========================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// ========================================
// ตัวแปรระบบผู้ใช้
// ========================================

// ผู้ใช้ทั้งหมด
let users = [];

// token ที่กำลัง Login อยู่
let sessions = new Map();

let nextUserId = 1;



// ========================================
// ตัวแปร Forum
// ========================================

let forumPosts = [];

let nextForumId = 1;

let nextReplyId = 1;


// ========================================
// ฟังก์ชันช่วยเหลือ
// ========================================

// สร้าง Token แบบสุ่ม
function createToken() {

    return crypto.randomBytes(32).toString("hex");

}


// ========================================
// ตรวจสอบ Email
// ========================================

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


// ========================================
// Hash Password
// ========================================

function hashPassword(password) {

    return new Promise((resolve, reject) => {

        const salt =
            crypto.randomBytes(16).toString("hex");

        crypto.scrypt(
            password,
            salt,
            64,
            (error, derivedKey) => {

                if (error) {

                    reject(error);

                    return;

                }

                resolve(
                    `${salt}:${derivedKey.toString("hex")}`
                );

            }
        );

    });

}


// ========================================
// ตรวจสอบ Password
// ========================================

function verifyPassword(password, storedPassword) {

    return new Promise((resolve, reject) => {

        const parts =
            storedPassword.split(":");

        if (parts.length !== 2) {

            resolve(false);

            return;

        }

        const salt = parts[0];

        const storedHash =
            Buffer.from(parts[1], "hex");

        crypto.scrypt(
            password,
            salt,
            64,
            (error, derivedKey) => {

                if (error) {

                    reject(error);

                    return;

                }

                if (
                    storedHash.length !==
                    derivedKey.length
                ) {

                    resolve(false);

                    return;

                }

                resolve(
                    crypto.timingSafeEqual(
                        storedHash,
                        derivedKey
                    )
                );

            }
        );

    });

}


// ========================================
// ดึง Token จาก Request
// ========================================

function getTokenFromRequest(req) {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {

        return null;

    }

    if (
        !authHeader.startsWith("Bearer ")
    ) {

        return null;

    }

    return authHeader.substring(7);

}


// ========================================
// ดึง User จาก Token
// ========================================

function getUserFromRequest(req) {

    const token =
        getTokenFromRequest(req);

    if (!token) {

        return null;

    }

    const userId =
        sessions.get(token);

    if (!userId) {

        return null;

    }

    return users.find(
        user => user.id === userId
    ) || null;

}


// ========================================
// Middleware Login
// ========================================

function requireAuth(req, res, next) {

    const user =
        getUserFromRequest(req);

    if (!user) {

        return res.status(401).json({

            success: false,

            message:
                "กรุณาเข้าสู่ระบบก่อนใช้งาน"

        });

    }

    req.user = user;

    next();

}


// ========================================
// AUTH API
// ========================================


// ========================================
// สมัครสมาชิก
// POST /api/auth/register
// ========================================

app.post(
    "/api/auth/register",
    async (req, res) => {

        try {

            const {
                email,
                username,
                password,
                displayName
            } = req.body;


            // ========================================
            // ตรวจสอบข้อมูลเบื้องต้น
            // ========================================

            if (
                !email ||
                !username ||
                !password ||
                !displayName
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "กรุณากรอกข้อมูลให้ครบ"

                });

            }


            const cleanEmail =
                String(email)
                    .trim()
                    .toLowerCase();

            const cleanUsername =
                String(username)
                    .trim()
                    .toLowerCase();

            const cleanDisplayName =
                String(displayName)
                    .trim();


            // ========================================
            // ตรวจสอบ Email
            // ========================================

            if (!isValidEmail(cleanEmail)) {

                return res.status(400).json({

                    success: false,

                    message:
                        "รูปแบบอีเมลไม่ถูกต้อง"

                });

            }


            // ========================================
            // ตรวจสอบ Username
            // ========================================

            if (
                cleanUsername.length < 3
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"

                });

            }


            // ========================================
            // ตรวจสอบ Password
            // ========================================

            if (
                password.length < 6
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"

                });

            }


            // ========================================
            // ตรวจสอบ Display Name
            // ========================================

            if (
                cleanDisplayName.length < 1
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "กรุณากรอกชื่อที่ใช้แสดง"

                });

            }


            // ========================================
            // ตรวจสอบ Username ซ้ำ
            // ========================================

            const existingUsername =
                users.find(
                    user =>
                        user.username ===
                        cleanUsername
                );


            if (existingUsername) {

                return res.status(409).json({

                    success: false,

                    message:
                        "ชื่อผู้ใช้นี้ถูกใช้แล้ว"

                });

            }


            // ========================================
            // ตรวจสอบ Email ซ้ำ
            // ========================================

            const existingEmail =
                users.find(
                    user =>
                        user.email ===
                        cleanEmail
                );


            if (existingEmail) {

                return res.status(409).json({

                    success: false,

                    message:
                        "อีเมลนี้ถูกใช้แล้ว"

                });

            }


            // ========================================
            // Hash Password
            // ========================================

            const passwordHash =
                await hashPassword(password);


            // ========================================
            // สร้าง User
            // ========================================

           const newUser = {
    id:
        nextUserId++,
    email:
        cleanEmail,
    username:
        cleanUsername,
    displayName:
        cleanDisplayName,

    // เวลาที่เปลี่ยนชื่อครั้งล่าสุด
    // null = ยังไม่เคยเปลี่ยน
    displayNameChangedAt:
        null,

    authProvider:
        "email",
    googleId:
        null,
    passwordHash,
    createdAt:
        new Date().toISOString()
};


            users.push(newUser);


            // ========================================
            // Response
            // ========================================

            return res.status(201).json({

                success: true,

                message:
                    "สมัครสมาชิกสำเร็จ",

                user: {

                    id:
                        newUser.id,

                    email:
                        newUser.email,

                    username:
                        newUser.username,

                    displayName:
                        newUser.displayName

                }

            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    "เกิดข้อผิดพลาดในการสมัครสมาชิก"

            });

        }

    }
);


// ========================================
// Login
// POST /api/auth/login
// ========================================

app.post(
    "/api/auth/login",
    async (req, res) => {

        try {

            const {
                username,
                password
            } = req.body;


            if (
                !username ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"

                });

            }


            const cleanUsername =
                String(username)
                    .trim()
                    .toLowerCase();


            const user =
                users.find(
                    item =>
                        item.username ===
                        cleanUsername
                );


            if (!user) {

                return res.status(401).json({

                    success: false,

                    message:
                        "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"

                });

            }


            const passwordCorrect =
                await verifyPassword(
                    password,
                    user.passwordHash
                );


            if (!passwordCorrect) {

                return res.status(401).json({

                    success: false,

                    message:
                        "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"

                });

            }


            // ========================================
            // สร้าง Token
            // ========================================

            const token =
                createToken();


            sessions.set(
                token,
                user.id
            );


            // ========================================
            // Response
            // ========================================

            return res.json({

                success: true,

                message:
                    "เข้าสู่ระบบสำเร็จ",

                token,

                user: {

                    id:
                        user.id,

                    email:
                        user.email,

                    username:
                        user.username,

                    displayName:
                        user.displayName

                }

            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"

            });

        }

    }
);


// ========================================
// ข้อมูลผู้ใช้ที่ Login อยู่
// GET /api/auth/me
// ========================================

app.get(
    "/api/auth/me",
    requireAuth,
    (req, res) => {

        res.json({

            success: true,

            user: {

                id:
                    req.user.id,

                email:
                    req.user.email,

                username:
                    req.user.username,

                displayName:
                    req.user.displayName,

                displayNameChangedAt:
                    req.user.displayNameChangedAt

            }

        });

    }
);


// ========================================
// เปลี่ยนชื่อที่แสดง
// PUT /api/auth/display-name
// ========================================

app.put(
    "/api/auth/display-name",
    requireAuth,
    (req, res) => {

        const displayName =
            String(
                req.body.displayName || ""
            ).trim();


        // ========================================
        // ตรวจสอบชื่อ
        // ========================================

        if (!displayName) {

            return res.status(400).json({
                success: false,
                message:
                    "กรุณากรอกชื่อที่ต้องการใช้แสดง"
            });

        }


        if (displayName.length < 1) {

            return res.status(400).json({
                success: false,
                message:
                    "ชื่อที่แสดงต้องมีอย่างน้อย 1 ตัวอักษร"
            });

        }


        if (displayName.length > 30) {

            return res.status(400).json({
                success: false,
                message:
                    "ชื่อที่แสดงต้องไม่เกิน 30 ตัวอักษร"
            });

        }


        // ========================================
        // ถ้าชื่อเหมือนเดิม
        // ========================================

        if (
            displayName ===
            req.user.displayName
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "ชื่อใหม่นี้เหมือนกับชื่อปัจจุบัน"
            });

        }


        // ========================================
        // ตรวจสอบระยะเวลา 14 วัน
        // ========================================

        if (
            req.user.displayNameChangedAt
        ) {

            const lastChanged =
                new Date(
                    req.user.displayNameChangedAt
                ).getTime();

            const now =
                Date.now();

            const fourteenDays =
                14 *
                24 *
                60 *
                60 *
                1000;

            const timePassed =
                now -
                lastChanged;


            if (
                timePassed <
                fourteenDays
            ) {

                const remaining =
                    fourteenDays -
                    timePassed;

                const remainingDays =
                    Math.ceil(
                        remaining /
                        (
                            24 *
                            60 *
                            60 *
                            1000
                        )
                    );

                return res.status(429).json({
                    success: false,
                    message:
                        `คุณสามารถเปลี่ยนชื่อได้อีกครั้งใน ${remainingDays} วัน`
                });

            }

        }


        // ========================================
        // เปลี่ยนชื่อ
        // ========================================

        const oldDisplayName =
            req.user.displayName;

        const changedAt =
            new Date().toISOString();


        req.user.displayName =
            displayName;

        req.user.displayNameChangedAt =
            changedAt;


        // ========================================
        // อัปเดตชื่อใน Forum
        // ========================================

        forumPosts.forEach(
            post => {

                if (
                    Number(post.userId) ===
                    Number(req.user.id)
                ) {

                    post.author =
                        displayName;

                }


                if (
                    Array.isArray(
                        post.replies
                    )
                ) {

                    post.replies.forEach(
                        reply => {

                            if (
                                Number(reply.userId) ===
                                Number(req.user.id)
                            ) {

                                reply.author =
                                    displayName;

                            }

                        }
                    );

                }

            }
        );


        // ========================================
        // Response
        // ========================================

        return res.json({

            success: true,

            message:
                "เปลี่ยนชื่อสำเร็จ",

            user: {

                id:
                    req.user.id,

                email:
                    req.user.email,

                username:
                    req.user.username,

                displayName:
                    req.user.displayName,

                displayNameChangedAt:
                    req.user.displayNameChangedAt

            }

        });

    }
);

// ========================================
// Logout
// POST /api/auth/logout
// ========================================

app.post(
    "/api/auth/logout",
    (req, res) => {

        const token =
            getTokenFromRequest(req);


        if (token) {

            sessions.delete(token);

        }


        res.json({

            success: true,

            message:
                "ออกจากระบบสำเร็จ"

        });

    }
);


// ========================================
// UNIVERSITY API
// ========================================


// GET /api/universities
app.get(
    "/api/universities",
    (req, res) => {

        const results =
            Object.entries(universityData)
                .map(
                    ([name, data]) => ({

                        name,

                        province:
                            data.province,

                        region:
                            data.region,

                        regionName:
                            getRegionName(
                                data.region
                            ),

                        type:
                            data.type,

                        typeName:
                            getTypeName(
                                data.type
                            ),

                        image:
                            data.image,

                        description:
                            data.description,

                        faculties:
                            data.faculties

                    })
                );


        res.json({

            success: true,

            count:
                results.length,

            results

        });

    }
);


// GET /api/universities/search?q=
app.get(
    "/api/universities/search",
    (req, res) => {

        const q =
            String(
                req.query.q || ""
            )
                .trim()
                .toLowerCase();


        if (!q) {

            return res.json({

                success: true,

                count: 0,

                results: []

            });

        }


        const results =
            Object.entries(universityData)
                .filter(
                    ([name, data]) => {

                        const searchText =
                            [

                                name,

                                data.province,

                                data.description,

                                ...(data.faculties || [])

                            ]
                                .join(" ")
                                .toLowerCase();


                        return searchText.includes(q);

                    }
                )
                .map(
                    ([name, data]) => ({

                        name,

                        province:
                            data.province,

                        region:
                            data.region,

                        regionName:
                            getRegionName(
                                data.region
                            ),

                        type:
                            data.type,

                        typeName:
                            getTypeName(
                                data.type
                            ),

                        image:
                            data.image,

                        description:
                            data.description,

                        faculties:
                            data.faculties

                    })
                );


        res.json({

            success: true,

            count:
                results.length,

            results

        });

    }
);


// GET /api/universities/:name
app.get(
    "/api/universities/:name",
    (req, res) => {

        const name =
            decodeURIComponent(
                req.params.name
            );


        const university =
            universityData[name];


        if (!university) {

            return res.status(404).json({

                success: false,

                message:
                    "ไม่พบมหาวิทยาลัยนี้"

            });

        }


        res.json({

            success: true,

            data: {

                name,

                province:
                    university.province,

                region:
                    university.region,

                regionName:
                    getRegionName(
                        university.region
                    ),

                type:
                    university.type,

                typeName:
                    getTypeName(
                        university.type
                    ),

                image:
                    university.image,

                description:
                    university.description,

                faculties:
                    university.faculties

            }

        });

    }
);


// ========================================
// FACULTY API
// ========================================


// GET /api/faculties
app.get(
    "/api/faculties",
    (req, res) => {

        const results =
            Object.entries(facultyData)
                .map(
                    ([name, data]) => ({

                        name,

                        icon:
                            data.icon,

                        description:
                            data.description,

                        subjects:
                            data.subjects,

                        suitableFor:
                            data.suitableFor,

                        careers:
                            data.careers

                    })
                );


        res.json({

            success: true,

            count:
                results.length,

            results

        });

    }
);


// GET /api/faculties/:name
app.get(
    "/api/faculties/:name",
    (req, res) => {

        const name =
            decodeURIComponent(
                req.params.name
            );


        const faculty =
            facultyData[name];


        if (!faculty) {

            return res.status(404).json({

                success: false,

                message:
                    "ไม่พบคณะนี้"

            });

        }


        res.json({

            success: true,

            data: {

                name,

                icon:
                    faculty.icon,

                description:
                    faculty.description,

                subjects:
                    faculty.subjects,

                suitableFor:
                    faculty.suitableFor,

                careers:
                    faculty.careers,

                universities:
                    getUniversitiesByFaculty(
                        name
                    )

            }

        });

    }
);


// ========================================
// CAREER API
// ========================================


// GET /api/careers
app.get(
    "/api/careers",
    (req, res) => {

        const results =
            Object.entries(careerData)
                .map(
                    ([name, data]) => ({

                        name,

                        category:
                            data.category,

                        icon:
                            data.icon,

                        description:
                            data.description,

                        work:
                            data.work,

                        skills:
                            data.skills,

                        attitude:
                            data.attitude,

                        study:
                            data.study,

                        path:
                            data.path,

                        faculties:
                            data.faculties

                    })
                );


        res.json({

            success: true,

            count:
                results.length,

            results

        });

    }
);


// GET /api/careers/:name
app.get(
    "/api/careers/:name",
    (req, res) => {

        const name =
            decodeURIComponent(
                req.params.name
            );


        const career =
            careerData[name];


        if (!career) {

            return res.status(404).json({

                success: false,

                message:
                    "ไม่พบอาชีพนี้"

            });

        }


        res.json({

            success: true,

            data: {

                name,

                category:
                    career.category,

                icon:
                    career.icon,

                description:
                    career.description,

                work:
                    career.work,

                skills:
                    career.skills,

                attitude:
                    career.attitude,

                study:
                    career.study,

                path:
                    career.path,

                faculties:
                    career.faculties

            }

        });

    }
);


// ========================================
// FORUM API
// ========================================


// GET /api/forum
app.get(
    "/api/forum",
    (req, res) => {

        res.json({

            success: true,

            count:
                forumPosts.length,

            results:
                forumPosts

        });

    }
);


// GET /api/forum/:id
app.get(
    "/api/forum/:id",
    (req, res) => {

        const id =
            Number(req.params.id);


        const post =
            forumPosts.find(
                item => item.id === id
            );


        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "ไม่พบกระทู้นี้"

            });

        }


        res.json({

            success: true,

            data:
                post

        });

    }
);

// DELETE /api/forum/:id
app.delete(
    "/api/forum/:id",
    requireAuth,
    (req, res) => {
        const id =
            Number(req.params.id);

        const postIndex =
            forumPosts.findIndex(
                item => item.id === id
            );

        if (postIndex === -1) {
            return res.status(404).json({
                success: false,
                message:
                    "ไม่พบกระทู้นี้"
            });
        }

        const post =
            forumPosts[postIndex];

        if (
            post.userId !==
            req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "คุณไม่มีสิทธิ์ลบกระทู้นี้"
            });
        }

        forumPosts.splice(
            postIndex,
            1
        );

        res.json({
            success: true,
            message:
                "ลบกระทู้สำเร็จ"
        });
    }
);


// POST /api/forum
app.post(
    "/api/forum",
    requireAuth,
    (req, res) => {

        const {
    title,
    content
} = req.body;


       if (
    !title ||
    !content
) {

            return res.status(400).json({

                success: false,

                message:
                    "กรุณากรอกข้อมูลกระทู้ให้ครบ"

            });

        }


      


        const newPost = {

            id:
                nextForumId++,

            title:
                String(title).trim(),

            content:
                String(content).trim(),

            author:
    req.user.displayName,

userId:
    req.user.id,

            createdAt:
                new Date().toISOString(),

            replies: []

        };


        forumPosts.push(newPost);


        res.status(201).json({

            success: true,

            message:
                "สร้างกระทู้สำเร็จ",

            data:
                newPost

        });

    }
);


// POST /api/forum/:id/replies
app.post(
    "/api/forum/:id/replies",
    requireAuth,
    (req, res) => {

        const id =
            Number(req.params.id);


        const post =
            forumPosts.find(
                item => item.id === id
            );


        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "ไม่พบกระทู้นี้"

            });

        }


      const {
    content
} = req.body;

if (!content) {
    return res.status(400).json({
        success: false,
        message:
            "กรุณากรอกความคิดเห็นให้ครบ"
    });
}


    


       const newReply = {
    id: nextReplyId++,
    content: String(content).trim(),
    author: req.user.displayName,
    userId: req.user.id,
    createdAt: new Date().toISOString()
};

        post.replies.push(
            newReply
        );


        res.status(201).json({

            success: true,

            message:
                "เพิ่มความคิดเห็นสำเร็จ",

            data:
                newReply

        });

    }
);


// ========================================
// TEST API
// ========================================

app.get(
    "/api",
    (req, res) => {

        res.json({

            success: true,

            message:
                "SENTANG CHECKPOINT API ทำงานอยู่",

            endpoints: {

                auth: [

                    "POST /api/auth/register",

                    "POST /api/auth/login",

                    "GET /api/auth/me",

                    "POST /api/auth/logout"

                ],

                universities: [

                    "GET /api/universities",

                    "GET /api/universities/search?q=",

                    "GET /api/universities/:name"

                ],

                faculties: [

                    "GET /api/faculties",

                    "GET /api/faculties/:name"

                ],

                careers: [

                    "GET /api/careers",

                    "GET /api/careers/:name"

                ],

               forum: [
                    "GET /api/forum",
                     "GET /api/forum/:id",
                    "POST /api/forum",
                    "POST /api/forum/:id/replies",
                     "DELETE /api/forum/:id"
]
                

            }

        });

    }
);

/* =====================================
   FREE THINKING AI
===================================== */

app.post("/api/free-thinking", async (req, res) => {

    try {

        const {
            text,
            quizScores
        } = req.body;


        /* =====================================
           ตรวจข้อมูล
        ===================================== */

        if (
            !text ||
            typeof text !== "string" ||
            text.trim().length < 10
        ) {

            return res.status(400).json({
                success: false,
                message: "กรุณาเขียนรายละเอียดเพิ่มเติม"
            });

        }


        /* =====================================
           คะแนนจากแบบทดสอบเดิม
        ===================================== */

        const scores = {

            science:
                Number(quizScores?.science) || 0,

            technology:
                Number(quizScores?.technology) || 0,

            business:
                Number(quizScores?.business) || 0,

            social:
                Number(quizScores?.social) || 0,

            creative:
                Number(quizScores?.creative) || 0

        };


        /* =====================================
           Prompt สำหรับ Gemini
        ===================================== */

        const prompt = `
คุณคือ AI สำหรับระบบ SENTANG CHECKPOINT
ซึ่งเป็นเว็บไซต์ช่วยนักเรียนค้นหาแนวทางการศึกษาต่อและอาชีพที่เหมาะกับความสนใจของตนเอง

หน้าที่ของคุณคือวิเคราะห์ข้อความ Free Thinking ของนักเรียน
โดยต้องวิเคราะห์ "ความหมายและบริบท" ไม่ใช่ตัดสินจาก keyword เพียงคำเดียว

หลักสำคัญ:
1. ห้ามสรุปจากคำใดคำหนึ่งเพียงอย่างเดียว
2. พิจารณาสิ่งที่นักเรียนชอบ ไม่ชอบ วิธีคิด สิ่งที่อยากทำ และสิ่งที่ให้ความสำคัญ
3. คะแนนจากแบบทดสอบเป็นเพียงข้อมูลประกอบ ไม่ใช่คำตอบตายตัว
4. ถ้าข้อมูลยังไม่เพียงพอ ให้บอกว่ายังมีความไม่แน่นอน
5. อย่าบอกว่านักเรียน "ต้อง" เรียนคณะหรืออาชีพใด
6. ให้เหตุผลจากข้อความของนักเรียนโดยตรง
7. สามารถมีความสนใจหลายด้านได้
8. อย่าเลือกผลลัพธ์เพียงเพราะมี keyword ที่ตรงกับหมวดนั้น

หมวดความสนใจที่ระบบใช้:

science = วิทยาศาสตร์ การทดลอง การวิจัย การแพทย์ และการค้นคว้า
technology = คอมพิวเตอร์ โปรแกรม เทคโนโลยี AI และระบบ
business = ธุรกิจ การบริหาร การตลาด การเงิน และการเป็นผู้ประกอบการ
social = ผู้คน สังคม การช่วยเหลือ การสื่อสาร การศึกษา และกฎหมาย
creative = ศิลปะ การออกแบบ การสร้างสรรค์ สื่อ ดนตรี และคอนเทนต์

ข้อความของนักเรียน:
"""
${text.trim()}
"""

คะแนนจากแบบทดสอบเดิม:
${JSON.stringify(scores, null, 2)}

วิเคราะห์นักเรียนคนนี้อย่างเป็นกลางและเหมาะกับนักเรียนมัธยมปลาย
`;


        /* =====================================
           เรียก Gemini
        ===================================== */

        const response =
            await ai.models.generateContent({

                model: "gemini-3.5-flash-lite",

                contents: prompt,

                config: {

                    responseMimeType:
                        "application/json",

                    responseSchema: {

                        type: "object",

                        properties: {

                            summary: {
                                type: "string"
                            },

                            interests: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },

                            strengths: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },

                            areas: {
                                type: "array",
                                items: {
                                    type: "string",
                                    enum: [
                                        "science",
                                        "technology",
                                        "business",
                                        "social",
                                        "creative"
                                    ]
                                }
                            },

                            reason: {
                                type: "string"
                            }

                        },

                        required: [
                            "summary",
                            "interests",
                            "strengths",
                            "areas",
                            "reason"
                        ]

                    }

                }

            });


        /* =====================================
           อ่านผลจาก Gemini
        ===================================== */

        const result =
            JSON.parse(response.text);


        /* =====================================
           ส่งผลกลับไป Frontend
        ===================================== */

        res.json({

            success: true,

            result: result,

            quizScores: scores

        });


    } catch (error) {

        console.error(
            "Gemini Free Thinking Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "ไม่สามารถวิเคราะห์ Free Thinking ได้ในขณะนี้"

        });

    }

});

// ========================================
// ERROR HANDLER
// ========================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "ไม่พบ API หรือหน้าที่ร้องขอ"

        });

    }
);


// ========================================
// START SERVER
// ========================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "========================================"
        );

        console.log(
            "SENTANG CHECKPOINT SERVER"
        );

        console.log(
            `Server running at http://localhost:${PORT}`
        );

        console.log(
            "========================================"
        );

    }
);