<?php
session_cache_limiter(false);
date_default_timezone_set('Europe/Berlin');

?>

<html>
<head>
    <title>ECO - Installer</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset='utf-8'>
    <meta name='keywords' content='Editor, Digital circuits, číslicové obvody, simulace, interaktivní'>
    <meta name='robots' content='all'>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../assets/js/libs/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/js/libs/sweetalert/dist/sweetalert.css" type="text/css">


    <script src="../assets/js/libs/jquery/dist/jquery.min.js"></script>
    <script src="../assets/js/libs/bootstrap/dist/js/bootstrap.min.js"></script>

    <script src="../assets/js/libs/sweetalert/dist/sweetalert.min.js"></script>
</head>
<body>
<div class="container">
	<?php
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

	function db_connect($host, $user, $pass, $db, $port = false)
	{
		if ($port)
			return mysqli_connect($host, $user, $pass, $db, $port);
		else
			return mysqli_connect($host, $user, $pass, $db);
	}


	function db_query($link, $query, $die_on_error = true)
	{
			$result = mysqli_query($link, $query);

			if (!$result) {
				$query = htmlspecialchars($query);
				if ($die_on_error) {
					die("Query <p class='alert alert-danger'>$query</p> failed: " . ($link ? mysqli_error($link) : "No connection"));
				}
			}
			return $result;
	}

	function db_mysql_multi_query($link, $query, $die_on_error = true)
	{

		$result = mysqli_multi_query($link, $query);

		if (!$result) {
			$query = htmlspecialchars($query);
			if ($die_on_error) {
				die("Query <p class='alert alert-danger'>$query</p> failed: " . ($link ? mysqli_error($link) : "No connection"));
			}
		}

		return $result;
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



	function queryFile($link, $filenam){
		$lines = explode('_$_', preg_replace("/'[^']+'(*SKIP)(*F)|;/", '_$_', file_get_contents($filenam)));
		print_notice('počet příkazů: ' . count($lines));

		$line_n = 1;
		foreach ($lines as $line) {
			print_notice($line_n . '. OK');
			$line_n++;
			if (strpos($line, "--") !== 0 && $line) {
				db_query($link, $line);
			}
		}
    }

	?>


    <h1>ECO Instalátor</h1>

    <div class='content'>

		<?php
		@$op = $_REQUEST['op'];
		$configFile = "../config/config.php";
		if (file_exists($configFile)) {

			include($configFile);
			$config = Config::getConfig();

			if ($config) {
				try {
					$link = db_connect($config['db']['host'], $config['db']['user'], $config['db']['password'], $config['db']['database'], $config['db']['port']);
					@$DB_USER = $config['db']['user'];
					@$DB_NAME = $config['db']['database'];
					@$DB_TYPE = 'mysql';
					@$DB_HOST = $config['db']['host'];
					@$DB_PASS = '';
					@$DB_PORT = $config['db']['port'] ? $config['db']['port'] : '';
					@$SELF_URL_PATH = strip_tags($_POST['SELF_URL_PATH']);

					print_notice('Konfigurace z konfiguračního souboru načtena');
				} catch (Exception $ex) {
					print_error($ex->getMessage());
					exit;
				}
			}

		} else {
			print_error("Error: config.php neexistuje. Vytvořte jej.");
			exit;
		}
		?>

        <div class="panel panel-default">
            <div class="panel-body">
                <form action="" method="post">
                    <input class="form-control" type="hidden" name="op" value="testconfig">

                    <div class="row">
                        <div class="col-xs-12 col-sm-4">
                            <fieldset>
                                <label>Administrátorské heslo</label>
                                <input class="form-control" type="password" placeholder="administrátorské heslo"
                                       name="admin_passwd">
                                <input class="btn btn-success btn-block" type="submit" value="Přihlásit se">
                            </fieldset>
                        </div>
                        <div class="col-xs-12 col-sm-2">
                            <p></p>
                        </div>
                    </div>

                </form>
            </div>
        </div>

		<?php if ($op == 'testconfig') {

			$admin_passwd = $_REQUEST['admin_passwd'];
			if ($admin_passwd != Config::getKey('admin/password')) {
				print_error("Chybné heslo!");
				exit;
			} ?>


            <div class="panel panel-default">
                <div class="panel-body">


                    <h2>Nastavení databáze</h2>

                    <div class="row">
                        <div class="col-xs-12 col-sm-2">
                            <fieldset>
                                <label>Username</label>
                                <div><?php echo $DB_USER ?>&nbsp;</div>
                            </fieldset>
                        </div>
                        <div class="col-xs-12 col-sm-2">
                            <fieldset>
                                <label>Database name</label>
                                <div><?php echo $DB_NAME ?>&nbsp;</div>
                            </fieldset>
                        </div>
                        <div class="col-xs-12 col-sm-2">
                            <fieldset>
                                <label>Host name</label>
                                <div><?php echo $DB_HOST ?>&nbsp;</div>
                            </fieldset>
                        </div>
                        <div class="col-xs-12 col-sm-2">
                            <fieldset>
                                <label>Port</label>
                                <div><?php echo $DB_PORT ?>&nbsp;</div>
                            </fieldset>
                        </div>
                        <div class="col-xs-12 col-sm-2">
                            <fieldset>
                                <label>URL</label>
                                <div><?php echo $SELF_URL_PATH; ?>&nbsp;</div>
                            </fieldset>
                        </div>
                    </div>

                    <h2>Kontrola připojení k databázi</h2>
					<?php
					if (!$link) {
						print_error("Unable to connect to database using specified parameters.");
						exit;
					}
					print_notice("Database test succeeded.");
					?>

                    <h2>Kontrola konfigurace serveru</h2>

					<?php
					$errors = sanity_check($DB_TYPE);

					if (count($errors) > 0) {
						print "<p>Některé konfigurační testy neprošly, prosím opravte chyby před pokračováním.</p>";

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

					//					if (!function_exists("idn_to_ascii")) {
					//						array_push($notices, "PHP support for Internationalization Functions is required to handle Internationalized Domain Names.");
					//					}

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
                    <h2>Inicilazace databáze</h2>

                    <p>Předtím, než budete moci používat editor je potřeba inicializovat databázi. Pokud jste to ještě
                        neudělali, tak klikněte na náseldující tlačítko</p>

					<?php
					/**
					 * Test jestli jsou v DB již nějaké tabulky
					 */
					$result = @db_query($link, "SELECT true FROM entities", false);

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
                                    <input class="form-control" type="hidden" name="op" value="skipschema">
                                    <p><input class="form-control" type="submit"
                                              value="Přeskočit inicializaci - pouze aktualizovat"></p>
                                </form>

                            </td>
                        </tr>
                    </table>
                </div>
            </div>


			<?php
		} elseif ($op == 'installschema' || $op == 'skipschema') {
			?>


            <div class="panel panel-default">
                <div class="panel-body">
					<?php

					if (!$link) {
						print_error("Nelze se připojit k datbázi se zadanými údaji");
						exit;
					}

					/**
					 * Instalace databáze
					 */
					if ($op == 'installschema') {
						print "<h2>Inicilizace databáze...</h2>";;
						queryFile($link, "./eco_schema_mysql.sql");
						queryFile($link, "./eco_data_mysql.sql");
						print_notice("Instalace databáze dokončena.");
					}

					/**
					 * Update databáze
					 */
					print_notice("Aktualizace databáze.");
					$result = @db_query($link, "SELECT version FROM version LIMIT 1", false);
					while ($row = $result->fetch_assoc()) {
						$files = array_slice(scandir('versions/'), 2);
						$files_count = count($files);
						if ($files_count == $row['version']) {
							print_notice('Databáze je aktuální. verze: ' . $row['version']);
						} else {
							print_notice('Aktuální verze databáze: ' . $row['version'] . ' počet souborů s updatem: ' . $files_count);
							for ($i = (int)($row['version']) + 1; $i <= $files_count; $i++) {
								$statements = explode("||", file_get_contents("versions/" . $i . '.sql'));
								print_notice('Soubor ' . $i . '.sql' . ' počet příkazů: ' . count($statements));
								foreach ($statements as $statement) {
									if (strpos($statement, "--") !== 0 && $statement) {
										db_query($link, $statement);
									}
								}
							}
						}
					}

					?>
                </div>
            </div>
			<?php
		}
		?>
    </div>
</div>

</body>
</html>