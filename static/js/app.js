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
});

/****************************************************************
                        User Interactions
****************************************************************/

// Identify user input field
var dollars_input = d3.select('#spend-amount');

// Identify button for change event
var getStocks_button = d3.select('#get-stocks')

getStocks_button.on('click', getStocks_event)

var qtyInput_row = d3.selectAll('.tkr_row')

// qtyInput_row.on('input', qtyInput_event(remaining_amount))

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
    // console.log(`Remaining Amount ${remaining_amount}`)
    // console.log(`Spend Amount ${spend_amount}`)
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
        width: 400, 
        height: 300, 
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
function filterTable(data, remaining_amount) 
{
    // refrence the table body to build table in 
    var tbody = d3.select('.stock-table-body');
    
    var filteredData = data[0].datatable.data;

    filteredData = filteredData.filter(stock => stock[3] <= remaining_amount)
    console.log(`filterTable function Resuts: ${filteredData}`)
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
            var row = tbody.append('tr').classed('tkr_row', true);
            // qty col now contains an input area
            row.append("td").html('<input type="number" class="stockQty" name="stockQty" min="0" max="1000000" value="0" step="1" onchange="qtyInput_event(this)">');
            // tkr symbol col
            row.append("td").text(stock[1]).classed('tkrSymbol', true);
            // company name
            row.append("td").text(stock[0]).classed('coName', true);
            // stock price
            row.append("td").text(stock[3]).classed('price', true);
            // dividend rate
            row.append("td").text(stock[2]).classed('divRate', true);
            // rate of return
            row.append("td").text(stock[4]).classed('returnRate', true);
        });
    } 
}// end entire function

/************************* getStocks_event *************************/
function getStocks_event() 
{
    console.log("get stock button click")

    // redefine spend_amount on user input
    var spend_amount = parseFloat(dollars_input.property('value')).toFixed(2);
    console.log(`getStocks_event spend_amount: ${spend_amount}`)

    // if the spend_amount is blank or zero then do nothing
    if (spend_amount === '0.00' || spend_amount === undefined || spend_amount === '0') 
        {
            console.log("no spend amount error or tool tip here")
        }
    // if the field is not blank filter table based on remaining amount
    else 
    {
        // set remaining amount to spend amount for full gauge & inital filter value
        var remaining_amount = Math.round(parseFloat(spend_amount),2);
        console.log(`getStocks_event remaining_amount: ${remaining_amount}`)

        // Call table filter function
        spydata.then(function (data) 
        {
            //Create filtered stocks table
            filterTable(data, remaining_amount);
            // Call gauge function
            gauge(remaining_amount, spend_amount, dollar_min);
        });

        return remaining_amount
    }
}

/************************* qtyInput_event *************************/
function qtyInput_event() 
{
    console.log(`Remaining Amount starts at: ${remaining_amount}`)
    // grab row values only on the row that was changed
    var stockQty = this.d3.select('.stockQty').property('value')
    console.log(`stockQty was entered: ${stockQty}`)
    var price = this.d3.select('.price').property('value')
    var div_rate = this.d3.select('.divRate').property('value')
    var tkr_symb = this.d3.select('.tkrSymbol').property('value')
    var return_rate = this.d3.select('.returnRate').property('value')

    // REdefine variable remaining_amount == remaining_amount - (Qty_entered * price) 
    // var remaining_amount = remaining_amount-(parseInt(stockQty)*parseInt(price))

    // console.log(`remaining_amount - (Price * Qty) = ${remaining_amount}`)
    // var revenue = Qty_entered * div_rate
    X_tkrsymb.push(tkr_symb)
    console.log(`Titker symbol: ${tkr_symb}`)
    Y_divtimesqty.push(price)
    console.log(`Return rate: ${price}`)
    // Call Filter Table function to filter table based on new remaining amount
    // Call Gauge function to move gauge down according to new remaining amount
    // Call barchart function to add the x & y values according to new lists
    barChart(X_tkrsymb, Y_divtimesqty)
    
}
