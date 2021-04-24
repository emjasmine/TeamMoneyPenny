/***************** Fetch data from JSON file *******************/
//json path
const path = "../static/js/sampledata.json"

// quandl & polygon combo json
var sampledata = d3.json(path)

/************************** On page load **************************************/

sampledata.then(function (sampledata) 
{
    console.log(sampledata[0].datatable.data[0]);
    //Create ALL stocks table
    allStocksTable(sampledata) 
    barChart(X_tkrsymb, Y_divtimesqty)
    gauge(remaining_amount, spend_amount, dollar_min)
});

/********** Declare variables for use in functions *******/

// for barchart
var X_tkrsymb = [ ];
var Y_divtimesqty = [ ];

// set all variables to zero for empty gauge
var dollar_min = 0;
var remaining_amount = 0;
// plotly requires arbitrary amount for range to crete an empty gauge
var spend_amount = 50;

// colors list rgb [ [low], [med], [high] ]
var colors = [[45, 160, 227], [152, 74, 255], [251, 43, 255]]

/************************* Function Create All data table *************************/
function allStocksTable(data) 
{
    // refrence the table body to build table in 
    var tbody = d3.select('.stock-table-body');
    // Use for each to create a table with ALL the data
    data[0].datatable.data.forEach(stock => 
    {
        //Append a tr to the table body tag
        var row = tbody.append('tr');
        // Append td.text  for each info column
        // qty col does not currently contain input
        row.append("td").text('');
        // tkr symbol col
        row.append("td").text(stock[1]);
        // company name
        row.append("td").text(stock[0]);
        // stock price
        row.append("td").text(stock[3]);
        // dividend rate
        row.append("td").text(stock[2]);
        // rate of return
        row.append("td").text(stock[4]);
    });
}

/************************* Function Bar Chart *************************/
function barChart(x,y) 
{
//Create a blank chart 
var data = 
[{ 
    x: x,
    y: y,
    type: 'bar',
    orientation: 'h'
}];

//Add chart to empty div
Plotly.newPlot('bar-chart', data);
}

/************************* Function gauge *************************/
function gauge(remaining_amount, spend_amount, dollar_min)
{
    var data = 
    [{
        value: remaining_amount,
        title: { text: "Remaining Amount ($)" },
        type: "indicator",
        mode: "gauge+number", 
        delta: { reference: spend_amount },
        gauge: 
        { 
            axis: { range: [0, spend_amount] } 
        }
    }];
    var layout = 
    {
        width: 600, 
        height: 500, 
        margin: 
        { 
            t: dollar_min, 
            b: spend_amount 
        } 
    };

    //Add gauge to empty div
    Plotly.newPlot('gauge', data, layout);
}

/************************* Function Filter Table *************************/