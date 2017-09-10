<?php
/**
 * Created by Tom on 05.09.2017.
 */
/**
 * Created by PhpStorm.
 * User: Tom
 * Date: 05.09.2017
 * Time: 17:19
 */
//$config = require('./config/config.php');


$sql1 = file_get_contents('./sql/1.sql');

define('_INSTALLER_IGNORE_CONFIG_CHECK', true);

//var_dump($sql1);

//function getDB()
//{
//	global $config;
//	$dbhost = $config['db']['host'];
//	$dbuser = $config['db']['user'];
//	$dbpass = $config['db']['password'];
//	$dbname = $config['db']['database'];
//
//	$mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname;charset=utf8";
//	$dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass);
//	$dbConnection->exec("set names utf8");
//	$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//	$dbConnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, 1);
//	return $dbConnection;
//}

//$db = getDB();
//$sth = $db->prepare($sql1);
//
//$result = $sth->execute();
//
//if($result){
//    echo'<br>install OK<br>';
//	$sth = $db->prepare("SELECT * FROM entities");
//
//	$sth->execute();
//	$schemas = $sth->fetchAll(PDO::FETCH_OBJ);
//
//
//	var_dump($schemas);
//
//	$db = null;
//}else{
//    echo 'install Fail';
//}
//
//
//
//exit();

?>

