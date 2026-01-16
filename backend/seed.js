require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import models
const User = require("./models/User");
const Module = require("./models/Module");
const Lesson = require("./models/Lesson");
const Exam = require("./models/Exam");

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

// Seed data
const seedDatabase = async () => {
    try {
        console.log("🌱 Starting database seeding...\n");

        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await User.deleteMany({});
        await Module.deleteMany({});
        await Lesson.deleteMany({});
        await Exam.deleteMany({});
        console.log("✅ Existing data cleared\n");

        // Create users
        console.log("👥 Creating users...");
        const hashedPassword = await bcrypt.hash("password123", 10);

        const users = await User.create([
            {
                name: "John Learner",
                email: "learner@example.com",
                password: hashedPassword,
                role: "learner",
            },
            {
                name: "Sarah Contributor",
                email: "contributor@example.com",
                password: hashedPassword,
                role: "contributor",
            },
            {
                name: "Admin User",
                email: "admin@example.com",
                password: hashedPassword,
                role: "admin",
            },
        ]);
        console.log(`✅ Created ${users.length} users\n`);

        // Create modules
        console.log("📚 Creating modules...");
        const modules = await Module.create([
            {
                title: "Introduction to Stock Market",
                description:
                    "Learn the fundamentals of stock markets, how they work, and why they exist. Perfect for absolute beginners.",
                order: 1,
            },
            {
                title: "Understanding Market Basics",
                description:
                    "Dive into essential market concepts including supply and demand, market participants, and trading mechanisms.",
                order: 2,
            },
            {
                title: "Technical Analysis Fundamentals",
                description:
                    "Master the art of reading charts, identifying patterns, and using technical indicators to make informed trading decisions.",
                order: 3,
            },
            {
                title: "Fundamental Analysis",
                description:
                    "Learn how to evaluate companies using financial statements, ratios, and economic indicators.",
                order: 4,
            },
            {
                title: "Risk Management & Psychology",
                description:
                    "Understand position sizing, stop losses, and the psychological aspects of trading that separate winners from losers.",
                order: 5,
            },
            {
                title: "Trading Strategies",
                description:
                    "Explore various trading strategies from day trading to swing trading and long-term investing.",
                order: 6,
            },
        ]);
        console.log(`✅ Created ${modules.length} modules\n`);

        // Create lessons for each module
        console.log("📖 Creating lessons...");

        // Module 1: Introduction to Stock Market
        const module1Lessons = await Lesson.create([
            {
                moduleId: modules[0]._id,
                title: "What is the Stock Market?",
                explanation:
                    "The stock market is a platform where shares of publicly traded companies are bought and sold. It serves as a marketplace connecting investors with companies seeking capital. Understanding the stock market is crucial for anyone looking to build wealth through investing. In this lesson, we'll explore how stock markets originated, their purpose in the economy, and how they facilitate capital formation.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=p7HKvqRI_Bo",
                    "https://www.youtube.com/watch?v=F3QpgXBtDeo",
                ],
                order: 1,
            },
            {
                moduleId: modules[0]._id,
                title: "How Stock Exchanges Work",
                explanation:
                    "Stock exchanges like NYSE, NASDAQ, and BSE are organized marketplaces where securities are traded. They provide transparency, liquidity, and fair pricing through regulated trading mechanisms. Learn about market makers, order types, and how trades are executed in milliseconds through electronic trading systems.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=F3QpgXBtDeo",
                    "https://www.youtube.com/watch?v=hGXyXbvG31Y",
                ],
                order: 2,
            },
            {
                moduleId: modules[0]._id,
                title: "Types of Securities",
                explanation:
                    "Beyond common stocks, markets offer various securities including preferred stocks, bonds, ETFs, mutual funds, and derivatives. Each security type has unique characteristics, risk profiles, and purposes in a portfolio. This lesson covers the differences between equity and debt instruments, and when to use each.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=hGXyXbvG31Y",
                    "https://www.youtube.com/watch?v=Ov_7eYNOU7M",
                ],
                order: 3,
            },
            {
                moduleId: modules[0]._id,
                title: "Market Participants",
                explanation:
                    "The stock market ecosystem includes retail investors, institutional investors, market makers, brokers, and regulators. Understanding who participates and their motivations helps you navigate the market effectively. We'll explore how different participants influence price movements and market dynamics.",
                videoLinks: ["https://www.youtube.com/watch?v=Ov_7eYNOU7M"],
                order: 4,
            },
        ]);

        // Module 2: Understanding Market Basics
        const module2Lessons = await Lesson.create([
            {
                moduleId: modules[1]._id,
                title: "Supply and Demand in Markets",
                explanation:
                    "Price discovery in markets is driven by supply and demand dynamics. When more people want to buy a stock (demand) than sell it (supply), prices rise. Understanding these forces is fundamental to predicting price movements and identifying trading opportunities.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=kIFBaaPJUO0",
                    "https://www.youtube.com/watch?v=3MYHtRnq3hE",
                ],
                order: 1,
            },
            {
                moduleId: modules[1]._id,
                title: "Market Orders vs Limit Orders",
                explanation:
                    "Different order types serve different purposes. Market orders execute immediately at current prices, while limit orders let you specify your desired price. Understanding when to use each type can save you money and improve execution quality. We'll also cover stop orders, stop-limit orders, and advanced order types.",
                videoLinks: ["https://www.youtube.com/watch?v=3MYHtRnq3hE"],
                order: 2,
            },
            {
                moduleId: modules[1]._id,
                title: "Bid-Ask Spread Explained",
                explanation:
                    "The bid-ask spread represents the difference between the highest price a buyer is willing to pay and the lowest price a seller will accept. Narrow spreads indicate liquid markets, while wide spreads suggest lower liquidity. Learn how to minimize spread costs and understand market depth.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=kIFBaaPJUO0",
                    "https://www.youtube.com/watch?v=hGXyXbvG31Y",
                ],
                order: 3,
            },
            {
                moduleId: modules[1]._id,
                title: "Market Hours and Trading Sessions",
                explanation:
                    "Markets operate during specific hours with pre-market and after-hours sessions. Understanding trading sessions helps you time your trades and avoid low-liquidity periods. We'll cover global market hours, the importance of market open/close, and how news affects different sessions.",
                videoLinks: ["https://www.youtube.com/watch?v=p7HKvqRI_Bo"],
                order: 4,
            },
        ]);

        // Module 3: Technical Analysis Fundamentals
        const module3Lessons = await Lesson.create([
            {
                moduleId: modules[2]._id,
                title: "Introduction to Chart Reading",
                explanation:
                    "Charts are visual representations of price movements over time. Learn to read candlestick charts, bar charts, and line charts. Understanding chart patterns is the foundation of technical analysis and helps identify potential trading opportunities.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=08c8dKCxhBw",
                    "https://www.youtube.com/watch?v=GBtDRfg8y9Y",
                ],
                order: 1,
            },
            {
                moduleId: modules[2]._id,
                title: "Support and Resistance Levels",
                explanation:
                    "Support and resistance are price levels where stocks tend to find buying or selling pressure. These levels act as psychological barriers and are crucial for identifying entry and exit points. Master the art of drawing support/resistance lines and understanding their significance.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=GBtDRfg8y9Y",
                    "https://www.youtube.com/watch?v=PQMF_vPV_1o",
                ],
                order: 2,
            },
            {
                moduleId: modules[2]._id,
                title: "Trend Analysis and Trendlines",
                explanation:
                    "The trend is your friend! Learn to identify uptrends, downtrends, and sideways markets. Drawing accurate trendlines helps you stay on the right side of the market and avoid fighting the prevailing direction. We'll cover trend strength, trend reversals, and how to trade with the trend.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=PQMF_vPV_1o",
                    "https://www.youtube.com/watch?v=08c8dKCxhBw",
                ],
                order: 3,
            },
            {
                moduleId: modules[2]._id,
                title: "Moving Averages",
                explanation:
                    "Moving averages smooth out price data and help identify trends. Learn about Simple Moving Averages (SMA), Exponential Moving Averages (EMA), and how to use them for trend identification and crossover strategies. Discover the popular 50-day and 200-day moving averages.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=GBtDRfg8y9Y",
                    "https://www.youtube.com/watch?v=PQMF_vPV_1o",
                ],
                order: 4,
            },
            {
                moduleId: modules[2]._id,
                title: "RSI and Momentum Indicators",
                explanation:
                    "The Relative Strength Index (RSI) measures momentum and identifies overbought/oversold conditions. Learn how to use RSI divergences, the 30/70 levels, and combine RSI with other indicators for powerful trading signals. We'll also cover MACD and Stochastic oscillators.",
                videoLinks: ["https://www.youtube.com/watch?v=08c8dKCxhBw"],
                order: 5,
            },
        ]);

        // Module 4: Fundamental Analysis
        const module4Lessons = await Lesson.create([
            {
                moduleId: modules[3]._id,
                title: "Reading Financial Statements",
                explanation:
                    "Financial statements tell the story of a company's health. Learn to analyze income statements, balance sheets, and cash flow statements. Understanding these documents helps you evaluate a company's profitability, debt levels, and cash generation capabilities.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=WEDIj9JBTC8",
                    "https://www.youtube.com/watch?v=3RtwUvCK5BQ",
                ],
                order: 1,
            },
            {
                moduleId: modules[3]._id,
                title: "Key Financial Ratios",
                explanation:
                    "Ratios provide insights into company performance and valuation. Master P/E ratio, P/B ratio, ROE, debt-to-equity, and current ratio. Learn what these numbers mean and how to compare companies within the same industry.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=3RtwUvCK5BQ",
                    "https://www.youtube.com/watch?v=WEDIj9JBTC8",
                ],
                order: 2,
            },
            {
                moduleId: modules[3]._id,
                title: "Earnings Reports and Guidance",
                explanation:
                    "Quarterly earnings reports move markets significantly. Learn how to interpret earnings per share (EPS), revenue growth, and forward guidance. Understand earnings surprises and how to trade around earnings announcements.",
                videoLinks: ["https://www.youtube.com/watch?v=3RtwUvCK5BQ"],
                order: 3,
            },
            {
                moduleId: modules[3]._id,
                title: "Economic Indicators",
                explanation:
                    "Macroeconomic indicators like GDP, unemployment, inflation, and interest rates affect market sentiment. Learn how to interpret economic data and anticipate market reactions to economic releases. Understand the relationship between the economy and stock prices.",
                videoLinks: ["https://www.youtube.com/watch?v=WEDIj9JBTC8"],
                order: 4,
            },
        ]);

        // Module 5: Risk Management & Psychology
        const module5Lessons = await Lesson.create([
            {
                moduleId: modules[4]._id,
                title: "Position Sizing Strategies",
                explanation:
                    "Never risk more than you can afford to lose. Learn the 1-2% rule, how to calculate position sizes based on your account size and risk tolerance. Proper position sizing is the difference between surviving and thriving in the markets.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=7pwKL_km9hg",
                    "https://www.youtube.com/watch?v=qhHOmZVAqBE",
                ],
                order: 1,
            },
            {
                moduleId: modules[4]._id,
                title: "Stop Loss and Take Profit",
                explanation:
                    "Stop losses protect your capital, while take profits lock in gains. Learn where to place stops based on technical levels, ATR, and percentage rules. Discover trailing stops and how to let winners run while cutting losers short.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=qhHOmZVAqBE",
                    "https://www.youtube.com/watch?v=7pwKL_km9hg",
                ],
                order: 2,
            },
            {
                moduleId: modules[4]._id,
                title: "Risk-Reward Ratio",
                explanation:
                    "Successful traders aim for favorable risk-reward ratios. Learn why a 1:2 or 1:3 ratio is essential for long-term profitability. Understand how to calculate risk-reward before entering trades and why it matters more than win rate.",
                videoLinks: ["https://www.youtube.com/watch?v=7pwKL_km9hg"],
                order: 3,
            },
            {
                moduleId: modules[4]._id,
                title: "Trading Psychology",
                explanation:
                    "Emotions are the enemy of profitable trading. Learn to control fear and greed, avoid revenge trading, and stick to your plan. Discover techniques for maintaining discipline and the importance of a trading journal.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=qhHOmZVAqBE",
                    "https://www.youtube.com/watch?v=7pwKL_km9hg",
                ],
                order: 4,
            },
        ]);

        // Module 6: Trading Strategies
        const module6Lessons = await Lesson.create([
            {
                moduleId: modules[5]._id,
                title: "Day Trading Basics",
                explanation:
                    "Day trading involves opening and closing positions within the same day. Learn about scalping, momentum trading, and gap trading strategies. Understand the tools, time commitment, and capital requirements for successful day trading.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=8Uz1aPoJbuM",
                    "https://www.youtube.com/watch?v=LihCkxUDIwE",
                ],
                order: 1,
            },
            {
                moduleId: modules[5]._id,
                title: "Swing Trading Strategies",
                explanation:
                    "Swing trading captures price swings over days to weeks. Learn to identify swing setups using technical analysis, how to manage positions overnight, and strategies for catching trends while avoiding whipsaws.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=LihCkxUDIwE",
                    "https://www.youtube.com/watch?v=8Uz1aPoJbuM",
                ],
                order: 2,
            },
            {
                moduleId: modules[5]._id,
                title: "Long-Term Investing",
                explanation:
                    "Buy and hold investing focuses on quality companies for years or decades. Learn value investing principles, growth investing strategies, and how to build a diversified portfolio for long-term wealth creation.",
                videoLinks: ["https://www.youtube.com/watch?v=8Uz1aPoJbuM"],
                order: 3,
            },
            {
                moduleId: modules[5]._id,
                title: "Options Trading Introduction",
                explanation:
                    "Options provide leverage and flexibility. Learn the basics of calls and puts, option Greeks, and simple strategies like covered calls and protective puts. Understand when options are appropriate and their risk characteristics.",
                videoLinks: [
                    "https://www.youtube.com/watch?v=LihCkxUDIwE",
                    "https://www.youtube.com/watch?v=8Uz1aPoJbuM",
                ],
                order: 4,
            },
        ]);

        const totalLessons =
            module1Lessons.length +
            module2Lessons.length +
            module3Lessons.length +
            module4Lessons.length +
            module5Lessons.length +
            module6Lessons.length;

        console.log(`✅ Created ${totalLessons} lessons\n`);

        // Create Contributor Exam
        console.log("📝 Creating contributor exam...");
        const exam = await Exam.create({
            title: "Trading Fundamentals Contributor Exam",
            description:
                "Test your knowledge of stock market fundamentals, technical analysis, and risk management. Score 80% or higher to become a contributor and create educational content.",
            passingScore: 80,
            duration: 45,
            isActive: true,
            questions: [
                {
                    question:
                        "What is the primary purpose of the stock market in the economy?",
                    options: [
                        "To gamble on company performance",
                        "To facilitate capital formation and provide liquidity",
                        "To create jobs for brokers",
                        "To replace traditional banking",
                    ],
                    correctAnswer: 1,
                },
                {
                    question: "What does a wide bid-ask spread typically indicate?",
                    options: [
                        "High liquidity and active trading",
                        "Low liquidity and higher transaction costs",
                        "The stock is about to rise",
                        "The stock is overvalued",
                    ],
                    correctAnswer: 1,
                },
                {
                    question:
                        "In technical analysis, what does a support level represent?",
                    options: [
                        "The highest price a stock can reach",
                        "A price level where buying pressure tends to overcome selling pressure",
                        "The average price over 50 days",
                        "The company's book value",
                    ],
                    correctAnswer: 1,
                },
                {
                    question: "What does the P/E ratio measure?",
                    options: [
                        "Profit margin percentage",
                        "Price relative to earnings per share",
                        "Percentage of equity owned",
                        "Price elasticity of demand",
                    ],
                    correctAnswer: 1,
                },
                {
                    question:
                        "According to the 1-2% rule in risk management, what should you risk per trade?",
                    options: [
                        "1-2% of your total portfolio value",
                        "1-2% of your annual income",
                        "1-2% of the stock's price",
                        "1-2% more than your previous trade",
                    ],
                    correctAnswer: 0,
                },
                {
                    question: "What is a stop loss order designed to do?",
                    options: [
                        "Guarantee profits on winning trades",
                        "Limit potential losses by automatically selling at a predetermined price",
                        "Stop you from making emotional decisions",
                        "Prevent market manipulation",
                    ],
                    correctAnswer: 1,
                },
                {
                    question:
                        "If a stock is trading above its 200-day moving average, what does this generally indicate?",
                    options: [
                        "The stock is in a long-term downtrend",
                        "The stock is in a long-term uptrend",
                        "The stock will definitely rise tomorrow",
                        "The stock is overpriced",
                    ],
                    correctAnswer: 1,
                },
                {
                    question: "What does RSI (Relative Strength Index) measure?",
                    options: [
                        "The strength of a company's management",
                        "Momentum and overbought/oversold conditions",
                        "The ratio of support to resistance",
                        "Revenue growth rate",
                    ],
                    correctAnswer: 1,
                },
                {
                    question:
                        "What is the main difference between fundamental and technical analysis?",
                    options: [
                        "Fundamental focuses on price charts, technical on financial statements",
                        "Fundamental analyzes company financials, technical analyzes price patterns",
                        "There is no difference",
                        "Fundamental is for stocks, technical is for options",
                    ],
                    correctAnswer: 1,
                },
                {
                    question:
                        "What is a favorable risk-reward ratio for most trading strategies?",
                    options: [
                        "1:1 (risk $1 to make $1)",
                        "3:1 (risk $3 to make $1)",
                        "1:2 or better (risk $1 to make $2 or more)",
                        "It doesn't matter",
                    ],
                    correctAnswer: 2,
                },
                {
                    question: "What does 'diversification' mean in portfolio management?",
                    options: [
                        "Buying only one stock to focus your research",
                        "Spreading investments across different assets to reduce risk",
                        "Trading multiple times per day",
                        "Investing in diverse industries within one company",
                    ],
                    correctAnswer: 1,
                },
                {
                    question: "When should you typically use a market order?",
                    options: [
                        "When you want to guarantee a specific price",
                        "When you want immediate execution at current market price",
                        "Only during after-hours trading",
                        "Never, always use limit orders",
                    ],
                    correctAnswer: 1,
                },
                {
                    question:
                        "What is the primary psychological challenge in trading?",
                    options: [
                        "Learning complex mathematics",
                        "Controlling emotions like fear and greed",
                        "Remembering stock symbols",
                        "Understanding computer algorithms",
                    ],
                    correctAnswer: 1,
                },
                {
                    question: "What does 'liquidity' refer to in stock markets?",
                    options: [
                        "The amount of water in a company's products",
                        "How easily an asset can be bought or sold without affecting its price",
                        "The company's cash reserves",
                        "The number of employees",
                    ],
                    correctAnswer: 1,
                },
                {
                    question:
                        "What is the main advantage of using a trailing stop loss?",
                    options: [
                        "It guarantees profits",
                        "It locks in gains as the price moves in your favor while protecting against reversals",
                        "It eliminates all risk",
                        "It increases position size automatically",
                    ],
                    correctAnswer: 1,
                },
            ],
        });
        console.log(`✅ Created contributor exam with ${exam.questions.length} questions\n`);

        // Summary
        console.log("=".repeat(50));
        console.log("🎉 DATABASE SEEDING COMPLETED!\n");
        console.log("📊 Summary:");
        console.log(`   👥 Users: ${users.length}`);
        console.log(`   📚 Modules: ${modules.length}`);
        console.log(`   📖 Lessons: ${totalLessons}`);
        console.log(`   📝 Exams: 1`);
        console.log("\n🔐 Login Credentials:");
        console.log("   Learner:");
        console.log("     Email: learner@example.com");
        console.log("     Password: password123\n");
        console.log("   Contributor:");
        console.log("     Email: contributor@example.com");
        console.log("     Password: password123\n");
        console.log("   Admin:");
        console.log("     Email: admin@example.com");
        console.log("     Password: password123\n");
        console.log("=".repeat(50));

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

// Run seeder
const run = async () => {
    await connectDB();
    await seedDatabase();
};

run();
