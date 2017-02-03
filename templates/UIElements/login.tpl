<div id="logForm"  class="popupForm">
	<h2>Login</h2>
	<form action="api.php" method="post">
		<input type="hidden" name="action" value="login">
		<label for="f_mailLog">E-mail</label>
		<input type="text" id="f_mailLog" name="f_mail" value="{$formdata.mail}"/>

		<label for="f_passwdLog">Password</label>
		<input type="password" id="f_passwdLog" name="f_passwd" value=""/>

		<input type="submit" class="button ok" value="Přihlásit se">
	</form>
</div>