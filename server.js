// ========================================
// SENTANG CHECKPOINT
// SERVER
// ========================================

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

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
                    req.user.displayName

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


// POST /api/forum
app.post(
    "/api/forum",
    (req, res) => {

        const {
            title,
            content,
            author
        } = req.body;


        if (
            !title ||
            !content ||
            !author
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "กรุณากรอกข้อมูลกระทู้ให้ครบ"

            });

        }


        const user =
            getUserFromRequest(req);


        const newPost = {

            id:
                nextForumId++,

            title:
                String(title).trim(),

            content:
                String(content).trim(),

            author:
                String(author).trim(),

            userId:
                user ? user.id : null,

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
            content,
            author
        } = req.body;


        if (
            !content ||
            !author
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "กรุณากรอกความคิดเห็นให้ครบ"

            });

        }


        const user =
            getUserFromRequest(req);


        const newReply = {

            id:
                nextReplyId++,

            content:
                String(content).trim(),

            author:
                String(author).trim(),

            userId:
                user ? user.id : null,

            createdAt:
                new Date().toISOString()

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

                    "POST /api/forum/:id/replies"

                ]

            }

        });

    }
);


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