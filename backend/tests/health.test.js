// tests/health.test.js - Health check and general API tests
const request = require("supertest");
const app = require("../app");

describe("General API", () => {
    // ── Health Check ──────────────────────────────────
    describe("GET /api/health", () => {
        it("should return health status OK", async () => {
            const res = await request(app).get("/api/health");

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("ok");
            expect(res.body).toHaveProperty("timestamp");
        });
    });

    // ── Root Endpoint ─────────────────────────────────
    describe("GET /", () => {
        it("should return API welcome message", async () => {
            const res = await request(app).get("/");

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("message");
        });
    });

    // ── 404 Not Found ─────────────────────────────────
    describe("GET /api/nonexistent", () => {
        it("should return 404 for undefined routes", async () => {
            const res = await request(app).get("/api/nonexistent-route");

            expect(res.statusCode).toBe(404);
        });
    });

    // ── Search ────────────────────────────────────────
    describe("GET /api/search", () => {
        it("should reject search without a query parameter", async () => {
            const res = await request(app).get("/api/search");

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/query is required/i);
        });

        it("should reject search with an empty query", async () => {
            const res = await request(app).get("/api/search?q=");

            expect(res.statusCode).toBe(400);
        });
    });
});
