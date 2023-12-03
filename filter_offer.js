const { input_1 } = require('./input');
const VALID_DURATIONS = 432000000
  
function get_input() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      });
    return new Promise((resolve) => {
      readline.question("Please input checkin date!", (date) => {
        const checkin_date = new Date(date);
        resolve(checkin_date);
        readline.close();
      });
    });
  }

function remove_far_merchant(busi){
    if (busi["merchants"] !== null && busi["merchants"].length > 1){
        busi["merchants"] = [busi["merchants"].reduce((acc, e) => e["distance"] < acc["distance"] ? e : acc, {"distance": Infinity})]
        return busi
    }
    return busi
}

function valid_date(checkin_date, offer_date){
    return checkin_date.getTime() + VALID_DURATIONS < offer_date.getTime()
}

function filter_offer(offers, checkin_date){
    const acc = {}
    const result = {}
    offers["offers"].forEach(e => {
        const category = e["category"]
        if (valid_date(checkin_date, new Date(e["valid_to"])) && category !== 3){
            const fixed_offer = remove_far_merchant(e)
            if (acc[category] === undefined || acc[category]["merchants"][0].distance > fixed_offer["merchants"][0].distance){
                acc[category] = fixed_offer
            }
        }
    })
    const accValues = Object.values(acc);

    // Sorting offers based on distance in ascending order
    accValues.sort((a, b) => a["merchants"][0].distance - b["merchants"][0].distance);

    // Take the first two offers from the sorted array
    result["offers"] = accValues.slice(0, 2);

    return result;
  }
  
get_input().then((date) => {
    const offers = filter_offer(input_1,date)
    const fs = require("fs")
    fs.writeFile("output.json", JSON.stringify(offers), (error) =>{
        if (error) {
            // logging the error
            console.error(error);
        
            throw error;
          }
        console.log("offers filtered successfully")
    } )  
});
