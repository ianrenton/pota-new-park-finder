/////////////////////////////
//     CONTROLS SETUP      //
/////////////////////////////

$("#myCallsign").change(function () {
    myCallsign = $(this).val().trim();
    localStorage.setItem('myCallsign', JSON.stringify(myCallsign));

    // Update address bar to create a permalink
    pushURLToAddressBar();
});
