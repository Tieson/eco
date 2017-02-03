<div id="regForm" class="popupForm">
	<h2>Registration</h2>
	<form action="index.php" method="post">
		<label for="f_name">Name</label>
		<input type="text" id="f_name" name="f_name" required="" value="{$formdata.name}"/>

		<label for="f_surname">Surname</label>
		<input type="text" id="f_surname" name="f_surname" required="" value="{$formdata.surname}"/>

		<label for="f_mail">E-mail</label>
		<input type="text" id="f_mail" name="f_mail" required="" value="{$formdata.mail}"/>

		<label for="f_passwd1">Password</label>
		<input type="password" id="f_passwd1" name="f_passwd1" required="" value=""/>

		<label for="f_passwd2">Password again</label>
		<input type="password" id="f_passwd2" name="f_passwd2" required="" value=""/>

		<input type="submit" class="button ok" value="Zaregistrovat se">
	</form>
</div>

