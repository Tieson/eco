
<!DOCTYPE html>
<html lang='cs'>
<head>
	<title>Grafický editor číslicových obvodů v HTML5</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset='utf-8'>
	<!--<meta name='description' content=''>-->
	<meta name='keywords' content='Editor, Digital circuits, číslicové obvody, simulace, interaktivní'>
	<!--<meta name='author' content='Tomáš Václavík'>-->
	<meta name='robots' content='all'>
    <meta name="theme-color" content="#F58220">

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" href="assets/js/libs/bootstrap/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="assets/js/libs/jointjs/dist/joint.min.css">
	<link rel="stylesheet" href="assets/js/libs/sweetalert/dist/sweetalert.css" type="text/css">
	<link rel="stylesheet" href="assets/js/libs/bootstrap-datepicker/dist/css/bootstrap-datepicker.css" type="text/css">
	<link rel="stylesheet" href="assets/js/libs/clockpicker/dist/bootstrap-clockpicker.min.css" type="text/css">
	<link rel="stylesheet" href="assets/css/style.css?<?php echo filemtime('assets/css/style.css'); ?>">

	<!--TODO: stahnout jquery.hotkeys jako bower plugin	<script src="../scripts/jquery.hotkeys.js"></script>-->

	<script src="assets/js/libs/jquery/dist/jquery.min.js"></script>
	<script src="assets/js/libs/jquery-ui/jquery-ui.min.js"></script>
	<script src="scripts/jquery.hotkeys.js"></script>
	<script src="assets/js/libs/lodash/lodash.min.js"></script>
	<script src="assets/js/libs/backbone/backbone-min.js"></script>
	<script src="scripts/Backbone.Undo.min.js"></script>
	<!--	<script src="assets/js/libs/backbone-relational/backbone-relational.js"></script>-->
	<script src="assets/js/libs/backbone.localStorage/backbone.localStorage-min.js"></script>
	<!--	<script src="assets/js/libs/backbone.marionette/lib/backbone.marionette.min.js"></script>-->
	<script src="assets/js/libs/moment/min/moment.min.js"></script>
	<script src="assets/js/libs/moment/locale/cs.js"></script>
	<script src="assets/js/libs/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"></script>
	<script src="assets/js/libs/bootstrap-datepicker/dist/locales/bootstrap-datepicker.cs.min.js"></script>
	<script src="assets/js/libs/clockpicker/dist/bootstrap-clockpicker.min.js"></script>

	<script src="assets/js/libs/jointjs/dist/joint.js"></script>
	<script src="assets/js/libs/bootstrap/dist/js/bootstrap.min.js"></script>

	<script src="assets/js/libs/list.js/dist/list.min.js"></script>

	<script src="assets/js/libs/sweetalert/dist/sweetalert.min.js"></script>

	<script src="scripts/joint.shapes.mylib.js?<?php echo(filemtime('./scripts/joint.shapes.mylib.js'))?>"></script>
	<!--<script src="/scripts/utils/fileLoader.js"></script>-->
	<!--<script src="/scripts/utils/Counter.js"></script>-->
	<!--<script src="/scripts/utils/Serialization.js"></script>-->


	<!--TODO: nahradit Backbone modelem/pohledem	<script src="/scripts/Creator.js"></script>-->
	<!--<script src="/scripts/VhdExport.js"></script>-->
	<!--<script src="/scripts/VhdImport.js"></script>-->

    <script>
        var config = {
            basedir: '<?php echo $projectDir ?>'
        }
    </script>


	<style>
		.joint-element .output, .joint-element .input
		{
			fill: #fff;
			stroke: #7f8c8d;
			stroke-opacity: 0.5;
			stroke-width: 2px;
		}
		.joint-element .not_gate
		{
			fill: none;
			stroke: #000000;
			stroke-opacity: 1;
			stroke-width: 2px;
		}
		.joint-element .entitybody
		{
			fill: #fff;
			stroke: #000000;
			stroke-opacity: 1;
			stroke-width: 2px;
		}
		.joint-element .label
		{
			fill: #000000;
			font-size: 15px;
			font-weight:400;
		}
	</style>

</head>
<body style="position: relative;">