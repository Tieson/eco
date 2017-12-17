
<div id="modals"></div>

<div id="snackbar" class="snackbar">...</div>

<div id="scripts">
	<?php require 'scripts.php'; ?>
    <script src="src/application.js?<?php echo(filemtime('./src/application.js')) ?>"></script>

    <script src="src/application_ready.js?<?php echo(filemtime('./src/application_ready.js')) ?>"></script>
</div>

</body>
</html>