<div id="ribbon" class="ribbon">
    <div id="contentToggler" class="ribbon__toggle noselect">
        <i class="glyphicon glyphicon-arrow-down ribbon__toggle__show"></i>
        <i class="glyphicon glyphicon-arrow-up ribbon__toggle__up"></i>
    </div>
    {*<div class="ribbon__menu noselect" id="categories-list">
        *}{*{section loop=$categories name=category}
            <div class='ribbon__menu__item {if $smarty.section.category.first}default{/if}'
                 data-cat='{$categories[category].id_cat}'>{$categories[category].name}</div>
        {/section}*}{*

        *}{*{if $isIdentified && $userEntities|@count>0}
            <div class='ribbon__menu__item' data-cat='User'>Vlastní entity</div>
        {/if}*}{*

    </div>*}

    <div id="ribbonContent" class="ribbon__contents">
        {*
        <div id="rest">
        <select id="prvky" name="prvky"></select>
        <div id="addComponent" class="button noselect">Přidej komponentu</div>
        </div>
        *}

        {*{section loop=$categories name=category}
            <div class="ribbon__contents__category">
                <div class="ribbon__contents__header">
                    {$categories[category].name}
                </div>
                <div class="ribbon__contents__items" id="ribbonCartId{$categories[category].id_cat}">
                    {section loop=$entities name=entity}
                        {if $categories[category].id_cat == $entities[entity].id_cat}
                            <div class="entity noselect" data-entityid='{$entities[entity].id_entity}'
                                 data-type="{$entities[entity].name}">{$entities[entity].label}</div>
                        {/if}
                    {/section}
                </div>
            </div>
        {/section}*}

        {*{if $isIdentified && $userEntities|@count>0}
            <div class="ribbon__contents__item" id="ribbonCartIdUser">

                {section loop=$userEntities name=entity}
                    <div class="entity noselect"
                         data-entityid='{$userEntities[entity].id_entity}'>{$userEntities[entity].name}</div>
                {/section}

            </div>
        {/if}*}

    </div>
</div>