/**
 * Created by kiran on 12/11/15.
 */

'use strict';

var DateUtility={
  
  'now':function(){
    return new Date();  
  },    
  'getFormatDate':function(inputdate){
      var currentDate = new Date(inputdate);
      return (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' +  currentDate.getFullYear();
  },
  
  'addDays':function(currdate,days){
            var dat = new Date(currdate);
            dat.setDate(dat.getDate() + days);
            return dat;            
    },    
  'getNextDates':function(days){
    var dateArray = new Array();
    var currentDate = new Date();
    var stopDate = DateUtility.addDays(currentDate,days);
    while (currentDate <= stopDate) {
        dateArray.push((currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' +  currentDate.getFullYear())
        currentDate = DateUtility.addDays(currentDate,1);
    }
    return dateArray;            
  }    
}


module.exports=DateUtility;
