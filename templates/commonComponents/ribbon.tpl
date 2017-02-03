
<div id="ribbon">
	<div id="contentToggler"></div>
	<div class="menu noselect" >
		{section loop=$categories name=category}
			<div class='ribbonTitle {if $smarty.section.category.first}default{/if}' data-cat='{$categories[category].id_cat}'>{$categories[category].name}</div>
		{/section}

		{if $isIdentified && $userEntities|@count>0 }
			<div class='ribbonTitle' data-cat='User'>Vlastní entity</div>
		{/if}
		
		<div class="clearfix"></div>
	</div>
		
	<div id="ribbonContent">
		{*
		<div id="rest">
		<select id="prvky" name="prvky"></select>
		<div id="addComponent" class="button noselect">Přidej komponentu</div>
		</div>
		*}

		{section loop=$categories name=category}
			<div class="ribbonCart" id="ribbonCartId{$categories[category].id_cat}">

				{section loop=$entities name=entity}
					{if $categories[category].id_cat == $entities[entity].id_cat}
						<div class="entity noselect" data-entityid='{$entities[entity].id_entity}' data-type="{$entities[entity].name}">{$entities[entity].label}</div>
					{/if}
				{/section}

			</div>
		{/section}
		{if $isIdentified && $userEntities|@count>0}
			<div class="ribbonCart" id="ribbonCartIdUser">

				{section loop=$userEntities name=entity}
					<div class="entity noselect" data-entityid='{$userEntities[entity].id_entity}'>{$userEntities[entity].name}</div>
				{/section}

			</div>
		{/if}

	</div>
	<div class="clearfix"></div>
</div>