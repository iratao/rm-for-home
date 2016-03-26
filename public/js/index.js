(function() {
	const DEFAULT_IMGURL = '../img/default_img.png';

	var itemlist = [];

	function getProductBySeekID() {
		var seekID = $('#seekid').val();

		$.ajax({
            type: 'GET',
            url: '/api/product/' + seekID,
            success: addProduct,
            error: getProductError,
        }); 
	};

	function addProduct(data) {
		if (!data || data.length == 0) {
			return;
		}
		var item = JSON.parse(data[0]).item;
		var id = item.id;
		var name = item.name;
		var image = (item.imagesResize && item.imagesResize.length > 0) ?  item.imagesResize[0] : DEFAULT_IMGURL;
		var contentType = getContentType(item);
		
		itemlist.push({id, name, image, contentType});
		
		var html = '<div class="col-sm-4"><img src="' + image + '" alt="' + name +'" class="img-rounded"></div>';
		if (itemlist.length % 3 === 1) {
			$('#contentlist').append('<div class="row"></div');
		}
		$('#contentlist div.row:last-child').append(html);
	};

	function getProductError(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
		console.log(textStatus);
		console.log(errorThrown);
	}

	function getContentType(item) {
		var attributes = item.attributes;
		for (var i = 0; i < attributes.length; i++) {
			var attr = attributes[i];
			if (attr.name === 'ContentType') {
				return attr.values && attr.values.length > 0 ? attr.values[0] : undefined;
			}
		}
	}

	window.onload = function() {
		$("#add_button").click(getProductBySeekID);
	}


})();