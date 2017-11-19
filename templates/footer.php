
<div id="modals"></div>

<div id="snackbar" class="snackbar">...</div>

<div id="scripts">
    <script src="src/helpers/util.js?<?php echo(filemtime('./src/helpers/util.js')) ?>"></script>
    <script src="src/application.js?<?php echo(filemtime('./src/application.js')) ?>"></script>
	<?php require 'scripts.php'; ?>

    <script src="src/application_ready.js?<?php echo(filemtime('./src/application_ready.js')) ?>"></script>
</div>

</body>
</html>