<?php require 'head.php' ?>

<div class="page_wrap">

	<?php require 'header.php' ?>

    <div class="main_content" id="main-content">
        <div class="main_content__container" id="container--pages">
            <div class="container">
                <div id="page_main_content">

                    <div class="row">
                        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">

                            <h1>Profil</h1>

                            <div class="panel panel-default mt20">
                                <div class="panel-heading">
                                    <span>Změna hesla</span>
                                </div>
                                <div class="panel-body">

			                        <?php if (!empty($success)): ?>
                                        <p class="alert alert-success"><?PHP echo $success; ?></p>
			                        <?php endif; ?>

                                    <form action="<?php echo $basedir ?>/profile" method="POST">
	                                    <?php if (isset($email_error)) { ?><div class="alert alert-danger"><?php echo $email_error; ?></div><?php } ?>
                                        <div class="form-group">
                                            <label for="password">Heslo:</label>
                                            <input type="password" name="password" id="password" class="form-control"/>
                                        </div>
                                        <div class="form-group">
                                            <label for="password2">Heslo (Znovu):</label>
                                            <input type="password" name="password2" id="password2" class="form-control"/>
                                        </div>
	                                    <?php if (isset($password_error)) { ?><div class="alert alert-danger"><?php echo $password_error; ?></div><?php } ?>
	                                    <?php if (isset($password_length_error)) { ?><div class="alert alert-danger"><?php echo $password_length_error; ?></div><?php } ?>
                                        <button type="submit" class="btn btn-success">Změnit heslo</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </div>
</div>


<div id="modals"></div>

<div id="scripts">

</div>

</body>
</html>