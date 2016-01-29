var place;

$('#myModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var type = button.data('type') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('Add ' + type)
  if(type === "News"){
    place = "news";
  	modal.find('.modal-body #label1').text("Date");
  	modal.find('.modal-body #label2').text("Title");
  	modal.find('.modal-body #label3').text("Summary");
  	modal.find('.modal-body #label4').text("Description");
  	modal.find('.modal-body #label5').text("Type");
  	modal.find('.modal-body #label6').text("Link");
  }
  else if(type === "Event"){
    place = "event";
  	modal.find('.modal-body #label1').text("Summary");
  	modal.find('.modal-body #label2').text("Title");
  	modal.find('.modal-body #label3').text("Date");
  	modal.find('.modal-body #label4').text("Description");
  	modal.find('.modal-body #label5').text("Image");
  	modal.find('.modal-body #label6').text("Link");
  }
  else if(type === "Job"){
    place = "job";
  	modal.find('.modal-body #label1').text("Experience Level");
  	modal.find('.modal-body #label2').text("Company and Role");
  	modal.find('.modal-body #label3').text("Deadline");
  	modal.find('.modal-body #label4').text("Description");
  	modal.find('.modal-body #label5').text("Location");
  	modal.find('.modal-body #label6').text("Link");
  }
})