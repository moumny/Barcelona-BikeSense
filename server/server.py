#!flask/bin/python
import json
from random import random
import sys
import os
import logging
import cloudant
from cartodb import CartoDBAPIKey, CartoDBException
from flask import Flask, request

app = Flask(__name__)
root = logging.getLogger()
root.setLevel(logging.DEBUG)

ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
root.addHandler(ch)
logger = logging.getLogger(__name__)

j = json.loads(os.environ["VCAP_SERVICES"])
url = j[u'cloudantNoSQLDB'][0][u'credentials'][u'url']

db = cloudant.Database(url)
doc = db['measurements']

api_key = os.environ["API_KEY"]
cartodb_domain = 'moumny'
cl = CartoDBAPIKey(api_key, cartodb_domain)

@app.route('/')
def index():
    logger.warning("hit!")
    return "Hello, World!"


@app.route('/measurements', methods=['GET'])
def list_measurements():
    return "Nothing here"


@app.route('/measurements', methods=['POST'])
def add_measurement():
    global lat
    global lon
    content = request.get_json(force=True)
    logger.debug(content)
    for m in content:
        try:
            if m["sensortype"] == "position":
                lat = m["data"]["Latitude"]
                lon = m["data"]["Longitude"]
            else:
                m["lat"] = lat + random() - 0.5
                m["lon"] = lon + random() - 0.5
                logging.debug(cl.sql(
                    'insert into test(timestamp, sensortype, sensor_value, the_geom) values (%d, \'%s\', %d, ST_SetSRID(ST_Point(%f, %f),4326));'
                    % (m["timestamp"], m["sensortype"], m["sensor_value"], m["lon"], m["lat"])))
            resp = doc.post(params=m)
            logger.debug(resp.json())
        except Exception, e:
            logger.warning("Invalid measurement: %s %s" % (m, e))
    return "Written!"


if __name__ == '__main__':
    # Read port selected by the cloud for our application
    PORT = int(os.getenv('VCAP_APP_PORT', 8000))
    app.run(host='0.0.0.0', debug=True, port=PORT)
