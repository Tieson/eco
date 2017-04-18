<!DOCTYPE html>
<html lang='cs'>
<head>
    <title>Grafický editor číslicových obvodů v HTML5</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset='utf-8'>
    <meta name='description' content=''>
    <meta name='keywords' content=''>
    {*<meta name='author' content=''>*}
    <meta name='robots' content='all'>

    <link rel="stylesheet" href="../assets/js/libs/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/js/libs/jointjs/dist/joint.min.css">
    <link rel="stylesheet" href="../assets/css/style.css">



    <script src="../assets/js/libs/jquery/dist/jquery.min.js"></script>
    <script src="../scripts/jquery.hotkeys.js"></script>
    <script src="../scripts/jquery.fancybox.pack.js"></script>


    <script src="../assets/js/libs/lodash/lodash.min.js"></script>
    <script src="../assets/js/libs/backbone/backbone-min.js"></script>

    <script src="../assets/js/libs/jointjs/dist/joint.js"></script>
    <script src="../assets/js/libs/jointjs/dist/joint.shapes.logic.min.js"></script>
    <script src="../scripts/joint.shapes.mylib.js"></script>

    {*<script src="../assets/js/libs/list.js/dist/list.min.js"></script>*}

    <script src="../assets/js/libs/bootstrap/dist/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <script src="../scripts/utils/Util.js"></script>
    <script src="../scripts/utils/fileLoader.js"></script>
    <script src="../scripts/utils/Counter.js"></script>
    <script src="../scripts/utils/Serialization.js"></script>
    <script src="../scripts/utils/Notification.js"></script>


    <script src="../scripts/Communicator.js"></script>
    <script src="../scripts/Creator.js"></script>
    <script src="../scripts/VhdExport.js"></script>
    <script src="../scripts/VhdImport.js"></script>
    <script src="../scripts/schema.js"></script>
    {*<script src="../scripts/main.js"></script>*}
    {*<script src="../scripts/main2.js"></script>*}

    <script src="../scripts/ux.js"></script>


    <script src="../scripts/models/entities.js"></script>
    <script src="../scripts/models/schema.js"></script>
    <script src="../scripts/models/modal.js"></script>
    <script src="../scripts/models/settings.js"></script>
    <script src="../scripts/models/task.js"></script>


</head>
<body style="position: relative;">

{literal}
    <script type="text/template" id="template-user">
        e-mail: <%= mail %>
        name: <%= name %>
    </script>

    <script type="text/template" class="template-categories-list">
        <div class="ribbon__contents__header">
            <%= name %>
        </div>
    </script>

    <script type="text/template" id="template-modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title"><%= title%></h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="schema_name">Název: <i class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Zadávejte pouze písmena anglické abecedy, podtržítka a číslice."></i></label>
                        <input type="text"
                               name="name"
                               id="schema_name"
                               class="form-control"
                               value="<%= schema.name %>"
                               autofocus="autofocus",
                               placeholder="schema_01"
                        >
                    </div>
                    <div class="form-group">
                        <label for="schema_name">Architektura: <i class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Zadávejte pouze písmena anglické abecedy, podtržítka a číslice."></i></label>
                        <input type="text"
                               name="architecture"
                               id="schema_architecture"
                               class="form-control"
                               value="<%= schema.architecture %>"
                               placeholder="arch_01"
                        >
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <small>
                                Název a architektura musí být validní VHDL název.
                                Ten může obsahovat pouze písmena anglické abecedy, kterými musí začínat, dále číslice a podtržítka.
                                Podtržítka nesmí být zasebou.
                            </small>
                        </div>
                    </div>
                    <!--<hr>
                    <div class="row">
                        <div class="col-xs-12">
                            <a href="#" class="btn btn-danger"><i class="glyphicon glyphicon-trash"></i> smazat schéma</a>
                        </div>
                    </div>-->
                </div>
                <div class="modal-footer">
                    <a href="#" class="btn btn-storno button">Storno</a>
                    <button type="submit" class="btn btn-save button button--primary">Save</button>
                </div>
            </div>
        </div>
    </script>

    <script type="text/template" id="template-modal-open-schema">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title"><%= title %></h4>
                </div>
                <div class="modal-body">
                    <div class="list-group schema_open_list">
                        <% _.each(collection, function(schema) { %>
                            <a href="#" data-schema-id="<%= schema.id %>" class="list-group-item schema_open_list__item"><strong><%= schema.name %></strong> - <%= schema.architecture %></a>
                        <% }); %>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="#" class="btn btn-storno button">Zavřít</a>
                </div>
            </div>
        </div>
    </script>

    <script type="text/template" class="template-schema-list">
            <%= schema.name %>
        <div class="schema_list__item__edit btn btn-xs"><i class="glyphicon glyphicon-cog"></i></div>
    </script>
{/literal}

{include file='templates/homeworkList.tpl'}

    <div id="notificationMessages" class="notif">
        {section loop=$messgs name=msg}
            <div class="item">{$messgs[msg]}</div>
        {/section}
    </div>

    <div class="page_wrap">

        <div class="main_bar">
            <div class="dropdown">
                <a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
                    <i class=" glyphicon glyphicon-file"></i> Soubor
                </a>
                <ul class="dropdown-menu">
                    <li><a href="#" id="menu-file-new_schema">Nové schéma</a></li>
                    <li><a href="#" id="menu-file-close_schema">Zavřít schéma</a></li>
                    <li><a href="#" id="menu-file-open_schema">Otevřít schéma</a></li>
                    <li><a href="#" id="menu-file-save_schema_as">Uložit schéma jako &hellip;</a></li>
                    <li><a href="#" id="menu-file-export_schema">Exportovat schéma do VHDL</a></li>
                    <li class="divider"></li>
                    <li><a href="#" id="menu-file-download_lib">Stáhnout lib.vdl</a></li>
                </ul>
            </div>
            <div class="dropdown">
                <a href="#" id="menuToggler" class="button button--primary main_bar__menu noselect dropdown-toggle" data-toggle="dropdown">
                    <i class=" glyphicon glyphicon-flash"></i> Úkoly
                </a>
                <ul class="dropdown-menu">
                    <li><a href="#" id="menu-task-show">Zobrazit moje úkoly</a></li>
                    <li class="disabled"><a href="#">Odevzdat toto schéma jako úkol</a></li>
                </ul>
            </div>

            {include file='UIElements/schemaList.tpl'}

            <div id="schemaList">
                <div class="wrapper">

                </div>
            </div>

            <div id='usermenu' class="main_bar__usermenu">
                {include file='UIElements/userSlideBox.tpl'}
            </div>
        </div>

        <div class="center_wrap">
            {include file='commonComponents/ribbon.tpl'}

            <div class="paper_container" id="canvasWrapper">
                {*<div id="moje_platno" class="paper"></div>*}
            </div>

            <div id="entityDetail"></div>
        </div>

        {*<footer class="page_footer">
            <span>&COPY; 2013 Jaroslav Řehák (TUL)</span>
            <span> - 2015 Tomáš Václavík (TUL)</span>
        </footer>*}

    </div>

    {include file='UIElements/createSchemaForm.tpl'}
    {include file='UIElements/editSchemaForm.tpl'}

    {include file='UIElements/openSchemaList.tpl'}

    <div class="owerlay" id="owerlay"></div>
</body>
</html>