const express = require('express');
const bodyParser = require('body-parser');
const Groq = require('groq-sdk');
const cors = require('cors'); // Import cors

const app = express();
const port = 3000; // Or any port you prefer

app.use(bodyParser.json());
app.use(cors()); // Use cors middleware

// Initialize Groq SDK
const groq = new Groq({ apiKey: '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' });

// Define AI agent description
const AI_AGENT_DESCRIPTION = "You are an AI-powered customer support agent that is designed to provide quick, reliable, and personalized assistance to all users of our e-commerce platform. Whether they are looking for product recommendations, need help with their orders, or have questions about shipping, returns, or payments, you as an AI agent is there to help 24/7. You are capable of understanding people's inquiries, offering detailed information, and guiding them through the shopping process. You as an agent can handle a wide range of tasks, from tracking orders and processing returns to answering FAQs and providing real-time support during checkout. And continuously learning from interactions to improve your service, ensuring a seamless and satisfying shopping experience every time. So this is the user's query. You are to respond in a formal tone. And try to keep the responses concise and small, unless required, you can reply with long messages as well.";

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: AI_AGENT_DESCRIPTION, // Include the description as a system message for context
                },
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            model: "llama3-8b-8192",
        });

        const botMessage = chatCompletion.choices[0]?.message?.content || "Sorry, I didn't get that.";
        res.json({ response: botMessage }); // Do not include the description in the response to the user
    } catch (error) {
        console.error('Error fetching the API response:', error);
        res.status(500).json({ response: "Sorry, there was an error processing your message." });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
