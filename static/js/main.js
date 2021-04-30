// dentify accept mission button for change event
 var accept_mission = d3.select('#explode-button')
 //on click, call the function to explode the text
 accept_mission.on('click',fx)
 
 function fx(o) {
console.log("function fx is called")
  var $o = $(o);

  $o.html($o.text().replace(/([\S])/g, "<span>$1</span>"));
  $o.css("position", "relative");
  $("span", $o).each(function(i) {
    var newTop = Math.floor(Math.random()*500)*((i%2)?1:-1);
    var newLeft = Math.floor(Math.random()*500)*((i%2)?1:-1);

    $(this).css({position: "relative",
      opacity: 1,
      fontSize: 12,
      top: 0,
      left: 0
    }).animate({
      opacity: 0,
      fontSize: 84,
      top: newTop,
      left:newLeft
    },1000);
  });
}​
   
// $(document).ready(function() {

//    $("#hide").click(function(){
//       $(".target").hide( "explode", {pieces: 16 }, 2000 );
//    });

   
// });
