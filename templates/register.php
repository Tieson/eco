<?php require 'head.php' ?>

<div class="page_wrap">

	<?php require 'header.php' ?>

    <div class="main_content" id="main-content">
        <div class="main_content__container" id="container--pages">
            <div class="container">
                <div id="page_main_content">

                    <div class="row">
                        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">

                            <h1>Registrace</h1>

                            <div class="panel panel-default mt20">
                                <div class="panel-heading">
                                    <span>Editor číslicových obvodů</span>
                                </div>
                                <div class="panel-body">

			                        <?php if (!empty($error)): ?>
                                        <p class="error"><?PHP echo $error; ?></p>
			                        <?php endif; ?>
	                                <?php if (isset($success_message)) { ?><div class="alert alert-success"><?php echo $success_message; ?></div><?php } ?>

                                    <form action="<?php echo $basedir ?>/register" method="POST">
                                        <div class="form-group">
                                            <label for="email">E-mail:</label>
                                            <input type="text" name="email" id="email" value="<?php echo $email_value; ?>" class="form-control" placeholder="jmeno.prijmeni@tul.cz"/>
                                        </div>
<!--                                        <div class="form-group">-->
<!--                                            <label for="name">Celé jméno:</label>-->
<!--                                            <input type="text" name="name" id="name" class="form-control"/>-->
<!--                                        </div>-->
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
                                        <button type="submit" class="btn btn-success">Zaregistrovat se</button>
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