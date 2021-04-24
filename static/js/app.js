/***************** Fetch data from JSON file *******************/
//json path
const path = "../data/stockexample.json"

//quandl json for tiker data
const quandlJson = d3.json(path);
console.log(quandlJson);
//polygon json for dividend data
const polygonJson = d3.json(path);
console.log(polygonJson);
//combo json
const stockexample = d3.json(path)

/***************** On page load ********************************/
//Create ALL stocks table
stockexample.then(allStocksTable(stockexample));

//Declare variables for barchart
Var X_tkrsymb = [ ];
Var Y_divtimesqty = [ ];



/************************* Function Create All data table *************************/
function allStocksTable(data) 
{
    //Append a tr to the table body tag

    //Use for each to create a table with ALL the data

    //Append td.text  for each info column
}