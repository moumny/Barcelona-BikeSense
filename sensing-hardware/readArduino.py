import serial
import json
import urllib2
from time import time


def post(measurements):
	try:
		req = urllib2.Request("http://bikesenseapi.mybluemix.net/measurements")
		req.add_header("Content-Type", "Application/json")
		response = urllib2.urlopen(req, json.dumps(measurements))
		print response
		return True	
	except:
		return False

measurements = []

ser=serial.Serial('/dev/ttyACM0',9600)
ser.flushInput()
while 1 :
	line = ser.readline().strip();
	print 
	dataType=line[0:3]
	print "data type es: " + dataType
	value=line[4:]

	if dataType=="Aud":
		typeString="Audio"
	elif dataType=="Tem":
		typeString="Temperature"
	elif dataType=="Hum":
		typeString="Humidity"
	elif dataType=="Pol":
		typeString="Pollution"
	else:
		typeString="Unknown"

	m = {"userId": "user", 
	     "sensortype": typeString,
	     "sensor_value": float(value),
             "timestamp": int(time())}
	measurements.append(m)
	print m
	if len(measurements) > 5 and post(measurements):
		measurements = []