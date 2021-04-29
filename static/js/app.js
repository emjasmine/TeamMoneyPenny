/****************************************************************
            Declare variables for use in functions
****************************************************************/
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

// Identify user amount input field
var dollars_input = d3.select('#spend-amount');

// Identify button for change event
var getStocks_button = d3.select('#get-stocks')

// Identify ticker row for stock data
var qtyInput_row = d3.selectAll('.tkr_row')
 // Identify reset button for change event
 var reset_button = d3.select('#reset')

/****************************************************************
                Fetch data from JSON file
****************************************************************/
//json path
const path = "../static/data/openClose.json"

// quandl & polygon combo json
d3.json(path).then(stockdata => 
{ 

/****************************************************************
                        User Interactions
****************************************************************/

// user enters a spend amount
dollars_input.on('change', dollarsNotInt)

// user clicks get stock button
getStocks_button.on('click', getStocks_event)

// user enters a qty on ticker row
// qtyInput_row.on('input', qtyInput_event(remaining_amount))

// console.log(stockdata)

//on click remaining amount = spend amount, gauge resets back to full spend amount and table 
//shows all stock data again, and bar graph goes back to empty
reset_button.on('click', getStocks_event) 
/****************************************************************
                        On page load
****************************************************************/
// check .json results 
console.log(stockdata[0]);
//Create ALL stocks table
allStocksTable(stockdata) 
barChart(X_tkrsymb, Y_divtimesqty)
gauge(remaining_amount, spend_amount, dollar_min)

/****************************************************************
                        FUNCTIONS
****************************************************************/

/************************* Create All data table *************************/
function allStocksTable(anyData) 
{
    // refrence the table body to build table in 
    var tbody = d3.select('.stock-table-body');
   
    // Use for each to create a table with ALL the data
    anyData.map(stock => 
    {
        // use data to define price and div amount for roi func
        var price = stock.close.toFixed(2)
        var divAmount = stock['Amount ($)']
        //Append a tr to the table body tag
        var row = tbody.append('tr');
        // Append td.text  for each info column
        // qty col does not currently contain input
        row.append("td").text('');
        // tkr symbol col
        row.append("td").text(stock.symbol);
        // company name
        row.append("td").text(stock.Name);
        // stock price
        row.append("td").text(price);
        // dividend rate
        row.append("td").text(`$${divAmount}`);
        // rate of return
        row.append("td").text(`${ROI(price, divAmount)}`);
    });
}

/************************* calculate rate of return for table *************************/
function ROI(price, divAmount) 
{
    // check to see if stock returns a div amount
    if (divAmount === '' || divAmount === undefined || divAmount === null) 
    {
        var roi = 'No dividends paid'
    }
    else
    {
        var roi = ((parseFloat(divAmount) / parseFloat(price))*100)
    }
    // console.log([divAmount, price, roi])
    return roi
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
    console.log(`GuageFunc Triggered. RemainaingAmt: ${remaining_amount}`)
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

/************************* getStocks_event *************************/
function getStocks_event()
{
    console.log('get stocks event triggered')

    var returnValues = spend_amount2remaining_amount()
    var remaining_amount = returnValues[0]
    var spend_amount = returnValues[1]
    //Create filtered stocks table
    filterTable(stockdata, remaining_amount);
    // Call gauge function
    gauge(remaining_amount, spend_amount, dollar_min);
}

/************************* use remaining amount to filter Data *************************/
function filteredData(anyData, remaining_amount) 
{
var filtered_data = anyData;
// console.log(`filterTable function Resuts: ${filtered_data}`)

// compare the stocks data to the remaining amount
filtered_data = filtered_data.filter(stock => stock.close <= remaining_amount)
// console.log(`filterData function Resuts: ${filtered_data}`)

return filtered_data
}

/************************* build the table with filteredData *************************/
function filterTable(anyData, remaining_amount) 
{
    // refrence the table body to build table in 
    var tbody = d3.select('.stock-table-body');
    // bring in data filtered by remaining amount
    var filtered_data = filteredData(anyData,remaining_amount)
    // console.log(`filterTable function Resuts: ${filtered_data}`)

    // Return an error msg if filter function returns no tickers price less than or equal to remaining amount
    if (filtered_data.length === 0 )
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
        filtered_data.forEach(stock => 
        {
            // use data to define price and div amount for roi func
            var price = stock.close
            var divAmount = stock['Amount ($)']
            //Append a tr to the table body tag
            var row = tbody.append('tr').classed('tkr_row', true);
            // qty col now contains an input area
            row.append("td").html('<input type="number" class="stockQty" name="stockQty" min="0" max="1000000" value="0" step="1" onchange="qtyInput_event(this)">');
            // tkr symbol col
            row.append("td").text(stock.symbol).classed('tkrSymbol', true);
            // company name
            row.append("td").text(stock.Name).classed('coName', true);
            // stock price
            row.append("td").text(price).classed('price', true);
            // dividend rate
            row.append("td").text(divAmount).classed('divRate', true);
            // rate of return
            row.append("td").text(`${ROI(price, divAmount)}`).classed('returnRate', true);
        });
    }
}

/************************* Set input field always has 2 decimals *************************/
function dollarsNotInt(event) 
{
    let value = parseFloat(d3.select(this).property('value'));
    if (Number.isNaN(value)) 
    {
      document.getElementById('spend-amount').value = "0.00";
    } 
    else 
    {
      document.getElementById('spend-amount').value = value.toFixed(2);
    }      
    console.log(value)         
}

}) // end .then function

