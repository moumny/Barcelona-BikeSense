window.onload = function() {
       var vizjson = 'http://moumny.cartodb.com/api/v2/viz/d67864b2-b9e5-11e4-ac53-0e9d821ea90d/viz.json';
       // var vizjson = 'viz.json';
        cartodb.createVis('map', vizjson);


/////// Chart /////////////////////////////////////////////////////////////////////////

    init();
trip = "Sun Feb 22 2015";

$("#showTemperatureChart").on("click", function(evt){
      $("#chartSelector .btn").removeClass("btn-info").addClass("btn-default");
     $(evt.target).addClass("btn-info");
     requestData("temperature", function(result){
         sensorCallback(result, "Temperature", "°C");
     });
});

$("#showPollutionChart").on("click", function(evt){
     $("#chartSelector .btn").removeClass("btn-info").addClass("btn-default");
     $(evt.target).addClass("btn-info");
     requestData("pollution", function(result){
         sensorCallback(result, "Pollution", "PM");
     });
});

$('#showHumidityChart').on("click", function(evt){
     $("#chartSelector .btn").removeClass("btn-info").addClass("btn-default");
     $(evt.target).addClass("btn-info");
     requestData("humidity", function(result){
         sensorCallback(result, "Humidity", "%");
     });
});
$("#showNoiseChart").on("click", function(evt){
     $("#chartSelector .btn").removeClass("btn-info").addClass("btn-default");
     $(evt.target).addClass("btn-info");
     requestData("audio", function(result){
         sensorCallback(result, "Noise", "dB");
     });
});

     }
var init = function(){
    requestData("temperature", function(result){
         sensorCallback(result, "Temperature", "°C", "Sun Feb 22 2015");
         var trips = [
            {
                name: "Sun Feb 22 2015",
                value:"Sun Feb 22 2015",
            },
            {
                name:"Sat Feb 21 2015",
                value: "Sat Feb 21 2015",
                subitems: [
                  ]
            }];
         $.each(trips, function(){
            $("<option />")
            .attr("value", this.value)
            .html(this.name)
            .appendTo("#tripselector");
        });
        $("#tripselector").change(function(){
            trip = $(this).val();
            sensorCallback(result, "Temperature", "°C", trip);
        }).change();
     });
}
var requestData = function(type, callback){

    var temperatureUrl = 'https://a7673287-7829-48d0-9f19-1e5427c6111f-bluemix.cloudant.com/measurements/_design/temperature/_view/new-view?include_docs=true';
$.ajax({
          type: "GET",
          //url: "https://a7673287-7829-48d0-9f19-1e5427c6111f-bluemix.cloudant.com/measurements/_all_docs?include_docs=true",

          url:'https://a7673287-7829-48d0-9f19-1e5427c6111f-bluemix.cloudant.com/measurements/_design/temperature/_view/'+type+'?include_docs=true',
          dataType: 'jsonp',

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

sensorCallback = function(result, chartTitle, units){
    var sensorData = [];
        var data = result.rows.map(
          function(obj){
            var val = obj.value.sensor_value;
            var latt = obj.value.lat;// + (0.1 * Math.random());
            var lon = obj.value.lon; //+ (0.1 * Math.random());
            var t = obj.value.timestamp;
            var timestamp= new Date(t*1000)
            if(timestamp.toDateString() == trip)
                sensorData.push([t*1000, val]);
         }
        );
        plotting(sensorData, chartTitle, units);
      };
          

       

