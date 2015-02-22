#include <DHT22.h>
#include <stdio.h>
#define DHT22_PIN 7

DHT22 myDHT22(DHT22_PIN);
unsigned long starttime;

int sensorPinAudio = A0; // select the input pin for the potentiometer
int sensorValueAudio = 0;  // variable to store the value coming from the sensor

int sensorPinTemp = A1; // select the input pin for the potentiometer
float sensorValueTemp = 0;  // variable to store the value coming from the sensor

void setup(){
  Serial.begin(9600);
  starttime = millis();//get the current time;

}
void loop(){
  
 DHT22_ERROR_t errorCode;
 errorCode = myDHT22.readData();
 
 if (errorCode==DHT_ERROR_NONE){  
  String HumidityCom="Hum:";
  String comStringHumidity= HumidityCom+myDHT22.getHumidity();
  String TempCom="Tem:";
  String comStringTemp = TempCom+myDHT22.getTemperatureC();
  Serial.println(comStringTemp);
  Serial.println(comStringHumidity);
}
  
  //read the value from the sensor:
  sensorValueAudio = analogRead(sensorPinAudio); 
  
  
  sensorValueTemp = analogRead(sensorPinTemp); 
  float tempVoltage=sensorValueTemp/1024*5;  
  float temperatureReading=tempVoltage*17.50-10;
 
  //String valueStringAudio =  String(sensorValueAudio);  
  //String valueStringTemp =  String(sensorValueTemp);  
  //String comStringAudio =  String("Audio:"+sensorValueAudio);  
  //String comStringTemp =  String("Temp:"+sensorValueTemp);  
  
  
  String AudioCom="Aud:";
  String comStringAudio= AudioCom+sensorValueAudio;
  //String TempCom="Tem:";
  //String comStringTemp= TempCom+temperatureReading;
  
  Serial.println(comStringAudio);
 // Serial.println(comStringTemp);
 int sensorValuePollution=readConcentration();
 String PollutionCom="Pol:";
 String comStringPol= PollutionCom+sensorValuePollution;
 if (sensorValuePolution!=0)
   Serial.println(comStringPol);
  delay(5000);
}
int readConcentration(){
/* Grove - Dust Sensor Demo v1.0
 Interface to Shinyei Model PPD42NS Particle Sensor
 Program by Christopher Nafis 
 Written April 2012
 
 http://www.seeedstudio.com/depot/grove-dust-sensor-p-1050.html
 http://www.sca-shinyei.com/pdf/PPD42NS.pdf
 
 JST Pin 1 (Black Wire)  => Arduino GND
 JST Pin 3 (Red wire)    => Arduino 5VDC
 JST Pin 4 (Yellow wire) => Arduino Digital Pin 8
 */

int pin = 8;
unsigned long duration;
unsigned long starttime;
unsigned long sampletime_ms = 30000;//sampe 30s ;
unsigned long lowpulseoccupancy = 0;
float ratio = 0;
float concentration = 0;


  duration = pulseIn(pin, LOW);
  lowpulseoccupancy = lowpulseoccupancy+duration;

  if ((millis()-starttime) > sampletime_ms)//if the sampel time == 30s
  {
    ratio = lowpulseoccupancy/(sampletime_ms*10.0);  // Integer percentage 0=>100
    concentration = 1.1*pow(ratio,3)-3.8*pow(ratio,2)+520*ratio+0.62; // using spec sheet curve
    lowpulseoccupancy = 0;
    starttime = millis();
  }
  return concentration;
}
