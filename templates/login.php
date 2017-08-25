<?php require 'head.php' ?>

<div class="page_wrap">

	<?php require 'header.php' ?>

    <div class="main_content" id="main-content">
        <div class="main_content__container" id="container--pages">
            <div class="container">
                <div id="page_main_content">

                    <div class="row">
                        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">

                            <h1>Editor číslicových obvodů</h1>

                            <div class="panel panel-default mt20">
                                <div class="panel-heading">
                                    <span>Přihlášení</span>
                                </div>
                                <div class="panel-body">

			                        <?php if (!empty($error)): ?>
                                        <p class="error"><?PHP echo $error; ?></p>
			                        <?php endif; ?>

                                    <form action="/login" method="POST">
                                        <div class="form-group">
                                            <label for="email">E-mail:</label>
                                            <input type="text" name="email" id="email" value="<?php echo $email_value; ?>"
                                                   class="form-control"/>
                                            <span class="error"><?php echo $email_error; ?></span>
                                        </div>
                                        <div class="form-group">
                                            <label for="pwd">Heslo:</label>
                                            <input type="password" name="password" id="password" class="form-control"/>
                                            <span class="error"><?php echo $password_error; ?></span>
                                        </div>
                                        <button type="submit" class="btn btn-success">Přihlásit se</button>
                                    </form>


			                        <?php if (!empty($urlRedirect)): ?>
                                        <p class="small mt20">Po přihlášení budete přesměrováni na adresu "<?php echo $urlRedirect; ?>".</p>
			                        <?php endif; ?>

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