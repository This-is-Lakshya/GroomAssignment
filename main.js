function onEdit(e) {
    addTimeAndDate(e);
    count();
}
  
// function to add TimeStamp and Date
const addTimeAndDate = (e)=>{

    const row = e.range.getRow();
    const col = e.range.getColumn();

    // check if we are on the 'post Oct' sheet
    if(e.source.getActiveSheet().getName() === "post Oct"){

        // check if we are at the starting at the table
        if(col === 4 && row > 2){

            e.source.getActiveSheet().getRange(row, 1).setValue(1);
            e.source.getActiveSheet().getRange(row, 5).setValue(new Date());

            // check if (time = null)
            if(e.source.getActiveSheet().getRange(row, 3).getValue() == ''){
                e.source.getActiveSheet().getRange(row, 3).setValue(new Date());
            }

            // check if (date = null)
            if(e.source.getActiveSheet().getRange(row, 2).getValue() == ''){
                e.source.getActiveSheet().getRange(row, 2).setValue(new Date().toDateString());
            }
        }
    }
}

// function to handle the Dashboard 
const count = ()=>{

    const dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("post Oct");
    const dashboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dashboard");

    const getNoOfElements = dataSheet.getRange('A3:A').getValues();
    const allDates = dataSheet.getRange('B3:B').getValues();
    const getAllDates = [];

    // ((Function Call)) -- push diff" dates to getAllDates[] 
    pushDiffDates(getAllDates, allDates);

    // ((Function Call)) -- calculate total no. of entries
    totalEntries(getNoOfElements, dataSheet);

    // show diff" dates on the Dashboard
    for(let i=0; i<getAllDates.length; i++){
        dashboard.getRange(`A${i+3}`).setValue(getAllDates[i]);
    }

    // array of dates in string form
    const strAllDates = [];
    for(let i=0; i<allDates.length; i++){
        if(allDates[i].toString() != ""){
        strAllDates.push(allDates[i].toString().slice(0,15));
        }
    }

    // count no. of entries of the same dates
    const counts = {};
    strAllDates.forEach((x)=>{
        counts[x] = (counts[x] || 0) + 1;
    });

    // ((Function Call)) -- show the DIFF & SUM of entries till date
    showDIFFandSUM(counts, dashboard);

}

// add diff" dates to getAllDates
const pushDiffDates = (getAllDates, allDates)=>{

    getAllDates.push(allDates[0].toString().slice(0,15));
    for(let i=1; i<allDates.length; i++){

        if(allDates[i].toString() != ""){
            if(allDates[i].toString().slice(0,15) != allDates[i-1].toString().slice(0,15)){
                getAllDates.push(allDates[i].toString().slice(0,15));
            }
        }
    }
}

const totalEntries = (getNoOfElements, dataSheet)=>{
    let sum = 0;

    for(let i=0; i<getNoOfElements.length; i++){
        if(getNoOfElements[i] != ""){
            sum += parseInt(getNoOfElements[i]);
        }
    }
    dataSheet.getRange('F3').setValue(sum);
}

const showDIFFandSUM = (counts, dashboard)=>{
    const dateCount = Object.values(counts);

    const dashBoardDateList = [];
    const dashBoardDates = dashboard.getRange('A3:A').getValues();

    for(let i=0; i<dashBoardDates.length; i++){
        if(dashBoardDates[i].toString() != ""){
        dashBoardDateList.push(dashBoardDates[i].toString().slice(0,15));
        }
    }

    // show the DIFF of the entries b/w dates
    dashboard.getRange(`C3`).setValue("");
    for(let i=1; i<dateCount.length; i++){
        dashboard.getRange(`C${i+3}`).setValue(dateCount[i]);
    }

    // show SUM of entries till date
    let sumOfEntries = 0;
    for(let i=0; i<dateCount.length; i++){
        sumOfEntries += dateCount[i];
        dashboard.getRange(`B${i+3}`).setValue(sumOfEntries);
    }
}