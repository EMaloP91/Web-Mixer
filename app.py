import os

from cs50 import SQL
from flask import Flask, render_template, redirect, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

# configure app
app=Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///mixer.db")

# This will create the database file if it doesn't exist
db.execute("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)")

# define route for index
@app.route('/')
def index():
    # check if logged in
    if "user_id" in session:
        return render_template("index.html")
    
    # if not logged in
    else:
        return render_template("home.html")
    

# define route for login
@app.route("/login", methods=["GET", "POST"])
def login():

    # forget any user id
    session.clear()

    # render login template
    if not request.method == "POST":
        return render_template("login.html")
    
    # when user inserts data:
    else:
        # ensure email was submited
        if not request.form.get("email"):
            return apology(message="Please insert mail adress")
        
        # ensure password is submited
        if not request.form.get("password"):
            return apology(message="Please insert valid password")
        
        # query database for username and password
        rows = db.execute(
            "SELECT * FROM users WHERE email = ?", request.form.get("email")
        )
    
    # ensure email exists and password is correct
    if len(rows) != 1 or not check_password_hash(
        rows[0]["password"], request.form.get("password")
    ):
        return apology(message="Invalid email or password")
    
    # remember user id
    session["user_id"] = rows[0]["id"]

    #redirect user to index page
    return redirect("/")

# define route for register
@app.route("/register", methods=["GET", "POST"])
def register():
    if not request.method == "POST":
        return render_template("register.html")
    else:        
        # ensure email was submited
        if not request.form.get("email"):
            return apology(message="Please insert valid mail adress")
        
        # ensure email doesn't alredy exists
        mail = db.execute(
            "SELECT email FROM users WHERE email = ?", request.form.get("email")
        )

        if mail:
            return apology(message="Email address alredy exists")

        # ensure password is submited and both passwords are the same
        if not request.form.get("password1") or not request.form.get("password2"):
            return apology(message="Please insert valid password and confirmation")
        
        if request.form.get("password1") != request.form.get("password2"):
            return apology(message="Both passwords must be the same")
        
        # hash the password the user inserted
        hashed_password = generate_password_hash(request.form.get("password1"))

        # store user information in sql database
        try:
            rows = db.execute(
                "INSERT INTO users (email, password) VALUES (?,?)", request.form.get("email"), hashed_password
            )
        except ValueError:
            return apology(message="Mail alredy exists")
            
        # return user to login form
        return redirect("/")

# define route for log out
@app.route("/logout", methods=["POST"])
def logout():
    # forget user id:
    session.clear()

    # return to initial page
    return render_template("home.html")

# define route for apology
@app.route('/apology/<int:code>/<message>')
def apology(code=404, message="An Error Ocurred"):
    return render_template("apology.html", code=code, message=message)