from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from datetime import datetime
from dotenv import load_dotenv
import traceback
import logging
import time
import random
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import google.api_core.exceptions as google_exceptions

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GOOGLE_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyBg5eqsQ1j6N5zs5wSifl1Ha_ijSRDeiwU')
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

def generate_with_retry(model, prompt, max_retries=3):
    """Generate content with retry logic for rate limits"""
    @retry(
        stop=stop_after_attempt(max_retries),
        wait=wait_exponential(multiplier=1, min=4, max=60),
        retry=retry_if_exception_type(google_exceptions.ResourceExhausted),
        reraise=True
    )
    def _generate():
        try:
            return model.generate_content(
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
        except google_exceptions.ResourceExhausted as e:
            logger.warning(f"Rate limit hit, retrying... Error: {str(e)}")
            # Add a small random delay to prevent thundering herd
            time.sleep(random.uniform(1, 3))
            raise
        except Exception as e:
            logger.error(f"Unexpected error during generation: {str(e)}")
            raise

    return _generate()

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
            # Get response from Gemini with retry logic
            response = generate_with_retry(model, prompt)
            
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
            
        except google_exceptions.ResourceExhausted as e:
            logger.error(f"Rate limit exceeded after retries: {str(e)}")
            return jsonify({
                'error': 'Rate limit exceeded. Please try again in a few minutes.',
                'details': str(e),
                'type': 'rate_limit_error'
            }), 429
            
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

@app.route('/meal-plan', methods=['POST'])
def generate_meal_plan():
    try:
        data = request.json
        
        # Build prompt for Gemini
        prompt = f"""
Create a personalized 7-day meal plan for a user with the following details:

- Age: {data.get('age')} years
- Gender: {data.get('gender')}
- Height: {data.get('height')} cm
- Weight: {data.get('weight')} kg
- Activity Level: {data.get('activity_level')}
- Health Goal: {data.get('health_goal')}
- Dietary Preference: {data.get('dietary_preference')}
- Allergies/Restrictions: {data.get('allergies', 'None')}
- Meals per Day: {data.get('meals_per_day')}
- Preferred Meal Types: {data.get('preferred_meal_types', [])}
- Available Cooking Setup: {data.get('cooking_setup')}
- Available Ingredients: {data.get('available_ingredients', [])}
- Disliked Foods: {data.get('disliked_foods', [])}
- Preferred Cuisine Regions: {data.get('preferred_cuisine', [])}
- Calorie Target: {data.get('calorie_target', 'Not specified')}

Instructions:
Generate a detailed 7-day meal plan in the following JSON format:
{{
    "days": [
        {{
            "title": "Day 1 - Balanced Nutrition",
            "total_calories": "2000 kcal",
            "macros": "Protein: 30%, Carbs: 40%, Fats: 30%",
            "meals": [
                {{
                    "title": "Breakfast: Oatmeal with Fruits",
                    "ingredients": [
                        "1 cup rolled oats",
                        "1 cup milk",
                        "1 banana, sliced",
                        "1 tbsp honey"
                    ],
                    "instructions": [
                        "Cook oats with milk until creamy",
                        "Top with banana slices and honey"
                    ],
                    "nutrition": {{
                        "calories": "350 kcal",
                        "protein": "12g",
                        "carbs": "60g",
                        "fats": "8g"
                    }},
                    "prep_time": "5 minutes",
                    "cook_time": "10 minutes"
                }}
            ],
            "notes": [
                "Meal prep tip: Cook oats in bulk for the week",
                "Shopping list: Oats, milk, bananas, honey"
            ]
        }}
    ],
    "shopping_list": [
        "Category: Grains",
        "- Oats",
        "- Brown rice",
        "Category: Proteins",
        "- Chicken breast",
        "- Tofu"
    ],
    "meal_prep_tips": [
        "Tip 1: Cook grains in bulk",
        "Tip 2: Chop vegetables in advance"
    ]
}}

Important guidelines:
1. Format the response as valid JSON only
2. Include all meals for each day
3. Provide detailed ingredients with quantities
4. Include clear cooking instructions
5. Add nutritional information for each meal
6. Include prep and cook times
7. Add daily calorie totals and macro distribution
8. Include meal prep tips and shopping list
9. Ensure meals are suitable for dietary preferences
10. Consider available ingredients and cooking setup
"""

        model = genai.GenerativeModel("models/gemini-2.0-flash")
        response = generate_with_retry(model, prompt)
        
        if not response.text:
            raise ValueError("Empty response from Gemini API")
        
        # Extract the JSON response
        response_text = response.text
        if '```json' in response_text:
            response_text = response_text.split('```json')[1].split('```')[0]
        elif '```' in response_text:
            response_text = response_text.split('```')[1].split('```')[0]
        
        # Parse the JSON response
        import json
        try:
            meal_plan = json.loads(response_text)
            # Add timestamp
            meal_plan['generated_at'] = datetime.now().isoformat()
            
            return jsonify({
                'plan': meal_plan,
                'user_data': data
            })
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {str(e)}")
            logger.error(f"Raw response text: {response_text}")
            return jsonify({
                "error": "Failed to parse meal plan",
                "details": "The generated plan was not in valid JSON format",
                "raw_response": response_text
            }), 500

    except google_exceptions.ResourceExhausted as e:
        logger.error(f"Rate limit exceeded after retries: {str(e)}")
        return jsonify({
            'error': 'Rate limit exceeded. Please try again in a few minutes.',
            'details': str(e),
            'type': 'rate_limit_error'
        }), 429
    except Exception as e:
        logger.error(f"Error generating meal plan: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'error': 'Failed to generate meal plan',
            'details': str(e),
            'type': 'generation_error'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 