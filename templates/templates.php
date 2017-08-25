
<div class="templates">
	<!-- šablony pro Backbone -->
	<?php require 'templates/templates/homework.html' ?>
	<?php require 'templates/templates/schemas.html' ?>
	<?php require 'templates/templates/groups.html' ?>
	<?php require 'templates/templates/tasks.html' ?>

	<script type="text/template" id="schemaListItem-template">
		<%=name%>
	</script>
	<script type="text/template" id="categoryItem-template">
		<!--        <div class="ribbon__contents__category noselect" data-idCategory="<%=id%>">-->
		<div class="ribbon__contents__header noselect">
			<%=name%>
		</div>
		<!--            <div class="ribbon__contents__items">-->
		<!--                <p>Kategorie neobsahuje žádné entity.</p>-->
		<!--            </div>-->
		<!--        </div>-->
	</script>


	<script type="text/template" id="main_bar-template">

    </script>
</div>