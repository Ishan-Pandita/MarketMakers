// tests/courses.test.js - Course and Module route tests
const request = require("supertest");
const app = require("../app");

let contributorToken;
let learnerToken;
let createdCourseId;
let createdModuleId;

// Login as contributor and learner before running tests
beforeAll(async () => {
    // Login as a known contributor (seeded data)
    const contributorRes = await request(app).post("/api/auth/login").send({
        email: "contributor@example.com",
        password: "password123",
    });
    contributorToken = contributorRes.body.token;

    // Login as a known learner (seeded data)
    const learnerRes = await request(app).post("/api/auth/login").send({
        email: "learner@example.com",
        password: "password123",
    });
    learnerToken = learnerRes.body.token;
});

describe("Course Routes", () => {
    // ── Get All Courses ───────────────────────────────
    describe("GET /api/courses", () => {
        it("should return a list of active courses", async () => {
            const res = await request(app).get("/api/courses");

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // ── Create Course (Contributor) ───────────────────
    describe("POST /api/courses", () => {
        it("should allow a contributor to create a course", async () => {
            const res = await request(app)
                .post("/api/courses")
                .set("Authorization", `Bearer ${contributorToken}`)
                .send({
                    title: `Test Course ${Date.now()}`,
                    description: "A test course for automated testing",
                    order: 99,
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("title");
            createdCourseId = res.body._id;
        });

        it("should reject course creation without auth", async () => {
            const res = await request(app).post("/api/courses").send({
                title: "Unauthorized Course",
                description: "Should fail",
            });

            expect(res.statusCode).toBe(401);
        });
    });

    // ── Get Single Course ─────────────────────────────
    describe("GET /api/courses/:id", () => {
        it("should return course details by ID", async () => {
            const res = await request(app).get(`/api/courses/${createdCourseId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body._id).toBe(createdCourseId);
        });

        it("should return 404 for invalid course ID", async () => {
            const res = await request(app).get("/api/courses/000000000000000000000000");

            expect(res.statusCode).toBe(404);
        });
    });
});

describe("Module Routes", () => {
    // ── Create Module (within a Course) ───────────────
    describe("POST /api/modules", () => {
        it("should allow a contributor to create a module in a course", async () => {
            const res = await request(app)
                .post("/api/modules")
                .set("Authorization", `Bearer ${contributorToken}`)
                .send({
                    title: `Test Module ${Date.now()}`,
                    description: "A test module created by automated tests",
                    courseId: createdCourseId,
                    order: 99,
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.courseId).toBe(createdCourseId);
            createdModuleId = res.body._id;
        });
    });

    // ── Get Modules by Course ─────────────────────────
    describe("GET /api/modules?courseId=:id", () => {
        it("should return modules filtered by courseId", async () => {
            const res = await request(app).get(
                `/api/modules?courseId=${createdCourseId}`
            );

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("modules");
            expect(res.body).toHaveProperty("pagination");
            expect(Array.isArray(res.body.modules)).toBe(true);
            // Should contain the module we just created
            const found = res.body.modules.find((m) => m._id === createdModuleId);
            expect(found).toBeTruthy();
        });
    });
});
