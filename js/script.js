	$(document).ready(function(){
		$.getJSON('../products.json', function(data){
			$('#test').append(data[0]['title']+'<br>');
			$('#gTmpl').template('gTmpl');
			var ext;
			var bls;
			for(var key in data){
				data[key]['code'] = data[key]['code'].replace(/^0+/, '');
				ext = data[key]['primaryImageUrl'].split('.').pop();
				data[key]['primaryImageUrl'] = data[key]['primaryImageUrl'].replace("."+ext, '');
				data[key]['primaryImageUrl'] += "_220x220_1."+ext;
				data[key]['unitRatioAlt'] = data[key]['unitRatioAlt'].toFixed(2);
				data[key]['priceGoldAlt'] = data[key]['priceGoldAlt'].toFixed(2);
				data[key]['priceRetailAlt'] = data[key]['priceRetailAlt'].toFixed(2);
				bls = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
				(bls%100 == 0 || (bls%100 > 4 && bls%100 < 21))?data[key]['newdata'] = bls+" баллов":(bls%10 == 1)?data[key]['newdata'] = bls+" балл":(bls%10 < 5 && bls%10 > 1)?data[key]['newdata'] = bls+" балла":data[key]['newdata'] = bls+" баллов";
				
				$.tmpl('gTmpl', data[key]).appendTo('.product__area'); 
			}
			$(".stepper-arrow").on("click", function(){
				stepperArrow(this);
			});
			$(".unit--select").on("click", function(){
				unitSelect(this);
			});
		});
				
		function setPrices(good, count){
			var code = "00000"+$(good).find(".product_code").text().replace("Код: ", "");
			var gprice = "null";
			var rprice = "null";
			var p_type = good.find(".unit--wrapper").attr("p_id");
			$.getJSON('../products.json', function(data){
				for(var key in data){
					if(data[key]['code'] == code){
						if(p_type == 1){
							gprice = data[key]['priceGoldAlt'];
							rprice = data[key]['priceRetailAlt'];
						} else {
							gprice = data[key]['priceGold'];
							rprice = data[key]['priceRetail'];
						}
						break;
					}
				}
				gprice = Number.parseFloat($(count).val())*gprice;
				rprice = Number.parseFloat($(count).val())*rprice;
				$(good.find(".goldPrice")).html(gprice.toFixed(2));
				$(good.find(".retailPrice")).html(rprice.toFixed(2));
			});
		}
		
		function stepperArrow(i){
			var good = $(i).parent().parent().parent().parent();
			var count = $(i).parent(".stepper").find(".product__count");
			var value = Number.parseInt($(count).val());
			if($(i).hasClass("up")){
				$(count).val(value+1);
				value += 1;
			} else if($(i).hasClass("down")){
				if(($(count).val()-1)>0){
					$(count).val(value-1);
				} else return;
			}
			setPrices(good, count);
			
		}
		function unitSelect(i){
			if(!$(i).hasClass("unit--active")){
				var that = $(i).parent();
				var last = that.find(".unit--active");
				last.removeClass("unit--active");
				$(i).addClass("unit--active");
				var p_id = $(i).attr("p_id");
				$(that).attr("p_id", p_id);
				var good = $(i).parent().parent().parent();
				var count = good.find(".product__count");
				setPrices(good, count);
			}
		}
	});