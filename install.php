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
		print "<div class='alert alert-danger'>$msg</div>";
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


	function isConfigExists(){
	    return file_exists("config/config.php");
    }

	?>


    <h1>ECO Instalátor</h1>

    <div class='content'>

		<?php
		@$op = $_REQUEST['op'];
        @$alternative = $_REQUEST['alternative'];
		if ($alternative == 'fromconfig' && isConfigExists()) {

			$config = include('./config/config.php');

			if ($config) {

				try {
					$link = db_connect($config['db']['host'], $config['db']['user'], $config['db']['password'], $config['db']['database'], 'mysql', '');
					@$DB_USER = $config['db']['user'];
					@$DB_NAME = $config['db']['database'];
					@$DB_TYPE = 'mysql';
					@$DB_HOST = $config['db']['host'];
					@$DB_PASS = '';
					@$DB_PORT = $config['db']['port']?$config['db']['port']:'';
					@$SELF_URL_PATH = strip_tags($_POST['SELF_URL_PATH']);

					print_notice('Byla použita konfigurace z konfiguračního souboru. user=' . $config['db']['user'] . ' database=' . $config['db']['database']);
				} catch (Exception $ex) {
					print_error($ex->getMessage());
					exit;
				}
			}


			if (!defined('_INSTALLER_IGNORE_CONFIG_CHECK')) {
				print_error("Error: config.php již existuje. Ruším operaci.");
				exit;
			}
		}
		else {

			$config = include('./config/config.php');

			if ($config) {
			}

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

			try {
				$link = db_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_TYPE, $DB_PORT);
			} catch (Exception $ex) {
				print_error($ex->getMessage());
			}
		}
?>
        <div class="panel panel-default">
            <div class="panel-body">
        <form action="" method="post">
            <input class="form-control" type="hidden" name="op" value="testconfig">
            <input class="form-control" type="hidden" name="alternative" value="alternative">

	        <?php if ($alternative == 'alternative') { ?>
                <h2>Nastavení databáze</h2>
	        <?php } else { ?>
                <h2>Alternativní nastavení databáze</h2>
	        <?php } ?>


            <?php
			$issel_pgsql = $DB_TYPE == "pgsql" ? "selected" : "";
			$issel_mysql = $DB_TYPE == "mysql" ? "selected" : "";
			?>

            <div class="row">
                <div class="col-xs-12 col-sm-3">
                    <fieldset>
                        <label>Database type</label>
                        <select name="DB_TYPE" class="form-control">
                            <option <?php echo $issel_mysql ?> value="mysql">MySQL</option>
                        </select>
                    </fieldset>
                </div>
                <div class="col-xs-12 col-sm-3">
                    <fieldset>
                        <label>Username</label>
                        <input class="form-control" class="input class=" form-control" input class="form-control"-text" required
                        name="DB_USER" size="20" value="<?php echo $DB_USER ?>"/>
                    </fieldset>
                </div>
                <div class="col-xs-12 col-sm-3">
                    <fieldset>
                        <label>Password</label>
                        <input class="form-control" class="input class=" form-control" input class="form-control"-text"
                        name="DB_PASS" size="20" type="password" value="<?php echo $DB_PASS ?>"/>
                    </fieldset>
                </div>
                <div class="col-xs-12 col-sm-3">
                    <fieldset>
                        <label>Database name</label>
                        <input class="form-control" class="input class=" form-control" input class="form-control"-text" required
                        name="DB_NAME" size="20" value="<?php echo $DB_NAME ?>"/>
                    </fieldset>
                </div>
                <div class="col-xs-12 col-sm-3">
                    <fieldset>
                        <label>Host name</label>
                        <input class="form-control" class="input class=" form-control" input class="form-control"-text"
                        name="DB_HOST" size="20" value="<?php echo $DB_HOST ?>"/>
                        <span class="text text-muted">Pokud je potřeba</span>
                    </fieldset>
                </div>
                <div class="col-xs-12 col-sm-3">
                    <fieldset>
                        <label>Port</label>
                        <input class="form-control" class="input class=" form-control" input class="form-control"-text"
                        name="DB_PORT" type="number" size="20" value="<?php echo $DB_PORT ?>"/>
                    </fieldset>
                </div>
                <div class="col-xs-12 col-sm-3">
                    <fieldset>
                        <label>URL</label>
                        <input class="form-control" class="input class=" form-control" input class="form-control"-text"
                        type="url" name="SELF_URL_PATH" placeholder="<?php echo $SELF_URL_PATH; ?>"
                        size="60" value="<?php echo $SELF_URL_PATH ?>"/>
                    </fieldset>

                    <p>Toto by mělo být nastaveno na umístění, kde bude aplikace dostupná.</p>
                </div>
                <div class="col-xs-12">
                    <p><input class="btn btn-success" type="submit" value="Použít konfiguraci"></p>
                </div>
            </div>

        </form>
            </div>
        </div>
<?php
        if (isConfigExists()){
        ?>

        <div class="panel panel-default">
            <div class="panel-body">
                <form action="" method="post">
                    <input class="form-control" type="hidden" name="op" value="testconfig">
                    <input class="form-control" type="hidden" name="alternative" value="fromconfig">
                    <button class="btn btn-info" type="submit">
                        Použít konfiguraci ze souboru config
                    </button>
                </form>
            </div>
        </div>
	    <?php
	    }
	    ?>

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
                                    <input class="form-control" type="hidden" name="alternative" value="<?php echo $alternative; ?>">

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

                                    <input class="form-control" type="hidden" name="op" value="skipschema">
                                    <input class="form-control" type="hidden" name="alternative" value="<?php echo $alternative; ?>">
                                    <p><input class="form-control" type="submit" value="Přeskočit inicializaci - pouze aktualizovat"></p>
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

//					$link = db_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_TYPE, $DB_PORT);

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
						print_notice("Instalace databáze preskočena. Pouze aktualizace.");

						/**
						 * Update databáze
						 */

						$result = @db_query($link, "SELECT version FROM version LIMIT 1", $DB_TYPE, false);

						while ($row = $result->fetch_assoc()) {
							$files = array_slice(scandir('schemas/versions/'), 2);
							$files_count = count($files);
							if($files_count == $row['version']){
								print_notice('Databáze je aktuální. verze: ' . $row['version']);
							}else{
								print_notice('Aktuální verze databáze: ' . $row['version'] . ' počet souborů s updatem: ' . $files_count);

                                for ($i = (int)($row['version']) + 1; $i <= $files_count; $i++) {
                                    $lines = explode(";", preg_replace("/[\r\n]/", "", file_get_contents("schemas/versions/" . $i . '.sql')));

                                    print_notice('Soubor ' . $i . '.sql' . ' počet příkazů: ' . count($lines));
                                    foreach ($lines as $line) {
                                        if (strpos($line, "--") !== 0 && $line) {
                                            db_query($link, $line, $DB_TYPE);
                                        }
                                    }
                                }
							}
						}
					}

					?>
                </div>
            </div>
			<?php

		} else if ($op == "saveconfig") {
		    ;
		}
		?>
    </div>
</div>

</body>
</html>