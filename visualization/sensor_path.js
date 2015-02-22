window.onload = function() {
        var vizjson = 'http://moumny.cartodb.com/api/v2/viz/d67864b2-b9e5-11e4-ac53-0e9d821ea90d/viz.json';
        cartodb.createVis('map', vizjson);

/////// Chart /////////////////////////////////////////////////////////////////////////
$("#showTemperatureChart").on("click", function(evt){
      $("#chartSelector .btn").removeClass("btn-info").addClass("btn-default");
     $(evt.target).addClass("btn-info");
     requestData("temperature", function(result){
         pollutionCallback(result, "Temperature", "°C");        
     });
});

$("#showPollutionChart").on("click", function(evt){
     $("#chartSelector .btn").removeClass("btn-info").addClass("btn-default");
     $(evt.target).addClass("btn-info");
     requestData("pollution", function(result){
         pollutionCallback(result, "Pollution", "PM");
     });
});
    
$('#showHumidityChart').on("click", function(evt){
     $("#chartSelector .btn").removeClass("btn-info").addClass("btn-default");
     $(evt.target).addClass("btn-info");
     requestData("humidity", function(result){
         pollutionCallback(result, "Humidity", "%");
     });
});
$("#showNoiseChart").on("click", function(evt){
     $("#chartSelector .btn").removeClass("btn-info").addClass("btn-default");
     $(evt.target).addClass("btn-info");
     requestData("audio", function(result){
         pollutionCallback(result, "Noise", "dB");
     });
});
    $("#showTemperatureChart").trigger("click");
     }

var requestData = function(type, callback){

    var temperatureUrl = 'https://a7673287-7829-48d0-9f19-1e5427c6111f-bluemix.cloudant.com/measurements/_design/temperature/_view/new-view?include_docs=true';
$.ajax({
          type: "GET",
          //url: "https://a7673287-7829-48d0-9f19-1e5427c6111f-bluemix.cloudant.com/measurements/_all_docs?include_docs=true",
    
          url:'https://a7673287-7829-48d0-9f19-1e5427c6111f-bluemix.cloudant.com/measurements/_design/temperature/_view/'+type+'?include_docs=true',
          username: "a7673287-7829-48d0-9f19-1e5427c6111f-bluemix",
            password: "77f13e7ce5da7d3439b3b149a190043961ebf44a3a3a11fb5a72e15f1b4601f7",
          xhrFields: {
            withCredentials: true
          },
          dataType: 'jsonp',
          data: {
           username: "a7673287-7829-48d0-9f19-1e5427c6111f-bluemix",
            password: "77f13e7ce5da7d3439b3b149a190043961ebf44a3a3a11fb5a72e15f1b4601f7",
          },
          crossDomain: true,
          success: callback
        });
}

var plotting = function(data, yAxis, yAxisFormat){
  $('#chart').highcharts({
        chart: {
                type: 'column'
            },
     
        xAxis: {
             type: 'datetime',
            reversed: false,
            title: {
                enabled: true,
                text: 'Time'
            },
            labels: {
            format: '{value:%H:%M:%S}',
            },
            maxPadding: 0.05,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: yAxis
            },
            labels: {
                formatter: function () {
                    return this.value + ' ' + yAxisFormat;
                }
            },
            lineWidth: 2
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{value:%H-%M-%S} : {point.y}' + yAxisFormat
        },
        plotOptions: {
            series: {
                    stacking: 'normal'
                }
        },
        series: [{
            name: yAxis,
            data:data,
            pointStart: Date.UTC(2013, 0, 1),
            pointInterval: 24 * 36e5
        }]
    });

}

pollutionCallback = function(result, chartTitle, units){
    var pollutionData = [];
        var data = result.rows.map(
          function(obj){
            var val = obj.value.sensor_value;
            var latt = obj.value.lat;// + (0.1 * Math.random());
            var lon = obj.value.lon; //+ (0.1 * Math.random());
            var t = obj.value.timestamp;
            var timestamp=Date.parse(t)

            pollutionData.push([t, val]);

            
        
         }
        );
        plotting(pollutionData, chartTitle, units);
      };
          

       

