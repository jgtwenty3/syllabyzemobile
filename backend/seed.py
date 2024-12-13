from app import app
from models import db, User, Course, Syllabus, StudyPlan, Progress
from datetime import datetime
from random import randint, choice as rc
from faker import Faker

if __name__ == '__main__':
    faker = Faker()

    with app.app_context():
        print('Starting seed...')

        # Clear existing data
        db.session.query(User).delete()       
        db.session.query(Course).delete() 
        db.session.query(Syllabus).delete() 
        db.session.query(StudyPlan).delete()
        db.session.query(Progress).delete() 

        # Seed Users
        users = []
        for _ in range(10):
            user = User(
                first_name=faker.first_name(),
                last_name=faker.last_name(),
                email=faker.email(),
                study_hours=randint(10, 50)  # Random study hours
            )
            user._password_hash = 'defaultpassword'  # Set a default password using the setter
            users.append(user)
            db.session.add(user)

        db.session.commit()

        # Seed Courses
        courses = []
        for _ in range(10):
            course = Course(
                title=faker.word(),
                user_id=rc(users).id,  # Assigning a random user to each course
            )
            courses.append(course)
            db.session.add(course)

        db.session.commit()

        # Seed Syllabi
        syllabi = []
        for _ in range(10):
            syllabus = Syllabus(
                course_id=rc(courses).id,  # Assigning a random course
                user_id=rc(users).id,  # Assigning a random user
                upload_url=faker.url(),
                parsed_data={'data': faker.text()},  # Example of JSON data
                created_at=faker.date_this_year(),
                updated_at=faker.date_this_year(),
            )
            syllabi.append(syllabus)
            db.session.add(syllabus)

        db.session.commit()

        # Seed StudyPlans
        study_plans = []
        for _ in range(10):
            study_plan = StudyPlan(
                syllabus_id=rc(syllabi).id,  # Assigning a random syllabus
                user_id=rc(users).id,  # Assigning a random user
                plan_data={'goals': faker.text()},
                status='in progress',
                created_at=faker.date_this_year(),
                updated_at=faker.date_this_year(),
            )
            study_plans.append(study_plan)
            db.session.add(study_plan)

        db.session.commit()

        # Seed Progress
        for _ in range(10):
            progress = Progress(
                study_plan_id=rc(study_plans).id,  # Assigning a random study plan
                task_date=faker.date_this_year(),
                task_description=faker.text(),
                completed=randint(0, 1) == 1,  # Randomly marking as completed or not
                completion_time=faker.date_this_year(),
            )
            db.session.add(progress)

        db.session.commit()

        # Seed a known user for login
        known_user = User(
            first_name="Test1",
            last_name="One",
            email="Test1@test.com",
            study_hours=20
        )
        known_user._password_hash = "testing111"  # Set a known password using the setter
        db.session.add(known_user)
        db.session.commit()

        # Assign courses and study plans to known user
        for _ in range(2):  # Creating 2 courses for the known user
            course = Course(
                title=faker.word(),
                user_id=known_user.id,
            )
            db.session.add(course)
            db.session.commit()

            syllabus = Syllabus(
                course_id=course.id,  # Assigning to the created course
                user_id=known_user.id,
                upload_url=faker.url(),
                parsed_data={'data': faker.text()},  # Example of JSON data
                created_at=faker.date_this_year(),
                updated_at=faker.date_this_year(),
            )
            db.session.add(syllabus)
            db.session.commit()

            study_plan = StudyPlan(
                syllabus_id=syllabus.id,  # Assigning to the created syllabus
                user_id=known_user.id,
                plan_data={'goals': faker.text()},
                status='in progress',
                created_at=faker.date_this_year(),
                updated_at=faker.date_this_year(),
            )
            db.session.add(study_plan)
            db.session.commit()

            progress = Progress(
                study_plan_id=study_plan.id,  # Assigning to the created study plan
                task_date=faker.date_this_year(),
                task_description=faker.text(),
                completed=randint(0, 1) == 1,  # Randomly marking as completed or not
                completion_time=faker.date_this_year(),
            )
            db.session.add(progress)
            db.session.commit()

        print('Seeding complete!')
