<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
	<title>Google Map</title>
	<link rel="shortcut icon" href="./meters_assets/favicon.ico">

	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBk16TLq0U3F-ZjH0UuuELj4M1A_BxlWS8&&librariescallback=initMap"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>


	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

	<link rel="stylesheet" href="./meters_assets/tingle-master/tingle.css">
	<script src="./meters_assets/tingle-master/tingle.js"></script>
	<link rel="stylesheet" href="./meters_assets/css/style.css">
	<style>
		.scrollbar{
			float: left;
			height: 80vh;
			width: 100%;
			background: #f1f1f1;
			overflow-y: scroll;
			scrollbar-width: thin;
			border-top: 1vh #4CAF50 solid;
		}
		.scrollbar::-webkit-scrollbar {background-color:#fff;height:1px;width:7px}
		.scrollbar::-webkit-scrollbar-track {background-color:#fff}
		.scrollbar::-webkit-scrollbar-thumb {background-color:#babac0;}
		.showlist{
			word-break: break-all;
		}
		.showlist .size1{
			font-size: 13px;
		}
		.showlist .size2{
			font-size: 12px;
		}
	</style>
  </head>
  <body id="root">	
	<div class="wrapper d-flex align-items-stretch">
		<nav id="sidebar" style="z-index: 2; !important">
			<div style="border-top: 1vh #4CAF50 solid; padding: 5px">
				<input class="form-control" id="searchdata" value="" onchange="selectlistdata()"style="height:5vh; width: 100%; margin: auto;" placeholder="Search list...">
			</div>
			<div class="container_s">
				<div class="vertical-center_s">
					<p style="font-size: 17px; color: black; margin:auto; line-height: 25px;" id="cop_name"></p>
					<p style="font-size: 14px; color: black; margin:auto; line-height: 25px;" id="cop_address"></p>
				</div>
			</div>
			
			<a id="canvasimg" href="" download="" style="display:none"></a>
			<div class="scrollbar" id="showdata" style="color: black; font-size: 10px; padding: 2px; !important">

			</div>
		</nav>
		<div id="content" class="p-4 p-md-5 pt-5" style="z-index: 0; !important">

		</div>
	</div>
	<script src="./meters_assets/js/main.js"></script>
    <script src="./meters_assets/js/popper.js"></script>
    <script src="./meters_assets/js/bootstrap.min.js"></script>
  </body>
</html>