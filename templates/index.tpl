<!DOCTYPE html>
<html lang='cs'>  
	{include file='commonComponents/head.tpl'}
	<body style="position: relative;">
		{include file='commonComponents/menu.tpl'}

			<div id="notificationMessages">
				{section loop=$messgs name=msg}
					<div class="item">{$messgs[msg]}</div>
				{/section}
			</div>
		<div id="wrapper">
			
			<div class="overlay"></div>
			<div id="headline">
				<div id="menuToggler" class="noselect">menu</div>
				{include file='UIElements/schemaList.tpl'}

				<div id='usermenu'>
					<div class="wrapper">
						{include file='UIElements/userSlideBox.tpl'}
					</div>
				</div>

				<div class="clearfix"></div>
			</div>

			{include file='commonComponents/ribbon.tpl'}
			<div id="canvasWrapper">
				{*include file='sidePanel/properties.tpl'*}
				{*<div id="moje_platno" class="paper"></div>*}
			</div>

			{include file='UIElements/createSchemaForm.tpl'}
			{include file='UIElements/editSchemaForm.tpl'}
			
			{include file='UIElements/openSchemaList.tpl'}
			

			{include file='commonComponents/footer.tpl'}
		</div>
	</body>
</html>