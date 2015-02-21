#!flask/bin/python
import json
import sys
import os
import logging
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


@app.route('/')
def index():
    logger.warning("hit!")
    return "Hello, World!"


@app.route('/measurements', methods=['GET'])
def list_measurements():
    logger.debug(os.environ["VCAP_SERVICES"])
    j = json.loads(os.environ["VCAP_SERVICES"])
    return "Nothing here"


@app.route('/measurements', methods=['POST'])
def add_measurement():
    content = request.get_json(force=True)
    logger.debug(content)
    return "Written!"


if __name__ == '__main__':
    # Read port selected by the cloud for our application
    PORT = int(os.getenv('VCAP_APP_PORT', 8000))
    app.run(host='0.0.0.0', debug=True, port=PORT)
