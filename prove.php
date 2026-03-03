<!DOCTYPE html>
<html>
  <head>
    <title>Prove di BIM</title>
  </head>
<style>
.w100 {width: 100%;}
.tacx {text-align: center;}
.immagine {
	height: 100%;
	width: 100%;
}
</style>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script>

$('#map').click(function(e)
{
   $('#marker').css('left', e.pageX).css('top', e.pageY).show();
   // Position of the marker is now e.pageX, e.pageY 
   // ... which corresponds to where the click was.
});
</script>
  <body>
  <form style="margin-top: 5px; margin-bottom: 3px; background-color: #FFF0D4;" name="fxcabal" action="prove.php" method="post">
  	<div><table class="w100"><tr><td class="tacx" width="100%"><img src="marker.png" id="marker" style="display: none; position: absolute;" /><img class="immagine" src="png-clipart-floor-plan-design-house-plan-design-angle-text.png" id="map" /></td></tr></table></div>
  </form>
  </body>
</html>
