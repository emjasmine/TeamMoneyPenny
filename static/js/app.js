/***************** Fetch data from JSON file *******************/
//json path
const path = "sampledata.json"

// quandl & polygon combo json
d3.json("sampledata.json").then(function(data) 
{
    console.log(data);
});

/***************** On page load ********************************/
//Create ALL stocks table


//Declare variables for barchart
var X_tkrsymb = [ ];
var Y_divtimesqty = [ ];

/************************* Function Create All data table *************************/
// function allStocksTable(data) 
// {
//     // refrence the table body to build table in 
//     var tbody = d3.select('.stock-table-body');
//     sampledata.datatable.data.forEach(stock => 
//     {
//         //Append a tr to the table body tag
//         var row = tbody.append('tr');
//         // qty col does not currently contain input
//         row.append("td").text('');
//         // tkr symbol col
//         row.append("td").text(stock[1]);
//         // company name
//         row.append("td").text(stock[0]);
//         // stock price
//         row.append("td").text(stock[3]);
//         // dividend rate
//         row.append("td").text(stock[2]);
//         // rate of return
//         row.append("td").text(stock[4]);
//     });


    //Use for each to create a table with ALL the data

    //Append td.text  for each info column
// }