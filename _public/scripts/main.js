$(document).ready(function() {

  $('.project').hover(
    function () {
      $(this).find('.description').animate({
        top:"180px"
      }, {duration: 200, queue: false});
    },
    function () {
      $(this).find('.description').animate({
        top:"300px",
      }, {duration: 200, queue: false});
    }
  );

});