<html>
<head>
    <title>Tiny Tiny RSS - Installer</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset='utf-8'>
    <!--<meta name='description' content=''>-->
    <meta name='keywords' content='Editor, Digital circuits, číslicové obvody, simulace, interaktivní'>
    <!--<meta name='author' content='Tomáš Václavík'>-->
    <meta name='robots' content='all'>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/js/libs/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/js/libs/jointjs/dist/joint.min.css">
    <link rel="stylesheet" href="assets/js/libs/sweetalert/dist/sweetalert.css" type="text/css">
    <link rel="stylesheet" href="assets/js/libs/bootstrap-datepicker/dist/css/bootstrap-datepicker.css" type="text/css">
    <link rel="stylesheet" href="assets/js/libs/clockpicker/dist/bootstrap-clockpicker.min.css" type="text/css">
    <link rel="stylesheet" href="assets/css/style.css">


    <script src="assets/js/libs/jquery/dist/jquery.min.js"></script>
    <script src="assets/js/libs/jquery-ui/jquery-ui.min.js"></script>
    <script src="scripts/jquery.hotkeys.js"></script>
    <script src="assets/js/libs/lodash/lodash.min.js"></script>
    <script src="assets/js/libs/backbone/backbone-min.js"></script>
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
</head>
<body class="claro">
<div class="container">
	<?php

	// could be needed because of existing config.php
	function define_default($param, $value)
	{
		//
	}

	function make_password($length = 8)
	{

		$password = "";
		$possible = "0123456789abcdfghjkmnpqrstvwxyzABCDFGHJKMNPQRSTVWXYZ*%+^";

		$i = 0;

		while ($i < $length) {
			$char = substr($possible, mt_rand(0, strlen($possible) - 1), 1);

			if (!strstr($password, $char)) {
				$password .= $char;
				$i++;
			}
		}
		return $password;
	}


	function sanity_check($db_type)
	{
		$errors = array();

		if (version_compare(PHP_VERSION, '5.3.3', '<')) {
			array_push($errors, "PHP version 5.3.3 or newer required.");
		}

		if (!function_exists("curl_init") && !ini_get("allow_url_fopen")) {
			array_push($errors, "PHP configuration option allow_url_fopen is disabled, and CURL functions are not present. Either enable allow_url_fopen or install PHP extension for CURL.");
		}

		if (!function_exists("json_encode")) {
			array_push($errors, "PHP support for JSON is required, but was not found.");
		}

		if ($db_type == "mysql" && !function_exists("mysqli_connect")) {
			array_push($errors, "PHP support for MySQL is required for configured $db_type in config.php.");
		}

		if (!function_exists("hash")) {
			array_push($errors, "PHP support for hash() function is required but was not found.");
		}

		if (!function_exists("iconv")) {
			array_push($errors, "PHP support for iconv is required to handle multiple charsets.");
		}

		if (ini_get("safe_mode")) {
			array_push($errors, "PHP safe mode setting is obsolete and not supported by tt-rss.");
		}


		return $errors;
	}

	function print_error($msg)
	{
		print "<div class='alert alert-error'>$msg</div>";
	}

	function print_notice($msg)
	{
		print "<div class=\"alert alert-info\">$msg</div>";
	}

	function db_connect($host, $user, $pass, $db, $type, $port = false)
	{
		if ($type == "pgsql") {

			$string = "dbname=$db user=$user";

			if ($pass) {
				$string .= " password=$pass";
			}

			if ($host) {
				$string .= " host=$host";
			}

			if ($port) {
				$string = "$string port=" . $port;
			}

			$link = pg_connect($string);

			return $link;

		} else if ($type == "mysql") {
			if ($port)
				return mysqli_connect($host, $user, $pass, $db, $port);
			else
				return mysqli_connect($host, $user, $pass, $db);
		}
	}

	function make_config($DB_TYPE, $DB_HOST, $DB_USER, $DB_NAME, $DB_PASS,
	                     $DB_PORT, $SELF_URL_PATH)
	{

		$data = explode("\n", file_get_contents("../config.php-dist"));

		$rv = "";

		$finished = false;

		foreach ($data as $line) {
			if (preg_match("/define\('DB_TYPE'/", $line)) {
				$rv .= "\tdefine('DB_TYPE', '$DB_TYPE');\n";
			} else if (preg_match("/define\('DB_HOST'/", $line)) {
				$rv .= "\tdefine('DB_HOST', '$DB_HOST');\n";
			} else if (preg_match("/define\('DB_USER'/", $line)) {
				$rv .= "\tdefine('DB_USER', '$DB_USER');\n";
			} else if (preg_match("/define\('DB_NAME'/", $line)) {
				$rv .= "\tdefine('DB_NAME', '$DB_NAME');\n";
			} else if (preg_match("/define\('DB_PASS'/", $line)) {
				$rv .= "\tdefine('DB_PASS', '$DB_PASS');\n";
			} else if (preg_match("/define\('DB_PORT'/", $line)) {
				$rv .= "\tdefine('DB_PORT', '$DB_PORT');\n";
			} else if (preg_match("/define\('SELF_URL_PATH'/", $line)) {
				$rv .= "\tdefine('SELF_URL_PATH', '$SELF_URL_PATH');\n";
			} else if (!$finished) {
				$rv .= "$line\n";
			}

			if (preg_match("/\?\>/", $line)) {
				$finished = true;
			}
		}

		return $rv;
	}

	function db_query($link, $query, $type, $die_on_error = true)
	{
		if ($type == "pgsql") {
			$result = pg_query($link, $query);
			if (!$result) {
				$query = htmlspecialchars($query); // just in case
				if ($die_on_error) {
					die("Query <i>$query</i> failed [$result]: " . ($link ? pg_last_error($link) : "No connection"));
				}
			}
			return $result;
		} else if ($type == "mysql") {

			$result = mysqli_query($link, $query);

			if (!$result) {
				$query = htmlspecialchars($query);
				if ($die_on_error) {
					die("Query <p class='alert alert-danger'>$query</p> failed: " . ($link ? mysqli_error($link) : "No connection"));
				}
			}
			return $result;
		}
	}

	function is_server_https()
	{
		return (!empty($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] != 'off')) || $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https';
	}

	function make_self_url_path()
	{
		$url_path = (is_server_https() ? 'https://' : 'http://') . $_SERVER["HTTP_HOST"] . parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

		return $url_path;
	}

	?>

    <div class="floatingLogo"><img src="../images/logo_small.png"></div>

    <h1>ECO Instalátor</h1>

    <div class='content'>

		<?php

		if (file_exists("config/config.php")) {
			require "config/config.php";

			if (!defined('_INSTALLER_IGNORE_CONFIG_CHECK')) {
				print_error("Error: config.php již existuje. Ruším operaci.");
				exit;
			}
		}

		@$op = $_REQUEST['op'];

		@$DB_HOST = strip_tags($_POST['DB_HOST']);
		@$DB_TYPE = strip_tags($_POST['DB_TYPE']);
		@$DB_USER = strip_tags($_POST['DB_USER']);
		@$DB_NAME = strip_tags($_POST['DB_NAME']);
		@$DB_PASS = strip_tags($_POST['DB_PASS']);
		@$DB_PORT = strip_tags($_POST['DB_PORT']);
		@$SELF_URL_PATH = strip_tags($_POST['SELF_URL_PATH']);

		if (!$SELF_URL_PATH) {
			$SELF_URL_PATH = preg_replace("/\/install.php$/", "/", make_self_url_path());
		}
		?>

        <form action="" method="post">
            <input class="form-control" type="hidden" name="op" value="testconfig">

            <h2>Database settings</h2>

			<?php
			$issel_pgsql = $DB_TYPE == "pgsql" ? "selected" : "";
			$issel_mysql = $DB_TYPE == "mysql" ? "selected" : "";
			?>

            <fieldset>
                <label>Database type</label>
                <select name="DB_TYPE" class="form-control">
                    <option <?php echo $issel_mysql ?> value="mysql">MySQL</option>
                </select>
            </fieldset>

            <fieldset>
                <label>Username</label>
                <input class="form-control" class="input class=" form-control" input class="form-control"-text" required
                name="DB_USER" size="20" value="<?php echo $DB_USER ?>"/>
            </fieldset>

            <fieldset>
                <label>Password</label>
                <input class="form-control" class="input class=" form-control" input class="form-control"-text"
                name="DB_PASS" size="20" type="password" value="<?php echo $DB_PASS ?>"/>
            </fieldset>

            <fieldset>
                <label>Database name</label>
                <input class="form-control" class="input class=" form-control" input class="form-control"-text" required
                name="DB_NAME" size="20" value="<?php echo $DB_NAME ?>"/>
            </fieldset>

            <fieldset>
                <label>Host name</label>
                <input class="form-control" class="input class=" form-control" input class="form-control"-text"
                name="DB_HOST" size="20" value="<?php echo $DB_HOST ?>"/>
                <span class="text text-muted">Pokud je potřeba</span>
            </fieldset>

            <fieldset>
                <label>Port</label>
                <input class="form-control" class="input class=" form-control" input class="form-control"-text"
                name="DB_PORT" type="number" size="20" value="<?php echo $DB_PORT ?>"/>
            </fieldset>

            <h2>Další nastavení</h2>

            <p>Toto by mělo bát nastaveno na umístění, kde bude aplikace dostupná.</p>

            <fieldset>
                <label>Tiny Tiny RSS URL</label>
                <input class="form-control" class="input class=" form-control" input class="form-control"-text"
                type="url" name="SELF_URL_PATH" placeholder="<?php echo $SELF_URL_PATH; ?>"
                size="60" value="<?php echo $SELF_URL_PATH ?>"/>
            </fieldset>


            <p><input class="btn btn-success" type="submit" value="Test configuration"></p>

        </form>

		<?php if ($op == 'testconfig') { ?>

            <div class="panel panel-default">
                <div class="panel-body">

                    <h2>Kontrola konfigurace serveru</h2>

					<?php
					$errors = sanity_check($DB_TYPE);

					if (count($errors) > 0) {
						print "<p>Některé konfigurační testy neprošli, prosím opravte je před pokračováním.</p>";

						print "<ul>";

						foreach ($errors as $error) {
							print "<li class='text-danger'>$error</li>";
						}

						print "</ul>";

						exit;
					}

					/**
					 * Sekce varování konfigurace
					 */
					$notices = array();

					if (!function_exists("curl_init")) {
						array_push($notices, "It is highly recommended to enable support for CURL in PHP.");
					}

					if (function_exists("curl_init") && ini_get("open_basedir")) {
						array_push($notices, "CURL and open_basedir combination breaks support for HTTP redirects. See the FAQ for more information.");
					}

					if (!function_exists("idn_to_ascii")) {
						array_push($notices, "PHP support for Internationalization Functions is required to handle Internationalized Domain Names.");
					}

					if (count($notices) > 0) {
						print_notice("Configuration check succeeded with minor problems:");

						print "<ul>";

						foreach ($notices as $notice) {
							print "<li>$notice</li>";
						}

						print "</ul>";
					} else {
						print_notice("Configuration check succeeded.");
					}

					?>
                </div>
            </div>

            <div class="panel panel-default">
                <div class="panel-body">
                    <h2>Kontrola Databáze</h2>

					<?php
					$link = db_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_TYPE, $DB_PORT);

					if (!$link) {
						print_error("Unable to connect to database using specified parameters.");
						exit;
					}

					print_notice("Database test succeeded."); ?>
                </div>
            </div>


            <div class="panel panel-default">
                <div class="panel-body">
                    <h2>Inicilazace databáze</h2>

                    <p>Předtím, než budete moci používat editor je potřeba inicializovat databázi. Pokud jste to ještě
                        neudělali, tak klikněte na náseldující tlačítko</p>

					<?php
					/**
					 * Test jestli jsou v DB již nějaké tabulky
					 */
					$result = @db_query($link, "SELECT true FROM entities", $DB_TYPE, false);

					if ($result) {
						print_error("Existující tabulky budou odstraněny z databáze. Pokud chcete zachovat svá data, přeskočte krok inicializace. ");
						$need_confirm = true;
					} else {
						$need_confirm = false;
					}
					?>

                    <table>
                        <tr>
                            <td>
                                <form method="post">
                                    <input class="form-control" type="hidden" name="op" value="installschema">

                                    <input class="form-control" type="hidden" name="DB_USER"
                                           value="<?php echo $DB_USER ?>"/>
                                    <input class="form-control" type="hidden" name="DB_PASS"
                                           value="<?php echo $DB_PASS ?>"/>
                                    <input class="form-control" type="hidden" name="DB_NAME"
                                           value="<?php echo $DB_NAME ?>"/>
                                    <input class="form-control" type="hidden" name="DB_HOST"
                                           value="<?php echo $DB_HOST ?>"/>
                                    <input class="form-control" type="hidden" name="DB_PORT"
                                           value="<?php echo $DB_PORT ?>"/>
                                    <input class="form-control" type="hidden" name="DB_TYPE"
                                           value="<?php echo $DB_TYPE ?>"/>
                                    <input class="form-control" type="hidden" name="SELF_URL_PATH"
                                           value="<?php echo $SELF_URL_PATH ?>"/>

									<?php if ($need_confirm) { ?>
                                        <div>
                                            <button onclick="return confirm('Původní data budou ostraněna. Chcete pokračovat?')"
                                                    type="submit" class="btn btn-danger">
                                                Inicializovat databázi
                                            </button>
                                        </div>
									<?php } else { ?>
                                        <div>
                                            <button class="btn btn-danger" type="submit">
                                                Inicializovat databázi
                                            </button>
                                        </div>
									<?php } ?>
                                </form>

                            </td>
                            <td>
                                <form method="post">
                                    <input class="form-control" type="hidden" name="DB_USER"
                                           value="<?php echo $DB_USER ?>"/>
                                    <input class="form-control" type="hidden" name="DB_PASS"
                                           value="<?php echo $DB_PASS ?>"/>
                                    <input class="form-control" type="hidden" name="DB_NAME"
                                           value="<?php echo $DB_NAME ?>"/>
                                    <input class="form-control" type="hidden" name="DB_HOST"
                                           value="<?php echo $DB_HOST ?>"/>
                                    <input class="form-control" type="hidden" name="DB_PORT"
                                           value="<?php echo $DB_PORT ?>"/>
                                    <input class="form-control" type="hidden" name="DB_TYPE"
                                           value="<?php echo $DB_TYPE ?>"/>
                                    <input class="form-control" type="hidden" name="SELF_URL_PATH"
                                           value="<?php echo $SELF_URL_PATH ?>"/>

                                    <input class="btn btn-danger" type="hidden" name="op" value="skipschema">
                                    <p><input class="form-control" type="submit" value="Skip initialization"></p>
                                </form>

                            </td>
                        </tr>
                    </table>
                </div>
            </div>


			<?php

		} else if ($op == 'installschema' || $op == 'skipschema') {
			?>

            <div class="panel panel-default">
                <div class="panel-body">
					<?php

					$link = db_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_TYPE, $DB_PORT);

					if (!$link) {
						print_error("Nelze se připojit k datbázi se zadanými údaji");
						exit;
					}

					if ($op == 'installschema') {

						print "<h2>Inicilizace databáze...</h2>";

						$lines = explode('_$_',preg_replace("/'[^']+'(*SKIP)(*F)|;/", '_$_', file_get_contents("schemas/eco_schema_mysql.sql")));

						print_notice('počet příkazů: '.count($lines));

						$line_n = 1;
						foreach ($lines as $line) {
							print_notice($line_n.'. OK');
							$line_n++;
							if (strpos($line, "--") !== 0 && $line) {
								db_query($link, $line, $DB_TYPE);
							}
						}

						print_notice("Instalace databáze dokončena.");

					} else {
						print_notice("Instalace databáze preskočena.");
					}


					/**
					 * Update databáze
					 */

