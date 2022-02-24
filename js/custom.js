function WICard(obj, plugins)
	{
	this.allzakaz;
	this.timedost=0;
	this.widjetX = 0;
	this.widjetY = 0;	
	this.widjetObj;
	this.widjetPos;
	this.cardID = "";
	this.DATA = {};
	this.IDS = [];
	this.objNAME = obj;
	this.CONFIG = {};
	this.init = function(widjetID, config){
		this.CONFIG = config || {};
		try {
			this.DATA = JSON.parse(localStorage.getItem(widjetID));
			if ($.isEmptyObject(this.DATA)){this.DATA = {};}
		}catch (e) {this.DATA = {};}	
		try {
			this.IDS = JSON.parse(localStorage.getItem(widjetID + "_ids"));
			if ($.isEmptyObject(this.IDS)){this.IDS = [];}
		}catch (e){this.IDS = [];}		
		this.cardID = widjetID;	
		$("body").append("<div class='bird' id='"+widjetID +"_bird'></div>");	
		this.widjetObj = $("#" + widjetID);
		this.widjetPos = this.widjetObj.position();
		if ($.isEmptyObject(this.DATA)){this.widjetObj.html("<span style='font-size: 15px;'>Ваш трюм пуст!</span>");$("#bfooter").show();$(".overflw").hide();$(".cash_form_off").hide();}
		else{this.reCalc();this.renderBasketTable();}
	}
/***********************************************************************************************
 * example: onclick="cart.addToCart(this, '75055')						
 **********************************************************************************************/
	this.addToCart = function(curObj, id){
		/*****************************
		 * поле ввода кол-ва
		 *****************************/
		var kol = 1,
			name = "",
			str_name="",
			price=0;
			var id_temp = id;
		if(~id.indexOf("_3")){/*если товары по спеццене*/
			id = id.substr(0,id.indexOf("_3"));
			name='<a href="#" style="text-decoration: none; color: white;" onclick="window.modal_form(\''+$('#'+id).data('tovar1')+'\');">Спец цена ' + $('#'+$('#'+id).data('tovar1')).data('name')+'</a></br><a href="#" style="text-decoration: none; color: white;" onclick="window.modal_form(\''+$('#'+id).data('tovar2')+'\');">Спец цена '+$('#'+$('#'+id).data('tovar2')).data('name')+'</a></br><a href="#" style="text-decoration: none; color: white;" onclick="window.modal_form(\''+id+'\');">Спец цена '+$('#'+id).data('name')+'</a>';
			str_name='Спец цена '+$('#'+$('#'+id).data('tovar1')).data('name')+'</br>Спец цена '+$('#'+$('#'+id).data('tovar2')).data('name')+'</br>Спец цена '+$('#'+id).data('name');
			price=$('#'+id).data('cena1');
		}else{
			name='<a href="#" style="text-decoration: none; color: white;" onclick="window.modal_form(\''+id+'\');">'+$('#'+id).data('name')+'</a>';
			str_name=$('#'+id).data('name');
			price=$('#'+id).data('cena');
		}
		id=id_temp;
		if ( $("input").is("#" + id) ){kol = parseInt( $("#" + id).val() );}
		timedost_temp = $('#'+id).data('dost');
		var text = $(".cityTo option:selected").val(),
			t = loadcity(text);
		if (this.timedost<(parseInt(timedost_temp)+t)) this.timedost=(parseInt(timedost_temp)+t);//расчитывается максимальная доставка
		$('.resultText').html(this.timedost+'<input id="timedost" type="hidden" name="timedost" value="'+this.timedost+'">');
		var id_ = id,
			goodieLine = {"id" : id_, "name" : name, "price": price, "num" : kol, "str_name": str_name};		
		if ($.isEmptyObject(this.DATA)){this.DATA[id_] = goodieLine;this.IDS.push(id_);}else
			for(var idkey in this.DATA){
				if($.inArray(id_, this.IDS) === -1){this.DATA[id_] = goodieLine;this.IDS.push(id_)}
				else if (idkey == id_){this.DATA[idkey].num += kol;}
			}
		localStorage.setItem(this.cardID, JSON.stringify(this.DATA));
		localStorage.setItem(this.cardID + "_ids", JSON.stringify(this.IDS));
		this.reCalc();
		this.renderBasketTable();
		var bird = $("#" + this.cardID + "_bird"); 
		var pos = $(curObj).position();	
		bird.offset({ top: pos.top, left: pos.left});
		bird.html(price);
		bird.show();
		bird.animate({
				'left': this.widjetPos.left, 
				'top': this.widjetPos.top 
				}
				,
				{
				'duration': 500, 
				complete:  function(){bird.offset({ top: -300, left: -300});}
				});
		if (this.CONFIG.showAfterAdd){cart.showWinow('bcontainer', 1);}
		$('#modaladd').fadeIn(500).delay(1000).fadeOut(500);
	}
	this.reCalc = function(){
		var num = 0;
		var sum = 0; 	
		this.timedost=0;
		var text = $(".cityTo option:selected").val();
		var t = loadcity(text);
		for(var idkey in this.DATA) {
			num += parseInt(this.DATA[idkey].num);
			sum += parseFloat(parseInt(this.DATA[idkey].num) * parseFloat(this.DATA[idkey].price));
			timedost_temp=$('#'+this.DATA[idkey].id).data('dost');
			if (this.timedost<(parseInt(timedost_temp)+t)) this.timedost=(parseInt(timedost_temp)+t);//расчитывается максимальная доставка
		}
		$('.resultText').html(this.timedost+'<input id="timedost" type="hidden" name="timedost" value="'+this.timedost+'">');
		this.widjetObj.html("Товаров " + num + "</br>на сумму " + sum);
		localStorage.setItem(this.cardID, JSON.stringify(this.DATA));
	}
	this.clearBasket = function(){
		this.DATA = {};
		this.IDS = [];
		this.widjetObj.html("<span style='font-size: 15px;'>Ваш трюм пуст!</span>");
		localStorage.setItem(this.cardID, "{}");
		localStorage.setItem(this.cardID + "_ids", "[]");
		$("#btable").html('');
		$(".cash_form_off").hide();
		$(".overflw").hide();
		$("#bfooter").show();
	}
	this.renderBasketTable = function(){
		if ($('#bcontainer').length == 0){}else{$("#btable").html("");}
		this.allzakaz = '';
		for(var idkey in this.DATA){
			with (this.DATA[idkey]){
				var productLine = '<tr class="bitem" id="wigoodline-' + id + '"> \
					<td>'+name+'</td> \
					<td>\
					<span id="basket_num_' + id + '">'+ num +' х</span></td> \
					<td id="lineprice_' + id + '"class="wigoodprice">' + price + ' р.</td> \
					<td><a href="#" style="text-decoration: none;" onclick="' + this.objNAME + '.delItem(\'' + id + '\')"><img src="images/close.png"></a></td> \
					</tr>';	
				productLine = productLine.replace(/STAR WARS/g, "<span class='starwars'>STAR WARS</span>");
				this.allzakaz += str_name + '_' + num + '_' + price + '_';
			}
			$("#bfooter").hide();
			$("#btable").append(productLine);
			$(".cash_form_off").show();
			$(".overflw").show();
		}
		this.sumAll();
	}
	this.sumAll = function(){
		var sum = 0;
		for(var idkey in this.DATA) { sum += parseFloat(this.DATA[idkey].price * this.DATA[idkey].num); }
		$(".cash_form_off").show();
		$(".overflw").show();
		$("#bfooter").hide();
		var rand = Math.random().toString(36);
		$("#prise").html('<input type="hidden" name="targets" value="За заказ №'+ rand +'"><input type="hidden" name="zakaz" value="'+ this.allzakaz + '"/><input type="hidden" name="sum" data-type="number" value="'+ sum + '"/><input type="hidden" name="label" value="'+ rand + '"/><input id="send" name="submit-button" class="bbutton" type="submit" style="margin-bottom:20px;" onclick="yaCounter34380610.reachGoal(\'oformlen\');" value="Оформить заказ: '+ sum + 'р."/>');
	}
	this.delItem = function(id){
		$("#btable").html("");	
		delete this.DATA[id];
		this.IDS.splice( $.inArray(id, this.IDS), 1 );
		this.reCalc();
		this.renderBasketTable();
		localStorage.setItem(this.cardID, JSON.stringify(this.DATA));
		localStorage.setItem(this.cardID + "_ids", JSON.stringify(this.IDS));
		if (this.IDS.length == 0){
			this.widjetObj.html("<span style='font-size: 15px;'>Ваш трюм пуст!</span>");
			$(".cash_form_off").hide();
			$(".overflw").hide();
			$("#bfooter").show();
}}}
/*end*/

