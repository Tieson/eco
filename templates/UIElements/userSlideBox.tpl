
<div class="item" id="userInfo">
	<div class="menuLabel clickmenu noselect">
		{if $isIdentified}{$name.name} {$name.surname}{else}Account{/if}
	</div>
	<div class='menuitemsContainer'>
		{if $isIdentified}
			<a href='./?logout' class="button remove">Log out</a>
		{else}
			<a href="#logForm" class="button login popup">Log in</a>
			<div class="nebo">or</div>
			<a href="#regForm" class="button reg popup">Create account</a>

			<div class="div" style="display: none">
				{include file='UIElements/login.tpl'}
				{include file='UIElements/registration.tpl'}
			</div>
		{/if}
	</div>
</div>