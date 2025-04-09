const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Configure AI endpoint (can be switched between different providers)
const AI_ENDPOINT = process.env.AI_ENDPOINT || 'http://localhost:11434/api/generate'; // Default to Ollama local endpoint
const AI_MODEL = process.env.AI_MODEL || 'llama2'; // Default to llama2

class AIService {
    constructor() {
        this.endpoint = AI_ENDPOINT;
        this.model = AI_MODEL;
    }

    async generateResponse(prompt) {
        try {
            const response = await axios.post(this.endpoint, {
                model: this.model,
                prompt: prompt,
                stream: false
            });
            return response.data.response;
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Failed to generate AI response');
        }
    }

    async analyzeEmotion(text, imageUrl = null) {
        let prompt = `Analyze the following text for emotional content: "${text}"`;
        
        if (imageUrl) {
            prompt += `\nAlso consider this image URL: ${imageUrl}`;
        }

        prompt += `\nProvide a detailed emotional analysis in JSON format with the following structure:
        {
            "primaryEmotion": "emotion name",
            "confidence": number between 0 and 1,
            "secondaryEmotions": ["emotion1", "emotion2"],
            "intensity": number between 0 and 1,
            "sentiment": "positive/negative/neutral",
            "analysis": "detailed explanation",
            "recommendations": ["recommendation1", "recommendation2"]
        }`;

        const response = await this.generateResponse(prompt);
        return JSON.parse(response);
    }

    async generateQuiz(topic, difficulty, numberOfQuestions = 5) {
        const prompt = `Generate a ${difficulty} difficulty quiz about ${topic} with ${numberOfQuestions} questions. 
            Format as JSON with the following structure:
            {
                "questions": [
                    {
                        "question": "question text",
                        "options": ["option1", "option2", "option3", "option4"],
                        "correctAnswer": "correct option",
                        "explanation": "explanation of the answer"
                    }
                ]
            }`;

        const response = await this.generateResponse(prompt);
        return JSON.parse(response);
    }

    async generatePersonalizedRecommendations(userProfile, learningHistory) {
        const prompt = `Based on this user profile and learning history, suggest personalized learning recommendations.
            User Profile: ${JSON.stringify(userProfile)}
            Learning History: ${JSON.stringify(learningHistory)}
            Format recommendations as JSON with structure:
            {
                "recommendations": [
                    {
                        "moduleId": "id",
                        "reason": "explanation",
                        "priority": "high/medium/low"
                    }
                ]
            }`;

        const response = await this.generateResponse(prompt);
        return JSON.parse(response);
    }

    async generateGameStrategy(gameType, userSkillLevel) {
        const prompt = `Generate a personalized learning game strategy for a ${userSkillLevel} level user playing ${gameType}.
            Include specific tips, progression path, and engagement techniques.
            Format as JSON with structure:
            {
                "strategy": {
                    "difficulty": "recommended difficulty level",
                    "focusAreas": ["area1", "area2"],
                    "techniques": ["technique1", "technique2"],
                    "progressionPath": ["step1", "step2"],
                    "estimatedTimeToMastery": "time estimate"
                }
            }`;

        const response = await this.generateResponse(prompt);
        return JSON.parse(response);
    }
}

module.exports = new AIService(); 