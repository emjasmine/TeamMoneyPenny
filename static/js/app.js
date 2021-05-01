/****************************************************************
            Declare variables for use in functions
****************************************************************/
// for pieChart
var X_tkrsymb = [ ];
var Y_revenue = [ ];
var colorscale = [];

// set all variables to zero for empty gauge
var dollar_min = 0;
var remaining_amount = 0;
// plotly requires arbitrary amount for range to crete an empty gauge
var spend_amount = 50;

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
pieChart(X_tkrsymb, Y_revenue)
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
/************************* if dark mode syle changes *************************/
function darkModeStyles(title, h, w) 
{
    var layout = 
    {
        title: title,
        width: 600, 
        height: 500,
        paper_bgcolor: "rgba(0,0,0,.3)",      
        font: 
        {
            size: 18,
            color: 'white',
        },
    }

    return layout
}
/************************* dynamic color generator *************************/
function colorGenerator()
{
    var random = Math.random();
    var red = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
    var green = Math.floor(Math.random() * (132 - 99 + 1) ) + 99;
    var blue = 255
    var color = `rgb(${red},${green},${blue})`
    colorscale.push(color)
    console.log(color)
    return color
}
/************************* Pie Chart *************************/
function pieChart(x,y,colors) 
{
    var title = "My Portfolio"
    var data = [{
        values: x,
        labels: y,
        pull: .1,
        marker: 
        {
            colors: colors,
            line: 
            {
                color: 'white',
                width: 1.5,
            }
        },
        textinfo: "label",
        hoverinfo: 'percent',
        hole: .3,
        type: 'pie',
      }];
<<<<<<< HEAD
    var layout = darkModeStyles(title)

    var config = {responsive: true}
=======
      
      var layout = {
        height: 600,
        width: 500
      };
>>>>>>> 5b957909b57d61e2b1faac6138993fa7a6b7aa02

//Add chart to empty div
Plotly.newPlot('pie-chart', data, layout, config);
}
/************************* Gauge *************************/
function gauge(remaining_amount, spend_amount)
{
    console.log(`GuageFunc Triggered. RemainaingAmt: ${remaining_amount}`)
    var low = spend_amount/ 3
    var mid = spend_amount - low

    // console.log(`Spend Amount ${spend_amount}`)
    var title = "Remaining Amount ($)"
    var data = 
    [{
        value: remaining_amount,
        number: { prefix: "$", valueformat: '.' + 2 + 'f'},
        type: "indicator",
        mode: "gauge+number", 
        delta: { reference: spend_amount },
        gauge: 
        { 
            axis: { range: [0, spend_amount] }, 
            bar:{color:'#5e5f82'},
            steps: [
                { range: [0, low], color: "#cc3502" },
                { range: [low, mid], color: "#ebe015" },
                { range: [mid, spend_amount], color: "green" }
              ],
        }
    }];
    var config = {responsive: true}
    var layout = darkModeStyles(title)
    //Add gauge to empty div
    Plotly.newPlot('gauge', data, layout);
}
/************************* getStocks_event *************************/
function getStocks_event()
{
    spend_amount2remaining_amount()
    //Create filtered stocks table
    filterTable(stockdata, remaining_amount);
    // Call gauge function
    gauge(remaining_amount, spend_amount, dollar_min);
    console.log(`get stocks event triggered remaining amount:${remaining_amount}`)
    colorscale.length = 0;
    X_tkrsymb.length = 0;
    Y_revenue.length = 0;
    pieChart(Y_revenue,X_tkrsymb,colorscale)
}
/************************* use remaining amount to filter Data *************************/
function filteredData(anyData, anyAmount) 
{
var filtered_data = anyData;
// console.log(`filterTable function Resuts: ${filtered_data}`)

// compare the stocks data to the remaining amount
filtered_data = filtered_data.filter(stock => stock.close <= anyAmount)
// console.log(`filterData function Resuts: ${filtered_data}`)

return filtered_data
}
/************************* build the table with filteredData *************************/
function filterTable(anyData) 
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
            row.append("td").html('<input type="number" class="stockQty" name="stockQty" min="0" max="1000000" value="0" step="1">');
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
    // user enters a qty on ticker row
    d3.selectAll('.tkr_row').on('change', qtyInput_event)
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
}
/*************************** turn spend_amount into remaining_amount ***************************************/
function spend_amount2remaining_amount()
{
    // redefine spend_amount on user input
    spend_amount = parseFloat(dollars_input.property('value')).toFixed(2);
    console.log(`spend_amount2remaining_amount spend_amount: ${spend_amount}`)

    // if the spend_amount is blank or zero then do nothing
    if (spend_amount === '0.00' || spend_amount === undefined || spend_amount === '0') 
        {
            console.log("no spend amount error or tool tip here")
        }
    // if the field is not blank filter table based on remaining amount
    else 
    {
        // set remaining amount to spend amount for full gauge & inital filter value
        remaining_amount = parseFloat(spend_amount);
        console.log(`spend_amount2remaining_amount remaining_amount: ${remaining_amount}`)
    }
    return [remaining_amount, spend_amount];
}
/************************* qty * price - remainaing amount *************************/
function adjustRemaining_Amount(stockQty,price) 
{
    // subtract (stockQty * price) from remaining_amount
    remaining_amount = remaining_amount - (stockQty * price)
    console.log(`New remaining_amount: ${remaining_amount}`)
    return remaining_amount
}
/************************* qtyInput_event *************************/
function Revenue(stockQty,div_rate)
{
    //calculate the revenue for pieChart
    var revenue = parseFloat(stockQty) * parseFloat(div_rate)
    Y_revenue.push(revenue)
    console.log(`Revenue stockQty: ${stockQty}`)
    console.log(`Revenue div_rate: ${div_rate}`)
    console.log(`Revenue: ${revenue}`)
    return revenue
}
/************************* qtyInput_event *************************/
function qtyInput_event(remaining_amount) 
{
    console.log('qtyInput_event triggered')

    // grab row values only on the row that was changed
    var stockQty = d3.select(this).select('.stockQty').property('value')
    console.log(`stockQty was entered: ${stockQty}`)
    var price = d3.select(this).select('.price').text()
    var div_rate = d3.select(this).select('.divRate').text()
    var tkr_symb = d3.select(this).select('.tkrSymbol').text()
    var roi = d3.select(this).select('.returnRate').text()
    console.log(`div_rate: ${div_rate}`)
    //create a color for this item
    colorGenerator()
    // push calculations to arrays for pieChart axis
    X_tkrsymb.push(tkr_symb)
    // call function to calculate the revenue for pieChart
    Revenue(stockQty,div_rate)
    // Call pieChart function to add the x & y values according to new lists
    pieChart(Y_revenue,X_tkrsymb,colorscale)
    console.log(colorscale)
    console.log(Y_revenue)
    // call function to subtract (stockQty * price) from remaining_amount
    remaining_amount = adjustRemaining_Amount(stockQty,price,remaining_amount)
    // Call Filter Table function to filter table based on new remaining amount
    filterTable(stockdata, remaining_amount)
    // Call Gauge function to move gauge down according to new remaining amount
    gauge(remaining_amount, spend_amount)
}

}) // end .then function






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
