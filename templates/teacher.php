<?php require 'head.php' ?>

<?php require 'templates.php' ?>

<div class="page_wrap">

	<?php require 'header.php' ?>

	<div class="main_content" id="main-content">
		<div class="main_content__container" id="container--pages">
			<div class="container">
				<div id="page_main_content"></div>
			</div>
		</div>
	</div>
</div>

<div id="snackbar" class="snackbar">...</div>

<div id="modals"></div>

<div id="scripts">
    <?php require 'scripts.php'; ?>
    <script src="src/application_teacher.js?<?php echo(filemtime('./src/application_teacher.js')) ?>"></script>

    <script>
        eco.basedir = '<?php echo $projectDir ?>';
        $(document).ready(function() {
            eco.start();
        });
    </script>

</div>

</body>
</html>