from sqlalchemy_serializer import SerializerMixin
from flask_bcrypt import Bcrypt
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property
import uuid
from sqlalchemy.dialects.postgresql import UUID
from config import db

bcrypt = Bcrypt()

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    study_hours = db.Column(db.Integer, nullable=True)

    syllabi = db.relationship("Syllabus", back_populates="user", cascade="all, delete-orphan")
    study_plans = db.relationship("StudyPlan", back_populates="user", cascade="all, delete-orphan")
    courses = db.relationship('Course', back_populates="user", cascade="all, delete-orphan")

    serialize_rules = ("-syllabi.user", "-study_plans.user", "-_password_hash")

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password is not readable.")

    @password_hash.setter
    def password_hash(self, password):
        # Hash password only once
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    def authenticate(self, password): 
        return bcrypt.check_password_hash(self._password_hash, password)

class Course(db.Model, SerializerMixin):
    __tablename__ = "courses"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)

    syllabi = db.relationship("Syllabus", back_populates="course", cascade="all, delete-orphan")
    user = db.relationship("User", back_populates="courses")  # Corrected here
    serialize_rules = ('-syllabi.course')


class Syllabus(db.Model, SerializerMixin):
    __tablename__ = "syllabi"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    course_id = db.Column(UUID(as_uuid=True), db.ForeignKey("courses.id"), nullable=False)
    upload_url = db.Column(db.String, nullable=True)
    parsed_data = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="syllabi")
    course = db.relationship("Course", back_populates="syllabi")
    study_plans = db.relationship("StudyPlan", back_populates="syllabus", cascade="all, delete-orphan")

    serialize_rules = ("-user.syllabi", "-course.syllabi", "-study_plans.syllabus")


class StudyPlan(db.Model, SerializerMixin):
    __tablename__ = "study_plans"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    syllabus_id = db.Column(UUID(as_uuid=True), db.ForeignKey("syllabi.id"), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    plan_data = db.Column(db.JSON, nullable=False)
    status = db.Column(db.String(50), default="in progress")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    syllabus = db.relationship("Syllabus", back_populates="study_plans")
    user = db.relationship("User", back_populates="study_plans")
    progress = db.relationship("Progress", back_populates="study_plan", cascade="all, delete-orphan")

    serialize_rules = ("-syllabus.study_plans", "-user.study_plans", "-progress.study_plan")

class Progress(db.Model, SerializerMixin):
    __tablename__ = "progress"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    study_plan_id = db.Column(UUID(as_uuid=True), db.ForeignKey("study_plans.id"), nullable=False)
    task_date = db.Column(db.Date, nullable=False)
    task_description = db.Column(db.String(200), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    completion_time = db.Column(db.DateTime, default=datetime.utcnow)

    study_plan = db.relationship("StudyPlan", back_populates="progress")

    serialize_rules = ("-study_plans.progress")