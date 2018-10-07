from flask import Flask, render_template, request, redirect, url_for, jsonify
from models import db, User
from forms import UserForm

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost:5434/homework_users'

# https://github.com/mitsuhiko/flask-sqlalchemy/issues/365 (remove deprecation warnings)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

app.secret_key = 'marcwilson'


@app.route('/')
def index_redirect():
    return render_template('index.html')


@app.route('/index')
def index():
    users = User.query.all()
    return render_template('index.html', title='Home', users=users)


@app.route('/add-user', methods=['GET', 'POST'])
def add_user():
    form = UserForm()
    if request.method == 'GET':
        return render_template('add_user.html', form=form)
    else:
        if form.validate_on_submit():
            username = request.form['username']
            first_name = request.form['first_name']
            last_name = request.form['last_name']
            prog_lang = request.form['prog_lang']
            experience_yr = request.form['experience_yr']
            age = request.form['age']
            hw1_hrs = request.form['hw1_hrs']

            new_user = User(
                username=username,
                first_name=first_name,
                last_name=last_name,
                prog_lang=prog_lang,
                experience_yr=experience_yr,
                age=age,
                hw1_hrs=hw1_hrs
            )

            db.session.add(new_user)
            db.session.commit()
            return redirect(url_for('index'))


@app.route('/edit-user/<int:uid>', methods=['GET', 'POST'])
def edit_user(uid):
    form = UserForm()
    if request.method == 'GET':
        user = User.query.filter_by(uid=uid).first()
        form = UserForm(
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            prog_lang=user.prog_lang,
            experience_yr=user.experience_yr,
            age=user.age,
            hw1_hrs=user.hw1_hrs
        )
        return render_template('edit_user.html', form=form, uid=user.uid)
    else:
        if form.validate_on_submit():
            username = request.form['username']
            first_name = request.form['first_name']
            last_name = request.form['last_name']
            prog_lang = request.form['prog_lang']
            experience_yr = request.form['experience_yr']
            age = request.form['age']
            hw1_hrs = request.form['hw1_hrs']

            updated_user = User(
                username=username,
                first_name=first_name,
                last_name=last_name,
                prog_lang=prog_lang,
                experience_yr=experience_yr,
                age=age,
                hw1_hrs=hw1_hrs
            )

            user = User.query.filter_by(uid=uid).first()
            user.username = updated_user.username,
            user.first_name = updated_user.first_name,
            user.last_name = updated_user.last_name,
            user.prog_lang = updated_user.prog_lang,
            user.experience_yr = updated_user.experience_yr,
            user.age = updated_user.age,
            user.hw1_hrs = updated_user.hw1_hrs

            db.session.commit()
            return redirect(url_for('index'))


@app.route('/delete-user/<int:uid>', methods=['POST'])
def delete_user(uid):
    if request.method == 'POST':
        User.query.filter_by(uid=uid).delete()
        db.session.commit()
        return redirect('/manage-users', code=200)


@app.route('/manage-users', methods=['GET'])
def get_users():
    form = UserForm()
    if request.method == 'GET':
        users = User.query.all()
        return render_template('manage_users.html', users=users, form=form)


@app.route('/load_data', methods=['GET'])
def load_data():
    users_json = { 'users': [] }
    users = User.query.all()
    for user in users:
        user_info = user.__dict__
        del user_info['_sa_instance_state']
        users_json['users'].append(user_info)
    return jsonify(users_json)


if __name__ == "__main__":
    app.run(debug=True)
