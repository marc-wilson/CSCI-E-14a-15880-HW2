# Define Web Form

from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, IntegerField, FloatField, SubmitField
from wtforms.validators import DataRequired

prog_lang_choices = [
    ('cpp', 'C++'),
    ('java', 'Java'),
    ('js', 'JavaScript'),
    ('php', 'PHP'),
    ('py', 'Python'),
    ('other', 'Other')
]

class UserForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    prog_lang = SelectField('Programming Language', choices=prog_lang_choices, validators=[DataRequired()])
    experience_yr = FloatField('Years of Programming Experience', validators=[DataRequired()])
    age = IntegerField('Age', validators=[DataRequired()])
    hw1_hrs = FloatField('Hours Spent on HW1', validators=[DataRequired()])
    submit = SubmitField('Add')