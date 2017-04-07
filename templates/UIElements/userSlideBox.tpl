
<div class="main_bar__usermenu__item item" id="userInfo">
	<div class="menuLabel clickmenu noselect">
		<i class="glyphicon glyphicon-user"></i> {if $isIdentified}{$name.name} {$name.surname}{else}Account{/if}
	</div>
	<div class='menuitemsContainer'>
		{if $isIdentified}
			<a href='./?logout' class="button remove"><i class="glyphicon glyphicon-log-out"></i> Log out</a>
		{else}
			<a href="#logForm" class="button button--primary popup"><i class="glyphicon glyphicon-log-in"></i> Log in</a>
			<div class="nebo">or</div>
			<a href="#regForm" class="button button--default reg popup"><i class="glyphicon glyphicon-edit"></i> Create account</a>

			<div class="div" style="display: none">
				{include file='UIElements/login.tpl'}
				{*{include file='UIElements/registration.tpl'}*}
			</div>
		{/if}
	</div>
</div>
<div class="main_bar__usermenu__item item" id="saveSchema">
	<div class="menuLabel noselect">
		<i class="glyphicon glyphicon-floppy-disk"></i> Uložit schéma
	</div>
</div>