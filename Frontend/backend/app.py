from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from datetime import datetime
from dotenv import load_dotenv
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GOOGLE_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyCkP89Xx7KrTJpGwk-lpjswg_w9NNbKld4')
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Gemini model with gemini-2.0-flash
try:
    model = genai.GenerativeModel('models/gemini-2.0-flash')
    logger.info("Using model: models/gemini-2.0-flash")
except Exception as e:
    logger.error(f"Error initializing Gemini model: {str(e)}")
    logger.error(traceback.format_exc())
    raise ValueError("Failed to initialize Gemini model. Please ensure your API key has access to gemini-2.0-flash.")

def generate_workout_prompt(form_data):
    """Generate a detailed prompt for the workout plan based on form data"""
    try:
        prompt = f"""Create a detailed, personalized workout plan based on the following information:

User Profile:
- Fitness Level: {form_data.get('fitness_level', 'Not specified')}
- Medical Conditions: {form_data.get('medical_conditions', 'None')}
- Medications: {form_data.get('medications', 'None')}
- Past Activities: {form_data.get('past_activities', 'Not specified')}

Goals and Preferences:
- Primary Goals: {', '.join(form_data.get('fitness_goals', []))}
- Goal Deadline: {form_data.get('goal_deadline', 'Not specified')}
- Exercise Preferences: {', '.join(form_data.get('exercise_likes', []))}
- Exercise Dislikes: {', '.join(form_data.get('exercise_dislikes', []))}
- Available Equipment: {', '.join(form_data.get('equipment_list', []))}

Schedule:
- Workout Days per Week: {form_data.get('workout_days', 'Not specified')}
- Session Duration: {form_data.get('session_duration', 'Not specified')} minutes
- Location: {form_data.get('workout_location', 'Not specified')}

Please provide a structured workout plan in the following JSON format:
{{
    "goals": ["list", "of", "primary", "goals"],
    "schedule": "summary of workout schedule",
    "fitness_level": "user's fitness level",
    "location": "workout location",
    "weekly_schedule": [
        {{
            "day": "Day of week",
            "workouts": [
                {{
                    "name": "Workout name",
                    "duration": "Duration in minutes",
                    "intensity": "Low/Moderate/High",
                    "exercises": [
                        "Exercise 1 with sets and reps",
                        "Exercise 2 with sets and reps",
                        ...
                    ]
                }}
            ]
        }}
    ],
    "recommendations": [
        "Recommendation 1",
        "Recommendation 2",
        ...
    ]
}}

Important guidelines:
1. Ensure exercises are appropriate for the user's fitness level and medical conditions
2. Include proper warm-up and cool-down exercises
3. Consider available equipment and location
4. Provide clear, specific exercise instructions
5. Include safety recommendations
6. Make the plan challenging but achievable
7. Consider exercise preferences and dislikes
8. Format the response as valid JSON only, no additional text
9. Keep the response concise and focused on practical exercises
10. Ensure all exercises are safe and suitable for the user's fitness level
"""
        return prompt
    except Exception as e:
        logger.error(f"Error generating prompt: {str(e)}")
        logger.error(traceback.format_exc())
        raise

@app.route('/workout-plan', methods=['POST'])
def generate_workout_plan():
    try:
        # Log the incoming request
        logger.info("Received workout plan request")
        
        form_data = request.json
        if not form_data:
            logger.error("No data provided in request")
            return jsonify({"error": "No data provided"}), 400
        
        logger.debug(f"Form data received: {form_data}")
        
        # Generate the prompt
        prompt = generate_workout_prompt(form_data)
        logger.debug("Generated prompt successfully")
        
        try:
            # Get response from Gemini with safety settings
            response = model.generate_content(
                prompt,
                safety_settings=[
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            )
            
            if not response.text:
                logger.error("Empty response from Gemini API")
                raise ValueError("Empty response from Gemini API")
            
            logger.debug("Received response from Gemini API")
            
            # Extract the JSON response
            response_text = response.text
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0]
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0]
            
            logger.debug("Extracted JSON from response")
            
            # Parse the JSON response
            import json
            workout_plan = json.loads(response_text)
            
            # Add timestamp
            workout_plan['generated_at'] = datetime.now().isoformat()
            
            logger.info("Successfully generated workout plan")
            return jsonify(workout_plan)
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {str(e)}")
            logger.error(f"Raw response text: {response_text}")
            return jsonify({
                "error": "Failed to parse workout plan",
                "details": "The generated plan was not in valid JSON format",
                "raw_response": response_text
            }), 500
            
        except Exception as e:
            logger.error(f"Error with Gemini API: {str(e)}")
            logger.error(traceback.format_exc())
            return jsonify({
                "error": "Failed to generate workout plan",
                "details": str(e),
                "type": "gemini_api_error"
            }), 500
            
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": "Failed to process request",
            "details": str(e),
            "type": "request_processing_error"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 