<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>wcGraph</title>
        <script src="jquery.min.js"></script>
        <script src="graph.js"></script>
		<link rel="stylesheet" href="style.css" type="text/css" media="screen">
        <script>

			var context;
			jQuery.noConflict();

			jQuery(document).ready(function() {

				//Get the context
				var context = document.getElementById('plot-area').getContext("2d");

				var settings = {
					context: context,
					width: 400,
					height: 400,
					xRatio : 10,
					yRatio : 10
				}

				var lines = {
					'straight' : {
						color : '#00F',
						formula : new StraightLine({
							
						})
					},
					'quadratic' : {
						color : '#F00',
						formula : new QuadraticLine({
							multiplier2 : 0.1
						})
					},
					'cubic' : {
						color : '#F00',
						formula : new CubicLine({
							multiplier3 : 0.1
						})
					},
					'circle' : {
						color : '#F00',
						formula : new CircleLine({
							radius : 5
						})
					},
					'sine' : {
						color : '#F00',
						formula : new SinLine({

						})
					},
					'tan' : {
						color : '#F00',
						formula : new TanLine({

						})
					},
					'oneoverx' : {
						color : '#F0F',
						formula : {
							calculateY : function(x) {
								return 1/x;
							}
						}
					},
					'random' : {
						color : '#F0F',
						formula : {
							calculateY : function(x) {
								return Math.random() * 5;
							}
						}
					}
 				}

				var graph = new Graph(settings);

				graph.drawAxes();

				


				jQuery('input[name^=checkbox]').click(function(){
					var type = jQuery(this).val();
					if (jQuery(this).is(':checked')) {
						graph.addLine(type, lines[type]);
					} else {
						graph.removeLine(type, lines[type]);
					}
				});


				jQuery('#zoom-level').change(function(){
					var level = jQuery(this).val();
					graph.setZoom(level, level);
				});


			});

		</script>
        <link rel="stylesheet" href="style.css" type="text/css" media="screen"/>
    </head>
    <body>
        <canvas id="plot-area" width="400px" height="400px"></canvas>
		<div id="controls">
			<fieldset>
				<legend>Controls</legend>
				
				Zoom: <input id ="zoom-level" type="range"  min="1" max="80"  value ="20" default="20" /><br/>

				<label><input type="checkbox" name="checkbox-straight"  id="checkbox-straight"  value="straight"/> Straight Line (y = mx+c)</label><br/>
				<label><input type="checkbox" name="checkbox-quadratic" id="checkbox-quadratic" value="quadratic"/> Quadratic Curve (y = ax^2 + bx + c)</label><br/>
				<label><input type="checkbox" name="checkbox-cubic"     id="checkbox-cubic"     value="cubic"/> Cubic Curve (y = ax^3 + bx^2 +cx +d)</label><br/>
				<label><input type="checkbox" name="checkbox-circle"    id="checkbox-circle"    value="circle"/> Half Circle (x^2 + y^2 = r^2)</label><br/>
				<label><input type="checkbox" name="checkbox-sine"      id="checkbox-sine"      value="sine"/> Sine Graph (y = sin(x))</label><br/>
				<label><input type="checkbox" name="checkbox-tan"       id="checkbox-tan"       value="tan"/> Tan Graph (y = tan(x))</label><br/>
				<label><input type="checkbox" name="checkbox-oneoverx"  id="checkbox-oneoverx"  value="oneoverx"/> y = 1/x</label><br/>
				<label><input type="checkbox" name="checkbox-random"    id="checkbox-random"  value="random"/> Random Points</label><br/>
			</fieldset>
		</div>
    </body>
</html>