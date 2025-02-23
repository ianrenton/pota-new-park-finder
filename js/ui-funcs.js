/////////////////////////////
//     CONTROLS SETUP      //
/////////////////////////////

$("#myCallsign").change(function () {
    myCallsign = $(this).val();
    localStorage.setItem('myCallsign', JSON.stringify(myCallsign));
});
