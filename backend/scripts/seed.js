require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import models
const User = require("../models/User");
const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const Exam = require("../models/Exam");
const ExamAttempt = require("../models/ExamAttempt");
const Progress = require("../models/Progress");
const Suggestion = require("../models/Suggestion");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        console.log("🌱 Starting database seeding...\n");

        // Clear ALL existing data
        console.log("🗑️  Clearing existing data...");
        await Promise.all([
            User.deleteMany({}),
            Course.deleteMany({}),
            Module.deleteMany({}),
            Lesson.deleteMany({}),
            Exam.deleteMany({}),
            ExamAttempt.deleteMany({}),
            Progress.deleteMany({}),
            Suggestion.deleteMany({}),
        ]);
        console.log("✅ All existing data cleared\n");

        // ─── USERS ───
        console.log("👥 Creating users...");
        const hashedPassword = await bcrypt.hash("password123", 10);

        const users = await User.create([
            {
                name: "Ishan Pandita",
                email: "admin@marketmakers.com",
                password: hashedPassword,
                role: "admin",
            },
            {
                name: "Priya Sharma",
                email: "priya@marketmakers.com",
                password: hashedPassword,
                role: "contributor",
                contributorDetails: {
                    experience: "8+ years in Equity & Derivatives Trading",
                    reason: "Passionate about teaching technical analysis and helping new traders avoid common mistakes.",
                },
            },
            {
                name: "Rajesh Kapoor",
                email: "rajesh@marketmakers.com",
                password: hashedPassword,
                role: "contributor",
                contributorDetails: {
                    experience: "6+ years in Forex & Commodity Markets",
                    reason: "Want to share practical forex strategies that work in real market conditions.",
                },
            },
            {
                name: "Arjun Mehta",
                email: "arjun@marketmakers.com",
                password: hashedPassword,
                role: "learner",
            },
            {
                name: "Sneha Patel",
                email: "sneha@marketmakers.com",
                password: hashedPassword,
                role: "learner",
            },
        ]);
        console.log(`✅ Created ${users.length} users\n`);

        const admin = users[0];
        const priya = users[1];
        const rajesh = users[2];

        // ─── COURSE 1: STOCK MARKET MASTERY ───
        console.log("🎓 Creating courses...");
        const course1 = await Course.create({
            title: "Stock Market Mastery",
            description: "A comprehensive course covering everything from stock market basics to advanced trading strategies. Perfect for beginners who want to build a solid foundation in equity markets.",
            instructor: priya._id,
            order: 1,
        });

        const course2 = await Course.create({
            title: "Forex Trading Essentials",
            description: "Master the world's largest financial market. Learn currency pairs, pip calculations, leverage management, and proven forex trading strategies used by professionals.",
            instructor: rajesh._id,
            order: 2,
        });

        const course3 = await Course.create({
            title: "Cryptocurrency & Digital Assets",
            description: "Navigate the exciting world of cryptocurrency trading. Understand blockchain technology, evaluate crypto projects, and develop strategies for this volatile market.",
            instructor: priya._id,
            order: 3,
        });
        console.log("✅ Created 3 courses\n");

        // ─── MODULES FOR COURSE 1 ───
        console.log("📚 Creating modules...");
        const c1Modules = await Module.create([
            { courseId: course1._id, title: "Introduction to Stock Markets", description: "Learn the fundamentals of stock markets — how they work, why they exist, and their role in the global economy.", order: 1, contributor: priya._id },
            { courseId: course1._id, title: "Understanding Market Mechanics", description: "Dive into order types, bid-ask spreads, market participants, and how trades are executed on exchanges.", order: 2, contributor: priya._id },
            { courseId: course1._id, title: "Technical Analysis Fundamentals", description: "Master chart reading, candlestick patterns, support/resistance levels, and key technical indicators.", order: 3, contributor: priya._id },
            { courseId: course1._id, title: "Fundamental Analysis", description: "Learn to evaluate companies using financial statements, key ratios, and economic indicators.", order: 4, contributor: priya._id },
            { courseId: course1._id, title: "Risk Management & Trading Psychology", description: "Understand position sizing, stop losses, risk-reward ratios, and the psychological discipline needed for consistent trading.", order: 5, contributor: priya._id },
            { courseId: course1._id, title: "Trading Strategies & Execution", description: "Explore day trading, swing trading, and long-term investing strategies with practical examples.", order: 6, contributor: priya._id },
        ]);

        const c2Modules = await Module.create([
            { courseId: course2._id, title: "Forex Market Overview", description: "Understand the structure of the forex market, major currency pairs, and what drives currency movements.", order: 1, contributor: rajesh._id },
            { courseId: course2._id, title: "Currency Pairs & Pip Calculations", description: "Learn to read currency quotes, calculate pip values, and understand lot sizes for proper trade sizing.", order: 2, contributor: rajesh._id },
            { courseId: course2._id, title: "Forex Technical Analysis", description: "Apply technical analysis specifically to forex charts — identify trends, patterns, and key levels in currency markets.", order: 3, contributor: rajesh._id },
            { courseId: course2._id, title: "Forex Trading Strategies", description: "Discover proven forex strategies including scalping, carry trades, and news-based trading approaches.", order: 4, contributor: rajesh._id },
            { courseId: course2._id, title: "Leverage & Money Management", description: "Master the proper use of leverage, margin requirements, and capital preservation in forex trading.", order: 5, contributor: rajesh._id },
            { courseId: course2._id, title: "Global Economics for Forex Traders", description: "Understand how central bank policies, GDP reports, and geopolitical events impact currency valuations.", order: 6, contributor: rajesh._id },
        ]);

        const c3Modules = await Module.create([
            { courseId: course3._id, title: "Blockchain & Crypto Basics", description: "Understand blockchain technology, how cryptocurrencies work, and the difference between coins and tokens.", order: 1, contributor: priya._id },
            { courseId: course3._id, title: "Bitcoin & Major Altcoins", description: "Deep dive into Bitcoin, Ethereum, and other major cryptocurrencies — their use cases, technology, and market dynamics.", order: 2, contributor: priya._id },
            { courseId: course3._id, title: "Crypto Trading Strategies", description: "Learn crypto-specific trading strategies including HODLing, DCA, swing trading, and how to navigate extreme volatility.", order: 3, contributor: priya._id },
            { courseId: course3._id, title: "DeFi & NFTs Explained", description: "Explore decentralized finance protocols, yield farming, liquidity pools, and the NFT ecosystem.", order: 4, contributor: priya._id },
            { courseId: course3._id, title: "Crypto Security & Wallets", description: "Learn to secure your crypto assets — hardware wallets, seed phrases, exchange security, and common scams to avoid.", order: 5, contributor: priya._id },
            { courseId: course3._id, title: "Crypto Regulation & Tax Planning", description: "Navigate the evolving regulatory landscape and understand tax implications of crypto trading in India.", order: 6, contributor: priya._id },
        ]);

        const allModules = [...c1Modules, ...c2Modules, ...c3Modules];
        console.log(`✅ Created ${allModules.length} modules\n`);

        // ─── LESSONS ───
        console.log("📖 Creating lessons...");

        // Helper to create lessons for a module
        const createLessons = (moduleId, lessonsData) =>
            Lesson.create(lessonsData.map((l, i) => ({ moduleId, ...l, order: i + 1 })));

        // — Course 1 Lessons —
        const c1m1 = await createLessons(c1Modules[0]._id, [
            { title: "What is the Stock Market?", explanation: "The stock market is a platform where shares of publicly traded companies are bought and sold. It serves as a marketplace connecting investors with companies seeking capital. Understanding the stock market is crucial for anyone looking to build wealth through investing. In this lesson, we explore how stock markets originated, their purpose in the economy, and how they facilitate capital formation.", videoLinks: ["https://www.youtube.com/watch?v=p7HKvqRI_Bo"] },
            { title: "How Stock Exchanges Work", explanation: "Stock exchanges like NYSE, NASDAQ, and BSE are organized marketplaces where securities are traded. They provide transparency, liquidity, and fair pricing through regulated trading mechanisms. Learn about market makers, order types, and how trades are executed in milliseconds through electronic trading systems.", videoLinks: ["https://www.youtube.com/watch?v=F3QpgXBtDeo"] },
            { title: "Types of Securities", explanation: "Beyond common stocks, markets offer various securities including preferred stocks, bonds, ETFs, mutual funds, and derivatives. Each security type has unique characteristics, risk profiles, and purposes in a portfolio. This lesson covers the differences between equity and debt instruments.", videoLinks: ["https://www.youtube.com/watch?v=hGXyXbvG31Y"] },
            { title: "Market Participants & Their Roles", explanation: "The stock market ecosystem includes retail investors, institutional investors, market makers, brokers, and regulators. Understanding who participates and their motivations helps you navigate the market effectively. We explore how different participants influence price movements and market dynamics.", videoLinks: ["https://www.youtube.com/watch?v=Ov_7eYNOU7M"] },
        ]);

        const c1m2 = await createLessons(c1Modules[1]._id, [
            { title: "Supply and Demand in Markets", explanation: "Price discovery in markets is driven by supply and demand dynamics. When more people want to buy a stock (demand) than sell it (supply), prices rise. Understanding these forces is fundamental to predicting price movements and identifying trading opportunities.", videoLinks: ["https://www.youtube.com/watch?v=kIFBaaPJUO0"] },
            { title: "Market Orders vs Limit Orders", explanation: "Different order types serve different purposes. Market orders execute immediately at current prices, while limit orders let you specify your desired price. Understanding when to use each type can save you money and improve execution quality.", videoLinks: ["https://www.youtube.com/watch?v=3MYHtRnq3hE"] },
            { title: "Bid-Ask Spread Explained", explanation: "The bid-ask spread represents the difference between the highest price a buyer is willing to pay and the lowest price a seller will accept. Narrow spreads indicate liquid markets, while wide spreads suggest lower liquidity. Learn how to minimize spread costs.", videoLinks: ["https://www.youtube.com/watch?v=kIFBaaPJUO0"] },
            { title: "Market Hours & Trading Sessions", explanation: "Markets operate during specific hours with pre-market and after-hours sessions. Understanding trading sessions helps you time your trades and avoid low-liquidity periods. We cover global market hours, the importance of market open/close, and how news affects different sessions.", videoLinks: ["https://www.youtube.com/watch?v=p7HKvqRI_Bo"] },
        ]);

        const c1m3 = await createLessons(c1Modules[2]._id, [
            { title: "Introduction to Chart Reading", explanation: "Charts are visual representations of price movements over time. Learn to read candlestick charts, bar charts, and line charts. Understanding chart patterns is the foundation of technical analysis and helps identify potential trading opportunities.", videoLinks: ["https://www.youtube.com/watch?v=08c8dKCxhBw"] },
            { title: "Support and Resistance Levels", explanation: "Support and resistance are price levels where stocks tend to find buying or selling pressure. These levels act as psychological barriers and are crucial for identifying entry and exit points. Master the art of drawing support/resistance lines.", videoLinks: ["https://www.youtube.com/watch?v=GBtDRfg8y9Y"] },
            { title: "Trend Analysis & Trendlines", explanation: "The trend is your friend! Learn to identify uptrends, downtrends, and sideways markets. Drawing accurate trendlines helps you stay on the right side of the market and avoid fighting the prevailing direction.", videoLinks: ["https://www.youtube.com/watch?v=PQMF_vPV_1o"] },
            { title: "Moving Averages & RSI", explanation: "Moving averages smooth out price data and help identify trends. The Relative Strength Index measures momentum and identifies overbought/oversold conditions. Learn to combine these tools for powerful trading signals.", videoLinks: ["https://www.youtube.com/watch?v=08c8dKCxhBw"] },
        ]);

        const c1m4 = await createLessons(c1Modules[3]._id, [
            { title: "Reading Financial Statements", explanation: "Financial statements tell the story of a company's health. Learn to analyze income statements, balance sheets, and cash flow statements. Understanding these documents helps you evaluate profitability, debt levels, and cash generation capabilities.", videoLinks: ["https://www.youtube.com/watch?v=WEDIj9JBTC8"] },
            { title: "Key Financial Ratios", explanation: "Ratios provide insights into company performance and valuation. Master P/E ratio, P/B ratio, ROE, debt-to-equity, and current ratio. Learn what these numbers mean and how to compare companies within the same industry.", videoLinks: ["https://www.youtube.com/watch?v=3RtwUvCK5BQ"] },
            { title: "Earnings Reports & Guidance", explanation: "Quarterly earnings reports move markets significantly. Learn how to interpret earnings per share (EPS), revenue growth, and forward guidance. Understand earnings surprises and how to position around earnings announcements.", videoLinks: ["https://www.youtube.com/watch?v=3RtwUvCK5BQ"] },
            { title: "Economic Indicators", explanation: "Macroeconomic indicators like GDP, unemployment, inflation, and interest rates affect market sentiment. Learn how to interpret economic data and anticipate market reactions. Understand the relationship between the economy and stock prices.", videoLinks: ["https://www.youtube.com/watch?v=WEDIj9JBTC8"] },
        ]);

        const c1m5 = await createLessons(c1Modules[4]._id, [
            { title: "Position Sizing Strategies", explanation: "Never risk more than you can afford to lose. Learn the 1-2% rule, how to calculate position sizes based on your account size and risk tolerance. Proper position sizing is the difference between surviving and thriving in the markets.", videoLinks: ["https://www.youtube.com/watch?v=7pwKL_km9hg"] },
            { title: "Stop Loss & Take Profit", explanation: "Stop losses protect your capital, while take profits lock in gains. Learn where to place stops based on technical levels, ATR, and percentage rules. Discover trailing stops and how to let winners run while cutting losers short.", videoLinks: ["https://www.youtube.com/watch?v=qhHOmZVAqBE"] },
            { title: "Risk-Reward Ratio", explanation: "Successful traders aim for favorable risk-reward ratios. Learn why a 1:2 or 1:3 ratio is essential for long-term profitability. Understand how to calculate risk-reward before entering trades and why it matters more than win rate.", videoLinks: ["https://www.youtube.com/watch?v=7pwKL_km9hg"] },
            { title: "Trading Psychology & Discipline", explanation: "Emotions are the enemy of profitable trading. Learn to control fear and greed, avoid revenge trading, and stick to your plan. Discover techniques for maintaining discipline and the importance of keeping a trading journal.", videoLinks: ["https://www.youtube.com/watch?v=qhHOmZVAqBE"] },
        ]);

        const c1m6 = await createLessons(c1Modules[5]._id, [
            { title: "Day Trading Basics", explanation: "Day trading involves opening and closing positions within the same day. Learn about scalping, momentum trading, and gap trading strategies. Understand the tools, time commitment, and capital requirements for successful day trading.", videoLinks: ["https://www.youtube.com/watch?v=8Uz1aPoJbuM"] },
            { title: "Swing Trading Strategies", explanation: "Swing trading captures price swings over days to weeks. Learn to identify swing setups using technical analysis, how to manage positions overnight, and strategies for catching trends while avoiding whipsaws.", videoLinks: ["https://www.youtube.com/watch?v=LihCkxUDIwE"] },
            { title: "Long-Term Value Investing", explanation: "Buy and hold investing focuses on quality companies for years or decades. Learn value investing principles made famous by Warren Buffett, growth investing strategies, and how to build a diversified portfolio for long-term wealth creation.", videoLinks: ["https://www.youtube.com/watch?v=8Uz1aPoJbuM"] },
            { title: "Options Trading Introduction", explanation: "Options provide leverage and flexibility. Learn the basics of calls and puts, option Greeks, and simple strategies like covered calls and protective puts. Understand when options are appropriate and their risk characteristics.", videoLinks: ["https://www.youtube.com/watch?v=LihCkxUDIwE"] },
        ]);

        // — Course 2 Lessons (Forex) —
        const c2m1 = await createLessons(c2Modules[0]._id, [
            { title: "What is Forex Trading?", explanation: "The foreign exchange market is the largest and most liquid financial market globally, with over $6 trillion traded daily. Learn how currencies are traded in pairs, the role of central banks, and why forex attracts millions of traders worldwide.", videoLinks: ["https://www.youtube.com/watch?v=F3QpgXBtDeo"] },
            { title: "Major, Minor & Exotic Pairs", explanation: "Currency pairs are categorized into majors (EUR/USD, GBP/USD), minors (EUR/GBP, AUD/NZD), and exotics (USD/TRY, EUR/ZAR). Each category has different liquidity, spreads, and volatility profiles that affect your trading approach.", videoLinks: ["https://www.youtube.com/watch?v=p7HKvqRI_Bo"] },
            { title: "Forex Market Sessions", explanation: "The forex market operates 24 hours across four major sessions: Sydney, Tokyo, London, and New York. Learn which sessions offer the best trading opportunities and how overlap periods create increased volatility and liquidity.", videoLinks: ["https://www.youtube.com/watch?v=F3QpgXBtDeo"] },
        ]);

        const c2m2 = await createLessons(c2Modules[1]._id, [
            { title: "Reading Currency Quotes", explanation: "Understanding how to read forex quotes is fundamental. Learn about base and quote currencies, direct vs indirect quotes, and how currency pair notation works. A EUR/USD quote of 1.0850 means 1 Euro buys 1.0850 US Dollars.", videoLinks: ["https://www.youtube.com/watch?v=kIFBaaPJUO0"] },
            { title: "Pip Values & Lot Sizes", explanation: "A pip (percentage in point) is the smallest standard price movement in forex. Learn to calculate pip values for different currency pairs and understand standard lots (100,000), mini lots (10,000), and micro lots (1,000).", videoLinks: ["https://www.youtube.com/watch?v=3MYHtRnq3hE"] },
            { title: "Spread & Commission Costs", explanation: "Trading costs in forex come primarily from spreads and commissions. Learn how brokers make money, the difference between fixed and variable spreads, and how to minimize your trading costs for better profitability.", videoLinks: ["https://www.youtube.com/watch?v=kIFBaaPJUO0"] },
        ]);

        const c2m3 = await createLessons(c2Modules[2]._id, [
            { title: "Forex Chart Patterns", explanation: "Chart patterns like head and shoulders, double tops/bottoms, and triangles are powerful tools for forex traders. Learn to identify these patterns on currency charts and use them to predict future price movements with high probability.", videoLinks: ["https://www.youtube.com/watch?v=GBtDRfg8y9Y"] },
            { title: "Fibonacci Retracement in Forex", explanation: "Fibonacci levels are widely used by forex traders to identify potential support and resistance areas. Learn to draw Fibonacci retracements and extensions, and how to combine them with other technical tools for confluence-based trading.", videoLinks: ["https://www.youtube.com/watch?v=PQMF_vPV_1o"] },
            { title: "Multi-Timeframe Analysis", explanation: "Professional forex traders analyze multiple timeframes simultaneously. Learn the top-down approach — start with weekly charts for trend direction, daily for context, and 4-hour or 1-hour charts for precise entries and exits.", videoLinks: ["https://www.youtube.com/watch?v=08c8dKCxhBw"] },
        ]);

        const c2m4 = await createLessons(c2Modules[3]._id, [
            { title: "Scalping Strategies", explanation: "Scalping is an ultra-short-term trading style that aims to capture small price movements. Learn the best currency pairs for scalping, optimal timeframes, required tools, and risk management techniques for this fast-paced approach.", videoLinks: ["https://www.youtube.com/watch?v=8Uz1aPoJbuM"] },
            { title: "Carry Trade Strategy", explanation: "The carry trade involves borrowing in a low-interest-rate currency and investing in a higher-yielding one. Learn how interest rate differentials create opportunities, the risks involved, and when carry trades work best.", videoLinks: ["https://www.youtube.com/watch?v=LihCkxUDIwE"] },
            { title: "News Trading in Forex", explanation: "Major economic releases like NFP, CPI, and central bank decisions create massive forex volatility. Learn how to trade around news events, set up straddle orders, and manage risk during high-impact announcements.", videoLinks: ["https://www.youtube.com/watch?v=8Uz1aPoJbuM"] },
        ]);

        const c2m5 = await createLessons(c2Modules[4]._id, [
            { title: "Understanding Leverage", explanation: "Leverage allows you to control large positions with small capital. A 100:1 leverage means $1,000 controls $100,000. While leverage amplifies profits, it equally amplifies losses. Learn to use leverage responsibly and understand margin calls.", videoLinks: ["https://www.youtube.com/watch?v=7pwKL_km9hg"] },
            { title: "Margin Requirements & Calls", explanation: "Margin is the collateral required to open and maintain forex positions. Learn about initial margin, maintenance margin, and what happens during a margin call. Understand how to calculate your maximum position size based on available margin.", videoLinks: ["https://www.youtube.com/watch?v=qhHOmZVAqBE"] },
            { title: "Capital Preservation Rules", explanation: "Protecting your trading capital is the most important skill in forex. Learn the 1% rule, the importance of a trading plan, and techniques for preserving capital during drawdowns. Discover why the best traders focus on not losing rather than winning big.", videoLinks: ["https://www.youtube.com/watch?v=7pwKL_km9hg"] },
        ]);

        const c2m6 = await createLessons(c2Modules[5]._id, [
            { title: "Central Bank Policies", explanation: "Central banks like the Federal Reserve, ECB, and RBI set monetary policies that directly impact currency values. Learn how interest rate decisions, quantitative easing, and forward guidance influence forex markets and create trading opportunities.", videoLinks: ["https://www.youtube.com/watch?v=WEDIj9JBTC8"] },
            { title: "GDP & Employment Data", explanation: "GDP growth rates and employment figures are key indicators of economic health. Learn how these data releases affect currency strength, what the market expects versus actual figures, and how to position yourself ahead of major releases.", videoLinks: ["https://www.youtube.com/watch?v=3RtwUvCK5BQ"] },
            { title: "Geopolitical Events & Forex", explanation: "Elections, trade wars, pandemics, and geopolitical tensions create significant forex volatility. Learn to assess geopolitical risk, understand safe-haven flows, and develop strategies for navigating uncertain times in currency markets.", videoLinks: ["https://www.youtube.com/watch?v=WEDIj9JBTC8"] },
        ]);

        // — Course 3 Lessons (Crypto) —
        const c3m1 = await createLessons(c3Modules[0]._id, [
            { title: "What is Blockchain?", explanation: "Blockchain is a distributed ledger technology that records transactions across a network of computers. Learn how blocks are created, verified, and chained together using cryptographic hashes, making the record immutable and transparent.", videoLinks: ["https://www.youtube.com/watch?v=hGXyXbvG31Y"] },
            { title: "How Cryptocurrencies Work", explanation: "Cryptocurrencies use blockchain technology to enable peer-to-peer digital transactions without intermediaries. Learn about mining, consensus mechanisms (Proof of Work vs Proof of Stake), and how value is determined in crypto markets.", videoLinks: ["https://www.youtube.com/watch?v=Ov_7eYNOU7M"] },
            { title: "Coins vs Tokens", explanation: "Not all cryptocurrencies are the same. Coins (Bitcoin, Ethereum) operate on their own blockchain, while tokens (USDT, UNI) are built on existing blockchains. Learn the key differences and what they mean for investors.", videoLinks: ["https://www.youtube.com/watch?v=hGXyXbvG31Y"] },
        ]);

        const c3m2 = await createLessons(c3Modules[1]._id, [
            { title: "Bitcoin: Digital Gold", explanation: "Bitcoin is the first and most valuable cryptocurrency. Learn about Satoshi Nakamoto's vision, Bitcoin's fixed supply of 21 million coins, halving events, and why institutional investors now consider Bitcoin a legitimate store of value.", videoLinks: ["https://www.youtube.com/watch?v=p7HKvqRI_Bo"] },
            { title: "Ethereum & Smart Contracts", explanation: "Ethereum expanded blockchain from simple transactions to programmable smart contracts. Learn about the Ethereum Virtual Machine, gas fees, the transition to Proof of Stake, and why Ethereum is the foundation for DeFi and NFTs.", videoLinks: ["https://www.youtube.com/watch?v=F3QpgXBtDeo"] },
            { title: "Evaluating Altcoin Projects", explanation: "With thousands of altcoins available, evaluating projects is crucial. Learn to read whitepapers, assess team credentials, analyze tokenomics, check on-chain metrics, and identify red flags that indicate potential scams.", videoLinks: ["https://www.youtube.com/watch?v=Ov_7eYNOU7M"] },
        ]);

        const c3m3 = await createLessons(c3Modules[2]._id, [
            { title: "HODLing & Dollar Cost Averaging", explanation: "HODLing means holding crypto through volatility for long-term gains. Dollar Cost Averaging (DCA) involves investing fixed amounts at regular intervals. Learn when each strategy works best and how to combine them for optimal results.", videoLinks: ["https://www.youtube.com/watch?v=8Uz1aPoJbuM"] },
            { title: "Crypto Swing Trading", explanation: "Crypto markets are highly volatile, making them ideal for swing trading. Learn to identify swing points using technical analysis, manage positions across 24/7 markets, and set up alerts for key price levels.", videoLinks: ["https://www.youtube.com/watch?v=LihCkxUDIwE"] },
            { title: "Navigating Extreme Volatility", explanation: "Crypto can move 10-20% in a single day. Learn strategies for managing extreme volatility including position sizing adjustments, wider stop losses, and when to stay in cash. Understand market cycles and how to profit from both bull and bear markets.", videoLinks: ["https://www.youtube.com/watch?v=8Uz1aPoJbuM"] },
        ]);

        const c3m4 = await createLessons(c3Modules[3]._id, [
            { title: "Introduction to DeFi", explanation: "Decentralized Finance (DeFi) recreates traditional financial services on blockchain. Learn about lending protocols (Aave, Compound), decentralized exchanges (Uniswap), and how smart contracts eliminate the need for intermediaries.", videoLinks: ["https://www.youtube.com/watch?v=hGXyXbvG31Y"] },
            { title: "Yield Farming & Liquidity Pools", explanation: "Yield farming involves providing liquidity to DeFi protocols in exchange for rewards. Learn how liquidity pools work, understand impermanent loss, and evaluate APY vs APR. Discover strategies for maximizing yield while managing risk.", videoLinks: ["https://www.youtube.com/watch?v=Ov_7eYNOU7M"] },
            { title: "Understanding NFTs", explanation: "Non-Fungible Tokens represent unique digital assets on the blockchain. Learn about NFT marketplaces, how to evaluate NFT projects, the technology behind digital art and collectibles, and real-world use cases beyond artwork.", videoLinks: ["https://www.youtube.com/watch?v=hGXyXbvG31Y"] },
        ]);

        const c3m5 = await createLessons(c3Modules[4]._id, [
            { title: "Crypto Wallet Types", explanation: "Your crypto is only as safe as your wallet. Learn the differences between hot wallets (MetaMask, Trust Wallet) and cold wallets (Ledger, Trezor). Understand when to use each type and how to properly back up your wallet.", videoLinks: ["https://www.youtube.com/watch?v=7pwKL_km9hg"] },
            { title: "Securing Your Seed Phrase", explanation: "Your seed phrase is the master key to your crypto. Learn best practices for storing it safely — metal backups, split storage, and why you should never store it digitally. Understand what happens if your seed phrase is compromised.", videoLinks: ["https://www.youtube.com/watch?v=qhHOmZVAqBE"] },
            { title: "Common Crypto Scams", explanation: "The crypto space is rife with scams — phishing attacks, rug pulls, fake airdrops, and Ponzi schemes. Learn to identify red flags, verify smart contracts before interacting, and protect yourself from the most common crypto fraud tactics.", videoLinks: ["https://www.youtube.com/watch?v=7pwKL_km9hg"] },
        ]);

        const c3m6 = await createLessons(c3Modules[5]._id, [
            { title: "Global Crypto Regulations", explanation: "Cryptocurrency regulation varies dramatically by country. Learn about the regulatory landscape in India, the US, EU, and Asia. Understand how regulations affect trading, custody, and the long-term viability of crypto projects.", videoLinks: ["https://www.youtube.com/watch?v=WEDIj9JBTC8"] },
            { title: "Crypto Tax in India", explanation: "India taxes crypto gains at 30% with 1% TDS on transactions. Learn about reporting requirements, calculating cost basis, handling airdrops and staking rewards, and strategies for tax-efficient crypto investing within the legal framework.", videoLinks: ["https://www.youtube.com/watch?v=3RtwUvCK5BQ"] },
            { title: "Future of Digital Assets", explanation: "Central Bank Digital Currencies (CBDCs), tokenization of real-world assets, and Web3 are reshaping finance. Explore emerging trends, potential regulatory developments, and how to position your portfolio for the next wave of digital asset innovation.", videoLinks: ["https://www.youtube.com/watch?v=WEDIj9JBTC8"] },
        ]);

        const totalLessons = [c1m1, c1m2, c1m3, c1m4, c1m5, c1m6, c2m1, c2m2, c2m3, c2m4, c2m5, c2m6, c3m1, c3m2, c3m3, c3m4, c3m5, c3m6]
            .reduce((sum, arr) => sum + arr.length, 0);
        console.log(`✅ Created ${totalLessons} lessons\n`);

        // ─── EXAMS ───
        console.log("📝 Creating exams...");
        const exam1 = await Exam.create({
            title: "Stock Market Fundamentals Certification",
            description: "Test your knowledge of stock market fundamentals, technical analysis, and risk management. Score 80% or higher to earn your certification and unlock contributor access.",
            passingScore: 80,
            duration: 45,
            isActive: true,
            questions: [
                { question: "What is the primary purpose of the stock market?", options: ["To gamble on company performance", "To facilitate capital formation and provide liquidity", "To create jobs for brokers", "To replace traditional banking"], correctAnswer: 1 },
                { question: "What does a wide bid-ask spread typically indicate?", options: ["High liquidity and active trading", "Low liquidity and higher transaction costs", "The stock is about to rise", "The stock is overvalued"], correctAnswer: 1 },
                { question: "In technical analysis, what does a support level represent?", options: ["The highest price a stock can reach", "A price level where buying pressure tends to overcome selling", "The average price over 50 days", "The company's book value"], correctAnswer: 1 },
                { question: "What does the P/E ratio measure?", options: ["Profit margin percentage", "Price relative to earnings per share", "Percentage of equity owned", "Price elasticity of demand"], correctAnswer: 1 },
                { question: "According to the 1-2% rule, what should you risk per trade?", options: ["1-2% of your total portfolio value", "1-2% of your annual income", "1-2% of the stock's price", "1-2% more than your previous trade"], correctAnswer: 0 },
                { question: "What is a stop loss order designed to do?", options: ["Guarantee profits on winning trades", "Limit potential losses by selling at a predetermined price", "Stop you from making emotional decisions", "Prevent market manipulation"], correctAnswer: 1 },
                { question: "A stock trading above its 200-day MA generally indicates?", options: ["A long-term downtrend", "A long-term uptrend", "The stock will rise tomorrow", "The stock is overpriced"], correctAnswer: 1 },
                { question: "What does RSI measure?", options: ["Management strength", "Momentum and overbought/oversold conditions", "Support to resistance ratio", "Revenue growth rate"], correctAnswer: 1 },
                { question: "Main difference between fundamental and technical analysis?", options: ["Fundamental uses charts, technical uses statements", "Fundamental analyzes finances, technical analyzes price", "There is no difference", "Fundamental is for stocks, technical for options"], correctAnswer: 1 },
                { question: "What is a favorable risk-reward ratio?", options: ["1:1 (risk $1 to make $1)", "3:1 (risk $3 to make $1)", "1:2 or better (risk $1 to make $2+)", "It doesn't matter"], correctAnswer: 2 },
            ],
        });

        const exam2 = await Exam.create({
            title: "Forex Trading Basics Certification",
            description: "Validate your understanding of forex markets, currency pairs, and forex trading strategies. Pass with 80% or above to demonstrate your forex knowledge.",
            passingScore: 80,
            duration: 30,
            isActive: true,
            questions: [
                { question: "What is a pip in forex trading?", options: ["A type of currency", "The smallest standard price movement", "A trading platform", "A broker fee"], correctAnswer: 1 },
                { question: "Which is a major currency pair?", options: ["EUR/TRY", "USD/ZAR", "EUR/USD", "GBP/NOK"], correctAnswer: 2 },
                { question: "What does leverage of 100:1 mean?", options: ["You need $100 for every $1 trade", "$1 controls $100 in the market", "You can only trade 100 times", "Your profit is multiplied by 100"], correctAnswer: 1 },
                { question: "When is forex market liquidity highest?", options: ["Sydney session only", "During session overlaps", "Weekends", "Early morning Asia"], correctAnswer: 1 },
                { question: "What is a carry trade?", options: ["Carrying physical currency", "Borrowing low-rate currency to invest in higher-rate currency", "Trading while traveling", "A long-term stock strategy"], correctAnswer: 1 },
                { question: "What causes a margin call?", options: ["Making too many trades", "Account equity falling below maintenance margin", "Winning too many trades", "Changing brokers"], correctAnswer: 1 },
                { question: "What is the base currency in EUR/USD?", options: ["USD", "EUR", "Both equally", "Neither"], correctAnswer: 1 },
                { question: "Which factor most directly affects currency values?", options: ["Stock market performance", "Central bank interest rate decisions", "Real estate prices", "Commodity exports only"], correctAnswer: 1 },
            ],
        });
        console.log(`✅ Created 2 exams\n`);

        // Summary
        console.log("=".repeat(50));
        console.log("🎉 DATABASE SEEDING COMPLETED!\n");
        console.log("📊 Summary:");
        console.log(`   👥 Users: ${users.length}`);
        console.log(`   🎓 Courses: 3`);
        console.log(`   📚 Modules: ${allModules.length}`);
        console.log(`   📖 Lessons: ${totalLessons}`);
        console.log(`   📝 Exams: 2`);
        console.log("\n🔐 Login Credentials (all use password: password123):");
        console.log("   Admin:        admin@marketmakers.com");
        console.log("   Contributor:   priya@marketmakers.com");
        console.log("   Contributor:   rajesh@marketmakers.com");
        console.log("   Learner:      arjun@marketmakers.com");
        console.log("   Learner:      sneha@marketmakers.com");
        console.log("=".repeat(50));

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();
    await seedDatabase();
};

run();
