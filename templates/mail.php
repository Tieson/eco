<?php
function formatMailMessage($subject, $url, $page)
{
	$msg = '
<html lang="cs">
<head>
	<style>
		body {
			padding: 0;
			marging: 0;

		}
		.container {
			text-align: left;
		}
		h1 {
			font-size: 2em;
			margin: 0 0 0 0;
			border-bottom: solid 1px;
			display: inline-block;
			padding: 0 2.5em;
			line-height: 0.9em;
		}
		h2 {
			font-size: 1.5em;
			border-bottom: solid 1px;
			text-align: center;
			display: inline-block;
			padding: 0 2.0em;
			margin: 1.5em auto 0.5em;
			line-height: 0.9em;
		}
		p {
			font-size: 1.2em;
			line-height: 1.5em;
			color: #222222;
			margin: 1em 0;
			text-align: left;
		}
		.subtext {
			font-size: 1.2em;
			margin: 0 0 1em 0;
			color: #333;
		}
		table {
			/*width: 100%;*/
			border: 0;
			text-align: left;
		}
		tr, td, th {
			border: 0;
			text-align: left;
		}
		td {
			padding: 0.2em 0.5em;
		}
		th {
			font-weight: bold;
		}
	</style>
</head>
<body>
<div class="container">
	<h1>'.$subject.'</h1>
	<p>
		Pro aktivaci účtu a ověření e-mailu pokračujte na následující odkaz: <a href="'.$url.'">$url</a>
		<br>
		Odesláno ze stránky: '.$page.'
	</p>
</div>
</body>
</html>';

	return $msg;
}