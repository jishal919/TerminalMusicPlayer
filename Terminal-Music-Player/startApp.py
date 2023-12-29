import requests
from flask import Flask ,render_template , request
import datetime
import json
import os
#hello
app = Flask(__name__)

@app.route('/')
def home():
    return render_template("HomePage.html")

@app.route('/home')
def test():
    return 'Hey there! i\'m Terminal \nVisit : <a href="https://terminal-cloud.vercel.app/">Terminal</a>'
    
@app.route("/radio",methods = ['GET'])
def musicplayer():
    return render_template("RADIO.html")

@app.route("/night",methods = ['GET'])
def night():
    return render_template("night.html")
    
@app.route("/kpop",methods = ['GET'])
def kpop():
    return render_template("kpop.html")

@app.route("/malayalam",methods = ['GET'])
def malayalam():
    return render_template("malayalam.html")

@app.route("/moodbooster",methods = ['GET'])
def moodbooster():
    return render_template("moodbooster.html")

@app.route("/kick",methods = ['GET'])
def kick():
    return render_template("kick.html")

@app.route('/maintenance')
def maintenance():
    return render_template("maintanance.html")

@app.route('/about')
def about():
    return 'About'

if __name__ == '__main__':
    app.run(debug=True)
