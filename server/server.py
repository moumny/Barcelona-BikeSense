#!flask/bin/python
from Queue import PriorityQueue, Empty
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

awaiting = PriorityQueue(maxsize=10 ** 7)


@app.route('/')
def index():
    logger.warning("hit!")
    return "Hello, World!"


@app.route('/measurements', methods=['GET'])
def list_measurements():
    return "Nothing here"


def send_to_carto(m):
    logging.debug("sent to carto %s" % cl.sql(
        'insert into test(timestamp, sensortype, sensor_value, the_geom) values (%d, \'%s\', %d, ST_SetSRID(ST_Point(%f, %f),4326));'
        % (m["timestamp"], m["sensortype"], m["sensor_value"], m["lon"], m["lat"])))


def send_to_cloudant(m):
    resp = doc.post(params=m)
    logger.debug(resp.json())


@app.route('/measurements', methods=['POST'])
def add_measurement():
    global awaiting
    content = request.get_json(force=True)
    logger.debug(content)
    for m in content:
        try:
            if m["sensortype"] == "position":
                lat = m["data"]["Latitude"]
                lon = m["data"]["Longitude"]
                ts = m["data"]["timestamp"]
                m["timestamp"] = ts
                send_to_cloudant(m)
                try:
                    _, m = awaiting.get_nowait()
                    while m["timestamp"] < ts:
                        m["lat"] = lat
                        m["lon"] = lon
                        send_to_carto(m)
                        send_to_cloudant(m)
                        _, m = awaiting.get_nowait()
                    m["lat"] = lat
                    m["lon"] = lon
                    send_to_carto(m)
                    send_to_cloudant(m)
                except Empty, e:
                    logging.exception("empty")
            else:
                awaiting.put_nowait((m["timestamp"], m))

        except Exception, e:
            logging.exception("invalid measurement %s", m)
            # logger.warning("Invalid measurement: %s %s" % (m, e.message))
    logger.debug("waiting: %d", awaiting.qsize())
    return "Written!"


if __name__ == '__main__':
    # Read port selected by the cloud for our application
    PORT = int(os.getenv('VCAP_APP_PORT', 8000))
    app.run(host='0.0.0.0', debug=True, port=PORT)
