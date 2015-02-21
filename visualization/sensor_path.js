
// Prepare data url from couchdb


// Import data to CartoDB
//curl -v -H "Content-Type: application/json" -d '{"url":"https://examplehost.com/sample.csv"}' 
//"https://documentation.cartodb.com/api/v1/imports/?api_key=ec2a603b19584bd7cf2338b370947852b6080927"`

// Display Map

window.onload = function() {
        var vizjson = 'http://moumny.cartodb.com/api/v2/viz/d67864b2-b9e5-11e4-ac53-0e9d821ea90d/viz.json';
        cartodb.createVis('map', vizjson);


        var ctx = document.getElementById("chart").getContext("2d");
		ctx.canvas.width  = window.innerWidth;

		var data = {
    		labels: ["January", "February", "March", "April", "May", "June", "July"],
    		datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
	};

	var options = null;
	var myLineChart = new Chart(ctx).Line(data, options);

    }

