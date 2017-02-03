<div id="menu">
	<div id="menuCloser" class="noselect">Close menu</div>
	<div class="menuwrap">

		<a href="#newSchema" class="" id="bttn_newSchema">New schema</a>
		<div class="spacer"></div>

		<a href="#entityprop" class="" id="bttn_editSchema">Edit schema</a>
		<a href="#entitySave" class="" id="bttn_saveSchema">Save schema</a>
		{*<a href="#saveAs" class="popup" id="btn_saveAs">Save schema as ...</a>*}
		<a href="#export" download id="export">Export schema</a>
		{if $isIdentified}
			<a href="#deleteSchemaLocal" id="bttn_closeSchema">Close schema</a>
		{else}
			<a href="#deleteSchemaLocal" id="bttn_deleteSchemaLocal">Delete schema</a>
		{/if}

		{if $isIdentified}
			<div class="spacer"></div>
			<a href="#openSchemaList" class="popup" id="bttn_openSchemas">Open schema</a>
			<a href="#entitySaveOnServer" class="" id="bttn_saveSchemaOnServer">Save schema (on server)</a>
			<a href="#deleteSchemaOnServer" id="bttn_deleteSchemaOnServer">Delete schema (on server)</a>
		{/if}
		<div class="spacer"></div>
		<!-- Menu for selected schema -->
		<a href="lib.vhd" download target="_blank">Download library lib.vhd</a>

		<div class="spacer"></div>
		<a href="#" id="clearLocalData">Erase local storage</a>

	</div>
</div>