//					$result = @db_query($link, "SELECT version FROM version", $DB_TYPE, false);
//
//					if ($result && $result > 0) {
//
//					} else {
//						$result = 0;
//					}
//					$files = array_slice(scandir('schemas/versions/'), 2);
//					$files_count = count($files);
//					print_notice('Aktuální verze databáze: ' . $result . ' počet souborů s updatem: ' . $files_count);
//
//					for ($i = $result; $i < $files_count; $i++) {
////				    $sql = file_get_contents($files[$i]);
//						echo($files[$i]);
//
//						$lines = explode(";", preg_replace("/[\r\n]/", "", file_get_contents("schemas/versions/".$files[$i])));
//
//						foreach ($lines as $line) {
//							if (strpos($line, "--") !== 0 && $line) {
//								db_query($link, $line, $DB_TYPE);
//							}
//						}
//					}


					//				print "<h2>Generated configuration file</h2>";
					//
					//				print "<p>Copy following text and save as <code>config.php</code> in tt-rss main directory. It is suggested to read through the file to the end in case you need any options changed fom default values.</p>";
					//
					//				print "<p>After copying the file, you will be able to login with default username and password combination: <code>admin</code> and <code>password</code>. Don't forget to change the password immediately!</p>"; ?>
                    <!---->
                    <!--                <form action="" method="post">-->
                    <!--                    <input class="form-control" type="hidden" name="op" value="saveconfig">-->
                    <!--                    <input class="form-control" type="hidden" name="DB_USER" value="-->
					<?php //echo $DB_USER ?><!--"/>-->
                    <!--                    <input class="form-control" type="hidden" name="DB_PASS" value="-->
					<?php //echo $DB_PASS ?><!--"/>-->
                    <!--                    <input class="form-control" type="hidden" name="DB_NAME" value="-->
					<?php //echo $DB_NAME ?><!--"/>-->
                    <!--                    <input class="form-control" type="hidden" name="DB_HOST" value="-->
					<?php //echo $DB_HOST ?><!--"/>-->
                    <!--                    <input class="form-control" type="hidden" name="DB_PORT" value="-->
					<?php //echo $DB_PORT ?><!--"/>-->
                    <!--                    <input class="form-control" type="hidden" name="DB_TYPE" value="-->
					<?php //echo $DB_TYPE ?><!--"/>-->
                    <!--                    <input class="form-control" type="hidden" name="SELF_URL_PATH" value="-->
					<?php //echo $SELF_URL_PATH ?><!--"/>-->
                    <!--					--><?php //print "<textarea cols=\"80\" rows=\"20\">";
					//					echo make_config($DB_TYPE, $DB_HOST, $DB_USER, $DB_NAME, $DB_PASS,
					//						$DB_PORT, $SELF_URL_PATH);
					//					print "</textarea>"; ?>
                    <!---->
                    <!--					--><?php //if (is_writable("..")) { ?>
                    <!--                    <p>We can also try saving the file automatically now.</p>-->
                    <!---->
                    <!--                    <p><input class="form-control" type="submit" value="Save configuration"></p>-->
                    <!--                </form>-->
                    <!--			--><?php //} else {
					//				print_error("Unfortunately, parent directory is not writable, so we're unable to save config.php automatically.");
					//			}

					print_notice("You can generate the file again by changing the form above.");
					?>
                </div>
            </div>
			<?php

		} else if ($op == "saveconfig") {
			?>

            <!--        <div class="panel panel-default">-->
            <!--            <div class="panel-body">-->
            <!--				--><?php
//				print "<h2>Saving configuration file to parent directory...</h2>";
//
//				if (!file_exists("../config.php")) {
//
//					$fp = fopen("../config.php", "w");
//
//					if ($fp) {
//						$written = fwrite($fp, make_config($DB_TYPE, $DB_HOST,
//							$DB_USER, $DB_NAME, $DB_PASS,
//							$DB_PORT, $SELF_URL_PATH));
//
//						if ($written > 0) {
//							print_notice("Successfully saved config.php. You can try <a href=\"..\">loading tt-rss now</a>.");
//
//						} else {
//							print_notice("Unable to write into config.php in tt-rss directory.");
//						}
//
//						fclose($fp);
//					} else {
//						print_error("Unable to open config.php in tt-rss directory for writing.");
//					}
//				} else {
//					print_error("config.php already present in tt-rss directory, refusing to overwrite.");
//				}
//				?>
            <!---->
            <!--            </div>-->
            <!--        </div>-->
			<?php
		}
		?>
    </div>
</div>

</body>
</html>