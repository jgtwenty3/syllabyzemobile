from flask import Flask, request, session, redirect, url_for, render_template, jsonify
from flask_bcrypt import Bcrypt
from sqlalchemy import desc
from flask_socketio import SocketIO, emit
from werkzeug.security import generate_password_hash
import os
from werkzeug.utils import secure_filename
from config import app, db, migrate, api
from models import db, User, Syllabus, StudyPlan, Progress

def home():
    return ''

@app.route('/signup', methods=['POST'])
def signup():
    json_data = request.get_json()

    required_fields = ['firstName', 'lastName', 'email', 'password']
    for field in required_fields:
        if field not in json_data:
            return jsonify({'error': f'Missing {field}'}), 400
    
    # Create a new user object
    newUser = User( first_name=json_data['firstName'], last_name=json_data['lastName'], email=json_data['email'], )
    newUser.password_hash = json_data['password']

    # Add the user to the database and commit
    db.session.add(newUser)
    db.session.commit()

    # Return a success message
    return jsonify({'message': 'User registered successfully'}), 201


@app.route('/login', methods=['POST'])
def login():
    # Parse the JSON request body
    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        return {'error': 'Bad Request, missing email or password'}, 400
    
    email = data['email']
    password = data['password']

    user = User.query.filter(User.email == email).first()

    if user and user.authenticate(password):
        session['user_id'] = user.id
        return jsonify(user.to_dict()), 200  # Ensure the response is JSON
    else:
        return jsonify({'error': '401 Unauthorized'}), 401  # Ensure the error is also JSON



@app.route('/check_session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    if user_id is None:
        return {"error": "Unauthorized"}, 401

    user = User.query.get(user_id)
    if user:
        return user.to_dict(), 200
    return {"error": "User not found"}, 404

    
@app.route('/logout', methods = ['DELETE'])
def logout():
    session.pop('user_id', None)
    session.pop('user_role', None)

    return {}, 204

@app.route('/syllabi', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def syllabi():
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Unauthorized"}, 401

    if request.method == 'GET':
        syllabi = Syllabus.query.filter_by(user_id=user_id).all()
        return {"data": [s.to_dict() for s in syllabi]}, 200

    elif request.method == 'POST':
        json_data = request.get_json()
        try:
            new_syllabus = Syllabus(
                user_id=user_id,
                course_id=json_data['course_id'],
                upload_url=json_data.get('upload_url'),
                parsed_data=json_data.get('parsed_data'),
            )
            db.session.add(new_syllabus)
            db.session.commit()
            return new_syllabus.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400

    elif request.method == 'PATCH':
        json_data = request.get_json()
        syllabus_id = json_data.get('id')
        syllabus = Syllabus.query.filter_by(user_id=user_id, id=syllabus_id).first()
        if not syllabus:
            return {"error": "Syllabus not found"}, 404

        for key, value in json_data.items():
            setattr(syllabus, key, value)
        db.session.commit()
        return syllabus.to_dict(), 200

    elif request.method == 'DELETE':
        syllabus_id = request.args.get('id')  # Assuming ID is passed as query param
        syllabus = Syllabus.query.filter_by(user_id=user_id, id=syllabus_id).first()
        if not syllabus:
            return {"error": "Syllabus not found"}, 404

        db.session.delete(syllabus)
        db.session.commit()
        return {}, 204


@app.route('/studyplans', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def studyplans():
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Unauthorized"}, 401

    if request.method == 'GET':
        study_plans = StudyPlan.query.filter_by(user_id=user_id).all()
        return {"data": [sp.to_dict() for sp in study_plans]}, 200

    elif request.method == 'POST':
        json_data = request.get_json()

        try:
            new_study_plan = StudyPlan(
                user_id=user_id,
                plan_data=json_data.get('plan_data'),
                status=json_data.get('status'),
            )
            db.session.add(new_study_plan)
            db.session.commit()
            return new_study_plan.to_dict(), 201
        except Exception as e:
            return {"error": f"Error adding new study plan: {str(e)}"}, 400

    elif request.method == 'PATCH':
        json_data = request.get_json()
        study_plan_id = json_data.get('id')
        study_plan = StudyPlans.query.filter_by(user_id=user_id, id=study_plan_id).first()

        if not study_plan:
            return {"error": "Study plan not found"}, 404

        for key, value in json_data.items():
            if hasattr(study_plan, key):
                setattr(study_plan, key, value)

        db.session.commit()
        return study_plan.to_dict(), 200

    elif request.method == 'DELETE':
        study_plan_id = request.args.get('id')  # Assuming ID is passed as query param
        study_plan = StudyPlan.query.filter_by(user_id=user_id, id=study_plan_id).first()

        if not study_plan:
            return {"error": "Study plan not found"}, 404

        db.session.delete(study_plan)
        db.session.commit()
        return {}, 204

@app.route('/users', methods=['PATCH'])
def update_user():
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Unauthorized"}, 401

    json_data = request.get_json()
    user = User.query.get(user_id)

    if not user:
        return {"error": "User not found"}, 404

    for key, value in json_data.items():
        if hasattr(user, key):
            setattr(user, key, value)

    db.session.commit()
    return user.to_dict(), 200

@app.route('/users', methods=['DELETE'])
def delete_account():
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Unauthorized"}, 401

    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}, 404

    db.session.delete(user)
    db.session.commit()
    return {}, 204

@app.route('/progress', methods=['GET'])
def get_progress():
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Unauthorized"}, 401

    progress = Progress.query.filter_by(user_id=user_id).all()
    return {"data": [p.to_dict() for p in progress]}, 200

@app.route('/progress', methods=['PATCH'])
def update_progress():
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Unauthorized"}, 401

    json_data = request.get_json()
    progress_id = json_data.get('id')
    progress = Progress.query.filter_by(user_id=user_id, id=progress_id).first()

    if not progress:
        return {"error": "Progress not found"}, 404

    for key, value in json_data.items():
        if hasattr(progress, key):
            setattr(progress, key, value)

    db.session.commit()
    return progress.to_dict(), 200

@app.route('/syllabi/<int:syllabus_id>', methods=['GET'])
def syllabus_details(syllabus_id):
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Unauthorized"}, 401

    syllabus = Syllabus.query.filter_by(user_id=user_id, id=syllabus_id).first()
    if not syllabus:
        return {"error": "Syllabus not found"}, 404

    return syllabus.to_dict(), 200



ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = 'uploads/syllabi'  # Define the folder where files will be stored
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/syllabi/upload', methods=['POST'])
def upload_syllabus():
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Unauthorized"}, 401

    # Check if the file is part of the request
    if 'file' not in request.files:
        return {"error": "No file uploaded"}, 400

    file = request.files['file']

    # Validate the file
    if file.filename == '':
        return {"error": "No selected file"}, 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Save the file locally
        file.save(file_path)

        # Optionally, you can save the file path to the database
        new_syllabus = Syllabus(
            user_id=user_id,
            upload_url=file_path,  # Save the file path or a cloud URL
        )
        db.session.add(new_syllabus)
        db.session.commit()

        return {"message": "File uploaded successfully", "data": new_syllabus.to_dict()}, 201

    return {"error": "Invalid file type. Only images and PDFs are allowed"}, 400


@app.route('/stats', methods=['GET'])
def get_stats():
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Unauthorized"}, 401

    # Example stats computation
    completed_plans = StudyPlans.query.filter_by(user_id=user_id, status='completed').count()
    total_progress = Progress.query.filter_by(user_id=user_id).count()

    return {
        "completed_plans": completed_plans,
        "total_progress": total_progress
    }, 200




    
