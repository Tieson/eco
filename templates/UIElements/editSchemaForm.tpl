

<div id="editSchema" class="popupForm" style="display: none">
	<h2>Schema properties</h2>
	<form action="#changeProp" method="post">
		<div class="row">
			<label for="finput1">Entity name</label>
			<input type="text" class="f_entity" id="finput1" name="schema" />
		</div>
		<div class="row">
			<label for="finput2">Architecture</label>
			<input type="text" class="f_arch" id="finput2" name="arch" />
		</div>
		<div class="row">
			<label for="ftext">Schort description (max <span {*class="charcount" data-max="100" data-contentid="#ftext"*}>100</span> chars)</label>
			<textarea name="text" id="ftext" class="f_title" rows="3"></textarea>
		</div>
		<div class="row">
			<div class="button ok" id="bttn_changeSchema" data-event="save">Save</div>
		</div>
	</form>
</div>


{*
<div id="editSchemaModal" class="modal fade" role="dialog">
	<div class="modal-dialog">

		<!-- Modal content-->
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title">Modal Header</h4>
			</div>
			<div class="modal-body">
				<p>Some text in the modal.</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Zrušit</button>
			</div>
		</div>

	</div>
</div>*}