$(document).mouseup(function (e){ // событие клика по веб-документу
	var div = $("#price");
	if (div.is(e.target) || div.has(e.target).length != 0) {$("#bcontainer").modal('show');}
	div = $("#modalorder");
	if (!div.is(e.target) // если клик был не по нашему блоку
		&& div.has(e.target).length === 0) { // и не по его дочерним элементам
		div.hide(); // скрываем его
	}
});
var cart;
var config;
var wiNumInputPrefID;

$(document).ready(function() {
	/* WI-GLOBAL-VARS */
    cart = new WICard("cart");
    config = {'clearAfterSend':true, 'showAfterAdd':false};
    cart.init("basketwidjet", config);
    /* WI-MODULES */

	loadLocations();
	$(document).on('hidden.bs.modal', '#modal_active', function (e) {$("body").css("padding-right", "0px");})
	$('.carousel').carousel({interval: false})
	$('.cash_ya').click(function(){
		var offlabel  = document.getElementById('checkbox_yandex_off'),
		onlabel   = document.getElementById('checkbox_yandex_on'),
		is_onstate = (onlabel.style.opacity > 0);
			
		if (!is_onstate) {
			offlabel.style.opacity = 0;
			onlabel.style.opacity = 1;
			$('#radio_visa').prop("checked",false);
			$('#radio_ya').prop("checked",true);
		} else {
			offlabel.style.opacity = 1;
			onlabel.style.opacity = 0;
			$('#radio_visa').prop("checked",true);
			$('#radio_ya').prop("checked",false);
		}
		return false;
	});

	$('#price_lowest_1').on('click', function(e){//сортировка по цене
		var var_prise = $('.prise').attr('id'),
			arr_new = [],
			arr = [],
			num=0,
			id = "",
			tovar = "\
				<div id='"+var_prise+"' class='prise "+var_prise+" container'>\
				<div class='row'>";
		
		var htmlStr = $("#allprise").html();
		
		for (var i = 0; ~htmlStr.indexOf("modal_form("); i++){ //создание массива с ценой
			num_left=htmlStr.indexOf("modal_form(")+12;
			num_right=htmlStr.indexOf('\'', num_left);
			htmlStr_temp=htmlStr;
			htmlStr=htmlStr.substring(num_left);
			id_new = htmlStr_temp.substring(num_left, num_right);
			arr[i] = [];
			arr[i][0]=id_new;
			arr[i][1]=$('#'+id_new).data('cena');
			num=i;
		}
		var o = document.getElementById("price_lowest_1");
		switch (o.className){//выбор сортировки
			case "narrow-price":
			case "narrow-price-asc": o.className = "narrow-price-desc"; arr.sort(sCena); break;
			case "narrow-price-desc": o.className = "narrow-price-asc"; arr.sort(mCena); break;
		}
		var arr_temp = arr0();
		for (var i = 0; i <= num; i++){
			arr_new[i] = arr[i][0];
			for (var ii = 0; ii < 3; ii++)
				for (var iii = 0; iii < arr_temp[ii].length; iii++)
					if (~arr_temp[ii][iii].indexOf(arr_new[i])){
						arr_new[i]=arr_temp[ii][iii];
					}
		}//перевод в одномерный
		
		tovar+=form_prise(arr_new) + "</div></div>";
		$("#allprise").html('');
		$("#allprise").append(tovar);
	//	if (var_prise!='promo'){if ($(window).width()<768){navigation(var_prise,var_prise);}else{navigation(var_prise,"nav2");}}
		return false;
	});
	$('#seach').keydown(function(e) {if(e.keyCode === 13) {seach();}});
	$("input[id='phone']").inputmask("+9(999)9999999" ,{ clearMaskOnLostFocus: true });
	$('.best-match-off').on('click', function(e){personag_filter(e);return false;});
	$('.ssilka').on('click', function(e){
		switch($(e.target).data('rel')){
			case "otzivi": window.location.hash='#otzivi'; return true; break;
			case "nav2": window.location.hash='#nav2'; return true; break;
			case "dostavka": window.location.hash='#dostavka'; return true; break;
			default:load_prise($(e.target).data('rel'));return false;
		}
	});
	$(window).scroll(function() {if($(this).scrollTop() > 100) {$('#toTop').fadeIn();} else {$('#toTop').fadeOut();}});//скролл вверх
	$('#toTop').click(function() {$('body,html').animate({scrollTop: $("#nav2").offset().top },800);});

	var e = window.location.hash;//загрузка конкретного товара
	e = decodeURI(e);
	if(~e.indexOf('id')){e=e.substring(3);modal_form(e);}else{
		if(~e.indexOf('seach=')){e=e.substring(7);$('#seach').val(e);seach();window.location.hash='#nav2';}else{
			if(~e.indexOf('filter=')){e=e.substring(8);personag_filter(e);window.location.hash='#nav2';}else{
				if(e==""){load_prise('promo');}else{//подгрузка вариантов промо
					if(e=="#lego"){load_prise('lego');}else{
						if(e=="#figurki"){load_prise('figurki');}
					}
				setTimeout(function(){window.location.hash='#nav2';},1000);
				}
			}
		}
	}
});

