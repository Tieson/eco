

<div id="newSchema" class="popupForm" style="display: none">
	<h2>Create new schema</h2>
	<form action="#createNewSchema" method="post">
		<div class="row">
			<label for="finput1New">Entity name</label>
			<input type="text" class="f_entity" id="finput1New" name="schema" />
		</div>
		<div class="row">
			<label for="finput2New">Architecture</label>
			<input type="text" class="f_arch" id="finput2New" name="arch" />
		</div>
		<div class="row">
			<label for="ftextNew">Short description (max <span {*class="charcount" data-max="100" data-contentid="#ftextNew"*}>100</span> chars)</label>
			<textarea name="text" id="ftextNew" class="f_title" rows="3"></textarea>
		</div>
		<div class="row">
			<div class="button ok" id="bttn_newSchema" data-event="save">Create schema</div>
		</div>
	</form>
</div>