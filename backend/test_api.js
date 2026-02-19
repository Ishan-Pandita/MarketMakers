const http = require("http");

const req = http.get("http://127.0.0.1:5000/api/courses", (res) => {
    let data = "";
    res.on("data", (chunk) => {
        data += chunk;
    });
    res.on("end", () => {
        console.log("Status Code:", res.statusCode);
        try {
            const parsed = JSON.parse(data);
            console.log("Courses count:", parsed.length);
            console.log("First course title:", parsed[0]?.title);
            process.exit(0);
        } catch (e) {
            console.error("Failed to parse JSON:", e.message);
            process.exit(1);
        }
    });
});

req.on("error", (err) => {
    console.error("Error:", err.message);
    process.exit(1);
});