/*************************** turn spend_amount into remaining_amount ***************************************/
function spend_amount2remaining_amount()
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
    }
    return [remaining_amount, spend_amount];
}

/************************* qtyInput_event *************************/
function qtyInput_event(remaining_amount) 
{
    console.log('get stocks event triggered')
    // **this function does not separate one click from 2 clicks**
    //pull values returned from previous function
    // var returnValues = [spend_amount2remaining_amount()]
    // // grab only remaining_amount from array return
    // var remaining_amount = Math.round(parseFloat(returnValues[0]),2)
    

    // // grab row values only on the row that was changed
    var stockQty = parseFloat(this.d3.select('.stockQty').property('value'))
    console.log(`stockQty was entered: ${stockQty}`)
    var price = parseFloat(this.d3.select('.price').text())
    var div_rate = parseFloat(this.d3.select('.divRate').text())
    var tkr_symb = this.d3.select('.tkrSymbol').text()
    var return_rate = parseFloat(this.d3.select('.returnRate').text())

    // call function to subtract (input value * price) from remaining_amount
    
    // call function to calculate the revenue for barchart (qty * divrate)
        // push calculations to arrays for barchart axis
        // X_tkrsymb.push(tkr_symb)
        // console.log(`Ticker symbol: ${tkr_symb}`)
        // Y_divtimesqty.push(revenue)
        // console.log(Y_divtimesqty)

    // // Call Filter Table function to filter table based on new remaining amount
    // // filterTable(data, remaining_amount)

    // // Call Gauge function to move gauge down according to new remaining amount
    // // Call barchart function to add the x & y values according to new lists
    // barChart(X_tkrsymb, Y_divtimesqty)
    
}




// /********** Radial Chart - Top 10 Stock *****************/ 
// //Identify the Top 10 Stock by dividend amount
//     //Sort openClose data by dividend in descending order
//     //Grap the first 10 and place in list
//     //format should be ticker: tck_symbol, dividend:div_rate
//     Top_10 = []

//     // radial chart plot
//     chart = {
//         const svg = d3.select(bubble-graph.svg(width, height))
//             .attr("viewBox", `${-width / 2} ${-height * 0.69} ${width} ${height}`)
//             .style("width", "100%")
//             .style("height", "auto")
//             .style("font", "10px sans-serif");
      
//         svg.append("g")
//           .selectAll("g")
//           .data(d3.stack().keys(data.columns.slice(1))(data))
//           .join("g")
//             .attr("fill", d => z(d.key))
//           .selectAll("path")
//           .data(d => d)
//           .join("path")
//             .attr("d", arc);
      
//         svg.append("g")
//             .call(xAxis);
      
//         svg.append("g")
//             .call(yAxis);
      
//         svg.append("g")
//             .call(legend);
      
//         return svg.node();
//       }
