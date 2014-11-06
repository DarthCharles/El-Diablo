

$(function (){


$('.dropdown-menu').click(function (evt){
	evt.stopPropagation();
});



	function checkChildren(parent, boolean){
		if($(parent).children('ul').length){

			var parent = $(parent).children('ul');
			var children = $(parent).children('li');

			children.each(function(index, value){
				var checkbox = $(value).children('input');
				$(checkbox).prop('checked', boolean);
				checkChildren(value, boolean);
			});
		}
	}

	$('.dropdown-menu  li   input').click(function () {
		var parent = $(this).parent();
		if ($(this).prop('checked')) {
			
			checkChildren(parent, true);
		} else {
			checkChildren(parent, false);
		}


	});
});

