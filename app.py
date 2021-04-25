# import dependancies
import numpy as np
import sqlalchemy
import json
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect, desc
from flask import Flask, jsonify, render_template
from operator import itemgetter

# Create sqlite database path
database_path = "russell_stock.db"

# Create an engine that can talk to the database
engine = create_engine(f"sqlite:///{database_path}")

# use engine to connect to existing tables/db
Database = automap_base( )
Database.prepare(engine, reflect=True)

# View all of the classes/tables that automap found
thing = Database.classes.keys()

# Save references to each table (capital because they are considered classes) 
Company = Database.classes.company
Dividend = Database.classes.dividend
Open_Close = Database.classes.open_close

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

# create the homepage with the links:
@app.route("/")
def welcome():

    # Create our session (link) from Python to the DB
    session = Session(bind=engine)

    return render_template('index.html')

@app.route("/calculator.html")
def calculator():
    return render_template('calculator.html')

engine.dispose()

if __name__ == '__main__':
    app.run(debug=True)