/////////////////////////////
//     CONTROLS SETUP      //
/////////////////////////////

$("#myCallsign").change(function () {
    myCallsign = $(this).val().trim();
    localStorage.setItem('myCallsign', JSON.stringify(myCallsign));
});
