<?php require 'head.php' ?>

<?php require 'templates.php' ?>

<div class="page_wrap">

	<?php require 'header.php' ?>


	<div class="main_content" id="main-content">
		<div class="main_content__container" id="container--pages" style="display: none;">
			<div class="container">
				<div id="page_main_content"></div>
			</div>
		</div>
		<div class="main_content__container" id="container--schemas">
			<div class="center_wrap">
				<div id="ribbon" class="ribbon">

					<div id="contentToggler" class="ribbon__toggle noselect">
						<i class="glyphicon glyphicon-arrow-right ribbon__toggle__show" title="Show entities"></i>
						<i class="glyphicon glyphicon-arrow-left ribbon__toggle__hide"></i>
					</div>

					<div id="ribbonContent" class="ribbon__contents">
						<p class="text-muted text-center">
							Entity se načítají...
						</p>
					</div>
				</div>

				<div class="paper_container">
					<div id="canvasWrapper"></div>
				</div>
			</div>
		</div>
	</div>
</div>

<?php require 'footer.php' ?>