$.formUtils.addValidator({
	name : 'phone',
	validatorFunction : function(tele) {
		var num7 = tele.match(/[\+]7/g);
		var num8 = tele.match(/[\+]8/g);
		if (num7 == null && num8 == null) {return false;}
		tele = tele.replace(/([\+])/g, '');
		tele = tele.replace(/([\(])/g, '');
		tele = tele.replace(/([\)])/g, '');
		return tele.length == 11 && tele.match(/[^0-9]/g) === null;
	},
	errorMessage : '',
	errorMessageKey: 'badEvenNumber'
});
	
$.formUtils.addValidator({
	name : 'fio',
	validatorFunction : function(tele) {
		var prob = tele.match(/\s[а-яё]/gi);
		var nottxt = tele.match(/[^а-яё\s]+/gi);
		if (prob!=null && nottxt == null && prob.length==1 && tele.length<40 && tele.length>10){return true;}else{return false;}
	},
	errorMessage : '',
	errorMessageKey: 'badEvenNumber'
});
	
$.formUtils.addValidator({
	name : 'email',
	validatorFunction : function(tele) {
		var prob = tele.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(?:ru|рф|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$/gi);
		if (prob == null){return false;}else{return true;}
	},
	errorMessage : '',
	errorMessageKey: 'badEvenNumber'
});

$.formUtils.addValidator({
        name : 'adress',
        validatorFunction : function(tele) {
			var prob = tele.match(/[a-z]+/gi);
			if (prob == null && tele.length>10 && tele.length<200){return true;}else{return false;}
        },
		  errorMessage : '',
		errorMessageKey: 'badEvenNumber'
});

$.formUtils.addValidator({
        name : 'logistikaval',
        validatorFunction : function(tele) {
			if(tele=="Выберите вариант"){return false;}else{return true;}
        },
		  errorMessage : '',
		errorMessageKey: 'badEvenNumber'
});

$.formUtils.addValidator({
	name : 'checkbox',
	validatorFunction : function(tele) {
		if (!$('input[name="person"]').prop('checked') || !$('input[name="dogovor"]').prop('checked')){
			if (!$('input[name="person"]').prop('checked')){
				$('.person').css('color','red');
			}else {$('.person').css('color','#fff');}
			if (!$('input[name="dogovor"]').prop('checked')) {
				$('.dogovor').css('color','red');
			}
			else {$('.dogovor').css('color','#fff');}
			return false;
		}
		if ($('input[name="person"]').prop('checked')){$('.person').css('color','#fff');}
		if ($('input[name="dogovor"]').prop('checked')) {$('.dogovor').css('color','#fff');}
		return true;
	},
	errorMessage : '',
	errorMessageKey: 'badEvenNumber'
});

$.validate({
  form : '#formToSend',
	onError : function($form) {$('#senderror').fadeIn(500).delay(1000).fadeOut(500); return false;},
	onSuccess: function($form) {
		$.ajax({
			url: "/save_form.php", //Адрес подгружаемой страницы
			type: "POST", //Тип запроса
			data: $("#formToSend").serialize(),
			timeout: 0,
			async: false,
			success: function(data) {return true;}
		});
	}
});
$.validate({
  form : '#form_send',
	onError : function($form) {$('#senderror').fadeIn(500).delay(1000).fadeOut(500); return false;},
	onSuccess: function($form) {
		$('#modalsend').fadeIn(500).delay(1000).fadeOut(500);
	}
});

function load_prise(var_prise){
	var arr =  select_arr(var_prise),
		id = "",
		tovar = "\
		<div id='"+var_prise+"' class='prise "+var_prise+" container'>\
			<div class='row'>";
	tovar+=form_prise(arr) + "</div></div>";
	$("#allprise").html('');
	$("#allprise").append(tovar);
	var o = document.getElementById("price_lowest_1");
	o.className = "narrow-price";
	if($(".best-match-on"))$(".best-match-on").removeClass("best-match-on").addClass("best-match-off");
//	if (var_prise!='promo'){if ($(window).width()<768){navigation(var_prise,var_prise);}else{navigation(var_prise,"nav2");}}
}

function banner(id){//обрезание в массиве товаров акций
	if(~id.indexOf('+')){
		id=id.substring(0,id.indexOf('+'));
	}else{
		if(~id.indexOf('-')){
			id=id.substring(0,id.indexOf('-'));
		}else{
			if(~id.indexOf('*')){
				id=id.substring(0,id.indexOf('-'));
	}}}
	return id;
}

