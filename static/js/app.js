/***************** Fetch data from JSON file *******************/
//json path
const path = "../static/js/sampledata.json"

// quandl & polygon combo json
var spydata = d3.json(path)

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

/****************************************************************
                        On page load
****************************************************************/
spydata.then(function (data) 
{
    // check .json results 
    console.log(data[0].datatable.data[0]);
    //Create ALL stocks table
    allStocksTable(data) 
    barChart(X_tkrsymb, Y_divtimesqty)
    gauge(remaining_amount, spend_amount, dollar_min)
}); // end .then statement
/****************************************************************
                        User Input
****************************************************************/

// Identify user input field
var dollars_input = d3.select('#spend-amount');

// Identify button for change event
var getStocks_button = d3.select('#get-stocks')

getStocks_button.on('click', getStocks_event)

/****************************************************************
                        FUNCTIONS
****************************************************************/

/************************* Create All data table *************************/
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

/************************* Bar Chart *************************/
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

/************************* Gauge *************************/
function gauge(remaining_amount, spend_amount, dollar_min)
{
    // check for zero dollar spend amount so that gauge doesnt error
    // if (parseInt(d3.select('#spend-amount').property('value')) === 0.00) 
    // {
    //     spend_amount = 50
    // } 
    // check values
    console.log(`Remaining Amount ${remaining_amount}`)
    console.log(`Spend Amount ${spend_amount}`)

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
        width: 300, 
        height: 225, 
        margin: 
        { 
            t: dollar_min, 
            b: spend_amount 
        } 
    };

    //Add gauge to empty div
    Plotly.newPlot('gauge', data, layout);
}

/************************* Set input field always has 2 decimals *************************/
function dollarsNotInt(event) 
{
    let value = parseFloat(event.value);
    if (Number.isNaN(value)) 
    {
      document.getElementById('spend-amount').value = "0.00";
    } 
    else 
    {
      document.getElementById('spend-amount').value = value.toFixed(2);
    }              
}

/************************* Check Spend amount is never zero for gauge *************************/
function checkSpendAmount(input) 
{
    // // make sure amount is float 2 decimals
    // var input = parseFloat(input).toFixed(2);
    // console.log(input)

    // // check for zero dollar spend amount so that gauge doesnt error
    //   if (input === 0.00) 
    //   {
    //     input = 50.00
    // error msg
    //   } 
    //   else 
    //   {
    //     input = parseFloat(input).toFixed(2) 
    //   }
}

/************************* Filter Table *************************/
function filterTable(data,remaining_amount) 
{
    // refrence the table body to build table in 
    var tbody = d3.select('.stock-table-body');
    var spydata = d3.json(path)
    
    var filteredData = data[0].datatable.data;
    console.log(filteredData)

    // run multiple if statements to check if field is blank or not

    // if the field is blank then do nothing
    if (remaining_amount === 0 || remaining_amount === undefined ) 
        {
            console.log("enter tool tip here")
        }
    // if the field is not blank filter table based on remaining amount
    else 
    {
        filteredData = filteredData.filter(stock => stock[3] <= remaining_amount)
        console.log(filteredData)

    // Return an error msg if filter function returns no tickers price less than or equal to remaining amount
    if (filteredData.length === 0 )
    {
        // clear all data rows
        tbody.html('');
        // create one row for error msg
        var row = tbody.append('tr');
        // append error msg
        row.append('td').attr("colspan", "6").text("I can see you're a penny pincher, but thats not enough money. Enter a larger amount to spend");
    }
    else
    {
        // clear all data rows
        tbody.html('');
        // Use for each to create a table with ALL the data
        filteredData.forEach(stock => 
        {
            //Append a tr to the table body tag
            var row = tbody.append('tr').html('<input type="number" id="stock-qty" name="stock-qty" min="0" max="1000000" value="0" step="1">');
            // qty col now contains an input area
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
    }

}// end entire function

/************************* getStocks_event *************************/
function getStocks_event() 
{
    console.log("button click")

    // redefine spend_amount on user input
    var spend_amount = parseFloat(dollars_input.property('value')).toFixed(2);
    console.log(spend_amount)

    // set remaining amount to spend amount for full gauge & inital filter value
    var remaining_amount = spend_amount;
    console.log(remaining_amount)

    // Call table filter function
    spydata.then(function (data) 
    {
        //Create filtered stocks table
        filterTable(data, remaining_amount);
        // Call gauge function
        gauge(remaining_amount, spend_amount, dollar_min);
    });
}

