// tests/auth.test.js - Authentication route tests
const request = require("supertest");
const app = require("../app");

// Generate unique email for each test run to avoid conflicts
const testEmail = `testuser_${Date.now()}@example.com`;
const testPassword = "Test@12345";
let authToken;

describe("Authentication Routes", () => {
    // ── Registration ──────────────────────────────────
    describe("POST /api/auth/register", () => {
        it("should register a new learner successfully", async () => {
            const res = await request(app).post("/api/auth/register").send({
                name: "Test User",
                email: testEmail,
                password: testPassword,
                role: "learner",
            });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("user");
            expect(res.body.user.email).toBe(testEmail);
            expect(res.body.user.role).toBe("learner");
            // Password should never be returned
            expect(res.body.user).not.toHaveProperty("password");
        });

        it("should reject duplicate email registration", async () => {
            const res = await request(app).post("/api/auth/register").send({
                name: "Duplicate User",
                email: testEmail,
                password: testPassword,
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/already exists/i);
        });

        it("should reject registration with missing fields", async () => {
            const res = await request(app).post("/api/auth/register").send({
                email: "incomplete@example.com",
            });

            expect(res.statusCode).toBe(400);
        });

        it("should reject registration with short password", async () => {
            const res = await request(app).post("/api/auth/register").send({
                name: "Short Pass",
                email: `short_${Date.now()}@example.com`,
                password: "123",
            });

            expect(res.statusCode).toBe(400);
        });
    });

    // ── Login ─────────────────────────────────────────
    describe("POST /api/auth/login", () => {
        it("should login with valid credentials and return a JWT", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: testEmail,
                password: testPassword,
            });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("token");
            expect(res.body).toHaveProperty("user");
            expect(res.body.user.role).toBe("learner");

            // Save token for subsequent tests
            authToken = res.body.token;
        });

        it("should reject login with wrong password", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: testEmail,
                password: "WrongPassword",
            });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toMatch(/invalid credentials/i);
        });

        it("should reject login with non-existent email", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "nobody@example.com",
                password: "anything",
            });

            expect(res.statusCode).toBe(401);
        });
    });

    // ── Protected Route: Profile ──────────────────────
    describe("GET /api/auth/me", () => {
        it("should return user profile with valid token", async () => {
            const res = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("email", testEmail);
            expect(res.body).not.toHaveProperty("password");
        });

        it("should reject access without token", async () => {
            const res = await request(app).get("/api/auth/me");

            expect(res.statusCode).toBe(401);
        });

        it("should reject access with invalid token", async () => {
            const res = await request(app)
                .get("/api/auth/me")
                .set("Authorization", "Bearer invalid.token.here");

            expect(res.statusCode).toBe(401);
        });
    });

    // ── Change Password ───────────────────────────────
    describe("PUT /api/auth/change-password", () => {
        it("should change password with correct current password", async () => {
            const res = await request(app)
                .put("/api/auth/change-password")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    currentPassword: testPassword,
                    newPassword: "NewPass@123",
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/changed successfully/i);
        });

        it("should reject change with wrong current password", async () => {
            const res = await request(app)
                .put("/api/auth/change-password")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    currentPassword: "WrongOldPass",
                    newPassword: "NewPass@456",
                });

            expect(res.statusCode).toBe(401);
        });
    });
});