function form_prise(arr){//формирует список товаров
		var tovar="";
		for(var i=0; i<arr.length; i++) {
			var baner = "",
				id=arr[i];
			if(~id.indexOf('+')){
				baner='<b class="banner">НОВИНКА</b>';
				id=id.substring(0,id.indexOf('+'));
			}else{
				if(~id.indexOf('-')){
					baner='<b class="banner banner_red">ЛУЧШЕЕ</b>';
					id=id.substring(0,id.indexOf('-'));
				}else{
					if(~id.indexOf('*')){
						baner='<b class="banner banner_green">АКЦИЯ</b>';
						id=id.substring(0,id.indexOf('*'));
			}}}
			var name=$('#'+id).data('name'),
				name1=$('#'+id).data('name1'),
				cena=$('#'+id).data('cena');
			tovar+='\
					<div class="text-center colon">\
						'+baner+'<img title="'+name+'" src="images/prise/240x135/'+id+'.jpg" class="image" onclick="modal_form(\''+id+'\');">\
						<div class="name">'+name1+'</div>\
						<div class="price col-md-5 col-sm-5 col-xs-5 centr"><p>'+cena+' р.</p>\
						</div><div class="price col-md-7 col-sm-7 col-xs-7 centr"><button class="btn-add-to-cart btn-add-to-cart-kr btn-modal" onclick="cart.addToCart(this, \''+id+'\');yaCounter34380610.reachGoal(\'sale1\');">Купить</button></div>\
					</div>';
		}
	return tovar;
}

function navigation(name,url){
		window.location.hash='#'+url;
		setTimeout(function(){
			$('.nav .active').removeClass('active');
			$('li.'+name).addClass('active');
		},0);
}

