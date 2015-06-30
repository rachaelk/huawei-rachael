from flask import Flask, request, session, g, redirect, url_for, \
	abort, render_template, flash, jsonify
from sqlalchemy import create_engine, case
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import json
from geoalchemy2.functions import GenericFunction
from geoalchemy2 import func
from geojson import Feature, FeatureCollection, dumps



import models
from models import Weather, BlockGroup, BikeStation, BikeRide, \
	SubwayStation, SubwayDelay, Location, Base

DEBUG = True
SECRET_KEY = 'develop'
USERNAME = 'admin'
PASSWORD = 'password'

engine = create_engine('postgresql://localhost/dc', convert_unicode=True)
db_session = scoped_session(sessionmaker(
	autocommit=False,
	autoflush=False,
	bind=engine
))


engine_map = create_engine('postgresql://localhost/osm', convert_unicode=True)
map_session = scoped_session(sessionmaker(
	autocommit=False,
	autoflush=False,
	bind=engine_map
))




app = Flask(__name__)
app.config.from_object(__name__)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

@app.route('/', methods=['GET', 'POST'])
def index():
	return render_template('index_.html')

# For future ref:
# @app.route('/start', methods=['POST'])
# def get_counts():
#     # get url
#     data = json.loads(request.data.decode())
#     url = data["url"]
#     # form URL, id necessary
#     if 'http://' not in url[:7]:
#         url = 'http://' + url
#     # start job
#     job = q.enqueue_call(
#         func=count_and_save_words, args=(url,), result_ttl=5000
#     )
#     # return created job id
#     return job.get_id()
@app.route('/data', methods=['GET', 'POST'])
def pull_data():
	w = db_session.query(Weather).first()
	return jsonify({
		'temp': w.temperature,
		'hum': w.humidity,
		'precip': w.precipitation,
		'datetime': w.datetime.isoformat(),
		'snow': w.snow
	})

@app.route('/data/weather', methods=['GET', 'POST'])
def get_data():
	w = db_session.query(Weather).first()
	return jsonify({
		'temp': w.temperature,
		'hum': w.humidity,
		'precip': w.precipitation,
		'datetime': w.datetime.isoformat()
	})


@app.route('/data/blockGroups', methods=['GET', 'POST'])
def get_blocks():
	groups = db_session.query(BlockGroup);
	rets = []
	for g in groups:
		geom_b = json.loads(db_session.scalar(g.basic.ST_AsGeoJSON()))
		geom_t = json.loads(db_session.scalar(g.tiger.ST_AsGeoJSON()))
		feature = Feature(
			id=g.id,
			block_group = g.block_group,
			geometry_basic=geom_b,
			geometry_tiger=geom_t,
			properties={
				'state': g.state,
				'county': g.county,
				'tract': g.tract,
				'geo_id': g.geo_id,
				'census_data': g.census_data
			}
		)
		rets.append(feature)
	return jsonify(FeatureCollection(rets));

@app.route('/data/bikeStations', methods=['GET', 'POST'])
def getbikeStations():
	st = db_session.query(BikeStation);
	rets = []
	for s in st:
		geom = json.loads(db_session.scalar(s.geom.ST_AsGeoJSON()))
		feature = Feature(
			id=s.id,
			geometry=geom,
			properties={
				'name': s.name
			}
		)
		rets.append(feature)
	return jsonify(FeatureCollection(rets));


	

@app.route('/data/bikeRides', methods=['GET', 'POST'])
def get_bikeRides():
	rides = db_session.query(BikeRide)
	rets = [];
	for r in rides:
		feature = Feature(
			id = r.id,
			properties ={
				'duration': r.duration,
				'start_date':r.start_date,
				'end_date': r.end_date,
				'subscribed': r.subscribed,
				'start_station_id':r.start_station_id,
				'end_station_id':r.end_station_id,
				#'start_station':r.start_station,
				#'end_station':r.end_station
			}
		)
		rets.append(feature)
	return jsonify(FeatureCollection(rets))
	

@app.route('/data/subwayStations', methods=['GET', 'POST'])
def get_subwayStations():
	ss = db_session.query(SubwayStation)
	rets = []
	for s in ss:
		geom = json.loads(db_session.scalar(s.geom.ST_AsGeoJSON()))
		feature = Feature(
			id = s.id,
			geometry = geom,
			properties ={
				'name': s.name,
				'lines': s.lines,
				'delays': s.delays
			}
		)
		rets.append(feature)
	return jsonify(FeatureCollection(rets))


@app.route('/data/subwayDelays', methods=['GET'])
def get_delays():
	sd = db_session.query(SubwayDelay);
	rets = [];
	for s in sd:
		feature = Feature(
			id = s.id,
			properties ={
				'date': s.date,
				'duration': s.duration,
				'station_id': s.station_id
			}
		)
		rets.append(feature)
	return jsonify(FeatureCollection(rets))


@app.route('/data/locations', methods=['GET'])
def get_locations():
	loc = db_session.query(Location)
	rets = []
	for l in loc:
		geom = json.loads(db_session.scalar(l.geom.ST_AsGeoJSON()))
		feature = Feature(
			id = l.id,
			geometry = geom,
			properties ={
				'name': l.name,
				'rank': l.rank,
				'rating': l.rating,
				'review_count': loreview_count,
				'address': l.address,
				'cat': l.categories
			}
		)
		rets.append(feature)
	return jsonify(FeatureCollection(rets))


if __name__ == '__main__':
	app.run()