function getXmlHttp(){
  var xmlhttp;
  try {xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {try {xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");} catch (E) {xmlhttp = false;}}
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {xmlhttp = new XMLHttpRequest();}
  return xmlhttp;
}

function modal_form(id){//это формирует карточку товара
	var arr=[ $('#'+id).data('tovar1'), $('#'+id).data('tovar2'), $('#'+id).data('cena1'), $('#'+id).data('vigoda')],
	cena=$('#'+id).data('cena'),
	name=$('#'+id).data('name'),
	name1=$('#'+arr[0]).data('name'),
	name2=$('#'+arr[1]).data('name'),
	collapse=document.getElementById(id+'_1').innerHTML,
	harakteristika = document.getElementById(id+'_2').innerHTML,
	tovar_result="",
	idN = select_arr(id);
	
	if($('#'+id).data('variant') != "-"){//document.getElementById(id+'_4')){ //если есть варианты товара
		var variant_tovara = $('#'+id).data('variant');
		tovar_result = '<span class="centr">Варианты:</span><div class="centr view-filter1">',
		arr_tovara = variant_tovara.split(';');
		for(var i=0;i<arr_tovara.length; i++) {
			variant_tovara = arr_tovara[i];
			arr_tovara[i] = variant_tovara.split('-');
			if(arr_tovara[i][0] == "img") {//если картинки !!!Доработать загрузку картинки большего размера!!!!
				tovar_result += '<div class="narrow-down-bg"><a href=""><img onclick="event.preventDefault(); smena_tovara(event,1);return false;" class="center-block best-match-off" data-new="'+arr_tovara[i][1]+'" src="images/prise/50x28/'+arr_tovara[i][1]+'_1.jpg"></a></div>';
			}else{
				tovar_result += '<div class="narrow-down-bg"><a href=""><span onclick="event.preventDefault(); smena_tovara(event);return false;" class="best-match-off" data-new="'+arr_tovara[i][1]+'">'+arr_tovara[i][0]+'</span></a></div>';
			}
		}
		tovar_result += '</div>';
	}

	var temp = '\
<div id="modal_active" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">\
	<div class="modal-dialog modal-lg">\
		<div class="modal-content fon_3">\
			<div style="display: block;" class="lb-nav">\
				<a style="display: block;" class="lb-prev" href="" onclick="modal_form(\''+idN[0]+'\');return false;"></a>\
				<a style="display: block;" class="lb-next" href="" onclick="modal_form(\''+idN[1]+'\');return false;"></a>\
			</div>\
			<div class="modal-header">\
				<button type="button" class="close" data-dismiss="modal"><img src="images/close_.png"></button>\
				<h4 class="modal-title">'+name.replace(/STAR WARS/g, "<span class='starwars'>STAR WARS</span>")+'</h4>\
			</div>\
			<div class="modal-body">\
				<div class="row">\
					<div class="col-md-8 col-sm-8 p-b-15">\
						<div id="carousel-prise" class="carousel slide" data-ride="carousel" data-pause="">\
							<ol class="carousel-indicators"></ol>\
							<div class="carousel-inner" role="listbox">\
								<div class="item active"><img class="img-thumbnail center-block" style="margin-top: 125px;" src="images/loading.gif"></div>\
							</div>\
							<a class="left carousel-control" href="#carousel-prise" data-slide="prev"><img style="left:0" src="images/prev.png"></a>\
							<a class="right carousel-control" href="#carousel-prise" data-slide="next"><img style="right:0" src="images/next.png"></a>\
						</div>\
					</div><div class="col-md-4 col-sm-4">\
						<h4 style="color:#FFB500" class="m-t-0">Есть в наличие</h4>'+tovar_result+'\
						<h5>Характеристики</h5>\
						<div class="row f12"><div id="harakteristika">'+harakteristika+'</div>\
							 <div class="clearfix"></div><div class="col-md-12"><a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">Показать легенду</a></div>\
							<div class="col-md-6 col-sm-4 col-xs-6"><p id="cena" class="cena">'+cena+'р.</p>\
							</div><div id="smena_knopki" class="col-md-6 col-sm-8 col-xs-6"><button class="btn-add-to-cart btn-add-to-cart-kr btn-modal" onclick="cart.addToCart(this, \''+id+'\');yaCounter34380610.reachGoal(\'sale2\');">Купить</button></div>\
				</div></div></div>\
				<h3>Уникальное предложение</h3>\
				<div class="row ytp">\
					<div class="col-lg-2 col-sm-2 col-xs-8 text-center">\
						<img title="'+name+'" src="images/prise/240x135/'+id+'.jpg" class="image">\
						<p>'+name.replace(/STAR WARS/g, "<span class='starwars'>STAR WARS</span>")+'</p>\
					</div><div class="col-lg-1 col-sm-1 col-xs-3 text-center"><p class="f60">+</p>\
					</div><div class="col-lg-2 col-sm-2 col-xs-8 text-center">\
						<img title="'+name1+'" src="images/prise/240x135/'+arr[0]+'.jpg" class="image" onclick="window.modal_form(\''+arr[0]+'\');">\
						<p>'+name1.replace(/STAR WARS/g, "<span class='starwars'>STAR WARS</span>")+'</p>\
					</div><div class="col-lg-1 col-sm-1 col-xs-3 text-center"><p class="f60">+</p>\
					</div><div class="col-lg-2 col-sm-2 col-xs-8 text-center">\
						<img title="'+name2+'" src="images/prise/240x135/'+arr[1]+'.jpg" class="image" onclick="window.modal_form(\''+arr[1]+'\');">\
						<p>'+name2.replace(/STAR WARS/g, "<span class='starwars'>STAR WARS</span>")+'</p>\
					</div><div class="col-lg-1 col-sm-1 col-xs-3 text-center"><p class="f60">=</p>\
					</div><div class="col-lg-3 col-sm-3 col-xs-10 col-xs-offset-1">\
						<p class="f18">Ваша цена: '+arr[2]+'р.</br>Ваша выгода: '+arr[3]+'р.</p>\
						<button class="btn-add-to-cart btn-add-to-cart-zel btn-modal" onclick="cart.addToCart(this, \''+id+'_3\'); yaCounter34380610.reachGoal(\'sale3\');">Добавить в корзину</button>\
					</div>\
				</div>\
				<div id="collapseOne" class="panel-collapse collapse"><h3>Легенда</h3>'+collapse.replace(/STAR WARS/g, "<span class='starwars'>STAR WARS</span>")+'</div>\
			</div>\
		</div><!-- /.modal-content -->\
	</div><!-- /.modal-dialog -->\
</div>';
	if ($('#bcontainer').css("display")!="none"){$("#bcontainer").modal('hide');}
	if ($("#form_modal").html()==''){}else{$("#modal_active").modal('hide');}
	setTimeout(function(){	
		$("#form_modal").html(temp);$("#modal_active").modal('show');
		load_picture(id);
	},500);
}

function arr0(){//массив товаров
	var arr = new Array();
arr[0]=['75111-','75112','75113','75117+','75128','75101','75099','75137','75043','75048','75049','75051','75052','75053','75059*','75060*','75072','75073','75074','75075','75076','75077','75078','75079','75080','75081','75082','75083','75084','75088','75089','75090','75091','75092','75093-','75094','75095*','75100','75102+','75103','75104','75105-','75106-','75107','75108','75109-','75110-','75114+','75115+','75116+','75118+','75126','75127','75129','75130','75131+','75132+','75133+','75134','75135+','75136','75138','75139','75140','sy1961','sy1962','sy1963','sy1964','sy198*','sy229','sy309','sy310','sy311','sy312'];
arr[1]=['445311-','1400606','b3678-','su701','84617','a8560','td801','00172','00226','00227','00239','15046','15091','15202','34239','44527-','44529-','52100','52108-','84610','84611','84612','84613','84614','84615','84616-','84622','84623*','84624-','84625','84626*','84627','84628','84629','84630','1400605','1400608','1400611','1400612','1400616','b3171','b3173+','b3223','b3224+','b36721+','b36722+','b38311','b38312','b3953','sc01','sc02','sc03','sc05','st901*','st922*','su702','td810','td811'];
arr[2]=['st921*','58712','65219','65221','71646','73819','78227','78228','78229','78234','78236','78241','78242','78243','835720','835740','835770-','835850','835870','908050','908060','908190','908230+','908240+','908250','949430+','a85611','a85612','b3659-','b36661','b36662','b36663','b3908','b39081','b39082+','b39083','b39141','b39142','b39461','b39462','b39463','b39464','b39465','bs05','bs07','bs08','bs09+','bs10+','st701-','st751','st752','st753','st754','st755','st759','st760','st762','st765','st767','st768','st771-','st772','st775','st776','st782','st783','st801*'];
arr[3]=['td830*','td820*','52107','w14-','w25-','w24','w11','w10','w12s','w13','w15','w16','w18','w19','w20','w21','w22','w23','w26','w27l','w28','w29','w3','w4','w5','w6','w7','w8','w9'];
arr[4]=['75111-','75112','75113','75117+','st921*','445311-','84626*','1400606'];
	return arr;
}

function load_picture(id){//загрузка картинок
	var oReq=[],
	ii=0;
	for(var i=1;i<5;i++){ //подгрузка картинок с сервера
		var oReq1 = getXmlHttp();
		oReq[i]=oReq1;
		if (oReq[i] != null) {
			var sUrl = 'images/prise/50x28/'+id+'_'+i+'.jpg';
			oReq[i].open("GET", sUrl, true);
			oReq[i].overrideMimeType('text/plain; charset=x-user-defined');
			oReq[i].send();
			oReq[i].onreadystatechange = function(e) {
				if (this.readyState == 4 && this.status == 200) {
					ii+=1;
					var img_1='<ol class="carousel-indicators">',
						img_2='</ol><div class="carousel-inner" role="listbox">';
					for(var itemp=0;itemp<ii;itemp++){
						var i1=itemp+1;
						if(itemp==0){
							img_1+='<li data-target="#carousel-prise" data-slide-to="'+itemp+'" class="active">';
							img_2+='<div class="item active">';
						}else{
							img_1+='<li data-target="#carousel-prise" data-slide-to="'+itemp+'">';
							img_2+='<div class="item">';
						}
						img_1+='<img class="img-thumbnail center-block" src="images/prise/50x28/'+id+'_'+i1+'.jpg"></li>';
						img_2+='<img class="img-thumbnail center-block" src="images/prise/534x300/'+id+'_'+i1+'.jpg"></div>';
					}
					var img_result = img_1+img_2+'</div>\
						<a class="left carousel-control" href="#carousel-prise" data-slide="prev"><img style="left:0" src="images/prev.png"></a>\
						<a class="right carousel-control" href="#carousel-prise" data-slide="next"><img style="right:0" src="images/next.png"></a>';
					document.getElementById('carousel-prise').innerHTML = img_result;
				}
			}
		}
		else {window.alert("Error creating XmlHttpRequest object.");}
	}
}
function select_arr(var_prise){//подгружает нужный массив
	var arr = arr0();
	switch (var_prise) { //Варианты превью товаров
		case "lego": return arr[0]; break;
		case "drugie": return arr[1]; break;
		case "figurki": return arr[2]; break;
		case "home": return arr[3]; break;
		case "promo": return arr[4]; break;
		case "all": var arr_all=arr[0].concat(arr[1],arr[2],arr[3]); return arr_all; break; 
		default:
			arr_new = active_mas('lr');
			for (var i = 0; i < arr_new.length; i++)//формирование ссылок перехода влево и вправо
				if (~arr_new[i].indexOf(var_prise)){
					var n1=arr_new[i-1],
						n2=arr_new[i+1];
					if(!n1)n1=arr_new[arr_new.length-1];
					if(!n2)n2=arr_new[0];
					if(~n1.indexOf('+')){n1=n1.substring(0,n1.indexOf('+'));}else{if(~n1.indexOf('-')){n1=n1.substring(0,n1.indexOf('-'));}else{if(~n1.indexOf('*'))n1=n1.substring(0,n1.indexOf('*'));}}
					if(~n2.indexOf('+')){n2=n2.substring(0,n2.indexOf('+'));}else{if(~n2.indexOf('-')){n2=n2.substring(0,n2.indexOf('-'));}else{if(~n2.indexOf('*'))n2=n2.substring(0,n2.indexOf('*'));}}
					return [n1, n2];
				}
			return [arr_new[0],arr_new[i-1]];
		break;
	}
}

function sCena(a, b) { //по цене от меньшего к большему
if (a[1] > b[1]) return 1;
else if (a[1] < b[1]) return -1;
else return 0;
}
function mCena(a, b) {//по цене от большего к меньшему
if (a[1] < b[1]) return 1;
else if (a[1] > b[1]) return -1;
else return 0;
}

function active_mas(var_prise){
		var htmlStr = $("#allprise").html(),
			arr_new = [],
			arr = "",
			ii = 0,
			val = "",
			t = "",
			id = "",
			arr_temp = arr0();
		for (var i = 0; ~htmlStr.indexOf("modal_form("); i++){ //создание массива
			num_left=htmlStr.indexOf("modal_form(")+12;
			num_right=htmlStr.indexOf('\'', num_left);
			htmlStr_temp=htmlStr;
			htmlStr=htmlStr.substring(num_left);
			arr = htmlStr_temp.substring(num_left, num_right);
			for (var ii1 = 0; ii1 < 3; ii1++)
				for (var iii = 0; iii < arr_temp[ii1].length; iii++)
					if (~arr_temp[ii1][iii].indexOf(arr)){arr1=arr_temp[ii1][iii];}
			switch(var_prise){
				case "-": case "+": case "*":  name = arr1; arr=arr1; break;
				case "lr": arr_new[ii++] = arr; break;
				default: name=$('#'+arr).data('filter'); break;
			}
			if(~name.indexOf(var_prise))arr_new[ii++] = arr;//выбираем добавлять ли
		}
	return arr_new;
}
function personag_filter(e){ //фильтр по параметрам
	var arr = [],
		arr1 =[],
		iii = 0,
		str = '',
		all = false,
		ii = 0,
		err = false,
		var_prise=$(e.target).data('person');//вариант фильтра
		if(var_prise==null) {
			switch(e){
				case "wader": var_prise="Вейдер"; break;
				case "shturmovik": var_prise="Штурмовик"; break;
				case "grivus": var_prise="Гривус"; break;
				case "enakin": var_prise="Энакин"; break;
				case "luk": var_prise="Люк"; break;
				case "ren": var_prise="Рен"; break;
				case "ioda": var_prise="Йода"; break;
				default: var_prise=e;
			}
			err = true;
		}

	if(!$("#filter_this").prop('checked')){
		var arr_temp = select_arr("all");
		for (var i = 0; i < arr_temp.length; i++){ //создание массива
			var n1=arr_temp[i];
			if(~n1.indexOf('+')){n1=n1.substring(0,n1.indexOf('+'));}else{if(~n1.indexOf('-')){n1=n1.substring(0,n1.indexOf('-'));}else{if(~n1.indexOf('*'))n1=n1.substring(0,n1.indexOf('*'));}}
			switch(var_prise){
				case "-": case "+": case "*":  name = n1; if(~name.indexOf(var_prise))arr[ii++] = arr_temp[i]; break;
				case "Энакин": case "Люк": case "Вейдер": case "Йода": case "Кеноби": case "Хан": case "C-3PO": case "R2-D2": case "BB-8": case "Дроид": case "Чубакка": case "Штурмовик": case "Солдат": case "Пилот": case "Инквизитор": case "Бинкс": case "Рей": case "Рен": case "Финн": case "Гривус": case "По Дамерон":
					if(!all){
						str = $("#"+n1).data("name");
					}else{str = $("#" + n1 + "_1").html();}
					if(~str.indexOf(var_prise)){
						if(!all){arr[iii++] = n1;}else{arr1[iii++] = n1;}
						arr_temp.splice(i,1);
						i = i-1;
					}
					if(i == arr_temp.length-1 && !all){
						all=true;
						i=0;
						iii=0;
					}
				break;
				default: 
					name=$('#'+n1).data('filter'); if(~name.indexOf(var_prise))arr[ii++] = arr_temp[i]; break;
			}
		}
	}else{
		arr = active_mas(var_prise);
	}

	if(arr.length==0 && arr1.length==0){
		$('#modalerror').fadeIn(500).delay(1500).fadeOut(500);
	}else{
		var_prise = $('.prise').attr('id');
		if (all){
			var tovar = "\
				<div id='seach' class='prise "+var_prise+" container'>\
				<div class='row'><h3>Результаты поиска в названии</h3>" + form_prise(arr) + "<h3>Результаты поиска в описании</h3>" + form_prise(arr1) + "</div></div>";			
		}else{
			var tovar = "\
				<div id='"+var_prise+"' class='prise "+var_prise+" container'>\
				<div class='row'>" + form_prise(arr) + "</div></div>";
		}

		$("#allprise").html('');
		$("#allprise").append(tovar);
//		if (var_prise!='promo'){if ($(window).width()<768){navigation(var_prise,var_prise);}else{navigation(var_prise,"nav2");}}
		if(!err){
			if($(".best-match-on")&&!$("#filter_this").prop('checked'))$(".best-match-on").removeClass("best-match-on").addClass("best-match-off");
			e.target.className = "best-match-on";
			var o = document.getElementById("price_lowest_1");
			o.className = "narrow-price";			
		}
	}
}

function seach(){//поиск по товарам
	if (!$("#seach").val()){
		return false;
	}else{
		var s=$("#seach").val();
	}
	s = s.toLowerCase();
	$.post("seach.php",{str: s});
	var arr = [],
	arr1 =[],
	iii = 0,
	all = false,
	arr_s = s.split(' '),
	str = '',
	arr_temp = select_arr("all");
	
	for (var i = 0; i < arr_s.length; i++){
		arr_s[i] = arr_s[i].toLowerCase();
		if(arr_s[i+1])arr_s[i+1] = arr_s[i+1].toLowerCase();
		switch(arr_s[i]){
			case 'r2': case 'р2': case 'р2-д2': case 'r2d2': arr_s[i] = 'r2-d2'; if(arr_s[i+1]=='d2' || arr_s[i+1]=='д2')arr_s.splice(i+1,1); break;
			case 'Эни': case 'анакин': arr_s[i] = 'энакин'; break;
			case 'оби': arr_s[i] = 'оби-ван'; if(arr_s[i+1]=='ван')arr_s.splice(i+1,1); break;
			case 'c': if(arr_s[i+1]=='3po'){arr_s.splice(i+1,1); arr_s[i] = 'c-3po';} break;
			case 'c3po': arr_s[i] = 'c-3po'; break;
			case 'bb8': case 'bb': arr_s[i] = 'bb-8'; if(arr_s[i+1]=='8')arr_s.splice(i+1,1); break;
			case 'shlem': arr_s[i] = 'шлем'; break;
		}
	}	
	for (var i = 0; i < arr_temp.length; i++){
		if(!all){
			if(~arr_temp[i].indexOf('+')){arr_temp[i]=arr_temp[i].substring(0,arr_temp[i].indexOf('+'));}else{if(~arr_temp[i].indexOf('-')){arr_temp[i]=arr_temp[i].substring(0,arr_temp[i].indexOf('-'));}else{if(~arr_temp[i].indexOf('*'))arr_temp[i]=arr_temp[i].substring(0,arr_temp[i].indexOf('*'));}}
			str = $("#"+arr_temp[i]).data("name");
		}else{str = $("#"+arr_temp[i]+"_1").html();}
		str = str.toLowerCase();
		for (var ii = 0; ii < arr_s.length; ii++){
			if(~str.indexOf(arr_s[ii])){
				if(ii==arr_s.length-1){
					if(!all){arr[iii++] = arr_temp[i];}else{arr1[iii++] = arr_temp[i];}
					arr_temp.splice(i,1);
					i = i-1;
				}
			}else{ii=arr_s.length;}
		}
		if(i == arr_temp.length-1 && !all){
			all=true;
			i=0;
			iii=0;
		}
	}
	var_prise = $('.prise').attr('id');
	if(iii==0 && ii==0){
		$('#modalerror').fadeIn(500).delay(1500).fadeOut(500);
	}else{
		var tovar = "\
			<div id='seach' class='prise "+var_prise+" container'>\
			<div class='row'><h3>Результаты поиска в названии</h3>" + form_prise(arr) + "<h3>Результаты поиска в описании</h3>" + form_prise(arr1) + "</div></div>";
		$("#allprise").html('');
		$("#allprise").append(tovar);
		if($(".best-match-on"))$(".best-match-on").removeClass("best-match-on").addClass("best-match-off");
	}
//	if (var_prise!='promo'){if ($(window).width()<768){navigation(var_prise,var_prise);}else{navigation(var_prise,"nav2");}}
}

function smena_tovara(e,i){//выбор товара в карточке товара и смена описания с ценой
	var id = $(e.target).data('new');
	var collapse = document.getElementById(id+'_1').innerHTML;
	
	document.getElementById('harakteristika').innerHTML = document.getElementById(id+'_2').innerHTML;
	document.getElementById('cena').innerHTML = $('#'+id).data('cena')+" р.";
	document.getElementById('collapseOne').innerHTML = '<h3>Легенда</h3>'+collapse.replace(/STAR WARS/g, "<span class='starwars'>STAR WARS</span>");
	document.getElementById('smena_knopki').innerHTML = '<button class="btn-add-to-cart btn-add-to-cart-kr btn-modal" onclick="cart.addToCart(this, \''+id+'\');yaCounter34380610.reachGoal(\'sale2\');">Купить</button>';
	if(i==1)load_picture(id);

	if($(".view-filter1 .best-match-on"))$(".view-filter1 .best-match-on").removeClass("best-match-on").addClass("best-match-off");
	e.target.className = "best-match-on";
}

function loadcity(e){
	switch (e){
		case "Новосибирск": t=1;break;
		case "Кемерово":case "Омск":case "Томск":case "Тюмень": t=4; break;
		case "Барнаул":case "Екатеринбург":case "Красноярск":case "Курган":case "Пермь": t=5; break;
		case "Владимир":case "Иркутск":case "Киров":case "Ханты-Мансийск":case "Челябинск": t=6; break;
		case "Абакан":case "Волгоград":case "Горно-Алтайск":case "Магадан":case "Пенза":case "Самара":case "Саратов":case "Улан-Удэ":case "Уфа":case "Чита": t=7; break;
		case "Вологда":case "Иваново":case "Ижевск":case "Йошкар-Ола":case "Москва":case "Нижний Новгород":case "Оренбург":case "Ростов-на-Дону":case "Рязань":case "Тамбов":case "Ульяновск":case "Чебоксары": t=8; break;
		case "Архангельск":case "Астрахань":case "Белгород":case "Биробиджан":case "Владикавказ":case "Воронеж":case "Калининград":case "Краснодар":case "Курск":case "Кызыл":case "Майкоп":case "Нальчик":case "Орел":case "Петрозаводск":case "Ставрополь":case "Сыктывкар":case "Тула":case "Хабаровск":case "Ярославль": t=9; break;
		case "Благовещенск":case "Брянск":case "Владивосток":case "Грозный":case "Казань":case "Калуга":case "Кострома":case "Липецк":case "Мурманск":case "Нарьян-Мар":case "Санкт-Петербург":case "Тверь":case "Черкесск":case "Элиста": t=10; break;
		case "Махачкала":case "Назрань":case "Саранск":case "Смоленск": t=11; break;
		case "Псков":case "Салехард": t=12; break;
		case "Великий Новгород": t=13; break;
		case "Южно-Сахалинск": t=15; break;
		case "Якутск": t=16; break;
		case "Анадырь": t=24; break;
		case "Петропавловск-Камчатский": t=32; break;
		default: t=0; break;
	}
return t;	
}

function loadPrice(e){ //смена и подгрузка города
	var t = loadcity(e);
	$(".cityTo [value='"+e+"']").attr("selected", true);
	if(document.getElementById("timedost")){cart.reCalc();}else $('.resultText').html('0');
	if(e == "Новосибирск"){
		$(".nsk").css('display','block');
		$(".city_all").css('display','none');
	}else{
		$(".nsk").css('display','none');
		$(".city_all").css('display','block');
	}
}

function loadLocations(){
	if (typeof ymaps === 'undefined' || typeof ymaps.geolocation === 'undefined') {
		setTimeout(loadLocations, 100);
		return;
	}
	var html = '<option value="Новосибирск">Новосибирск</option><option value="Москва">Москва</option><option value="Санкт-Петербург">Санкт-Петербург</option><option value="Абакан">Абакан</option><option value="Анадырь">Анадырь</option><option value="Архангельск">Архангельск</option><option value="Астрахань">Астрахань</option><option value="Барнаул">Барнаул</option><option value="Белгород">Белгород</option><option value="Биробиджан">Биробиджан</option><option value="Благовещенск">Благовещенск</option><option value="Брянск">Брянск</option><option value="Великий Новгород">Великий Новгород</option><option value="Владивосток">Владивосток</option><option value="Владикавказ">Владикавказ</option><option value="Владимир">Владимир</option><option value="Волгоград">Волгоград</option><option value="Вологда">Вологда</option><option value="Воронеж">Воронеж</option><option value="Горно-Алтайск">Горно-Алтайск</option><option value="Грозный">Грозный</option><option value="Екатеринбург">Екатеринбург</option><option value="Иваново">Иваново</option><option value="Ижевск">Ижевск</option><option value="Йошкар-Ола">Йошкар-Ола</option><option value="Иркутск">Иркутск</option><option value="Казань">Казань</option><option value="Калининград">Калининград</option><option value="Калуга">Калуга</option><option value="Кемерово">Кемерово</option><option value="Киров">Киров</option><option value="Кострома">Кострома</option><option value="Краснодар">Краснодар</option><option value="Красноярск">Красноярск</option><option value="Курган">Курган</option><option value="Курск">Курск</option><option value="Кызыл">Кызыл</option><option value="Липецк">Липецк</option><option value="Магадан">Магадан</option><option value="Майкоп">Майкоп</option><option value="Махачкала">Махачкала</option><option value="Мурманск">Мурманск</option><option value="Назрань">Назрань</option><option value="Нальчик">Нальчик</option><option value="Нарьян-Мар">Нарьян-Мар</option><option value="Нижний Новгород">Нижний Новгород</option><option value="Омск">Омск</option><option value="Орел">Орел</option><option value="Оренбург">Оренбург</option><option value="Пенза">Пенза</option><option value="Пермь">Пермь</option><option value="Петрозаводск">Петрозаводск</option><option value="Петропавловск-Камчатский">Петропавловск-Камчатский</option><option value="Псков">Псков</option><option value="Ростов-на-Дону">Ростов-на-Дону</option><option value="Рязань">Рязань</option><option value="Салехард">Салехард</option><option value="Самара">Самара</option><option value="Саранск">Саранск</option><option value="Саратов">Саратов</option><option value="Смоленск">Смоленск</option><option value="Ставрополь">Ставрополь</option><option value="Сыктывкар">Сыктывкар</option><option value="Тамбов">Тамбов</option><option value="Тверь">Тверь</option><option value="Томск">Томск</option><option value="Тула">Тула</option><option value="Тюмень">Тюмень</option><option value="Улан-Удэ">Улан-Удэ</option><option value="Ульяновск">Ульяновск</option><option value="Уфа">Уфа</option><option value="Хабаровск">Хабаровск</option><option value="Ханты-Мансийск">Ханты-Мансийск</option><option value="Чебоксары">Чебоксары</option><option value="Челябинск">Челябинск</option><option value="Черкесск">Черкесск</option><option value="Чита">Чита</option><option value="Элиста">Элиста</option><option value="Южно-Сахалинск">Южно-Сахалинск</option><option value="Якутск">Якутск</option><option value="Ярославль">Ярославль</option>';
	$('.cityTo').html(html);
	loadPrice(ymaps.geolocation.city);
}