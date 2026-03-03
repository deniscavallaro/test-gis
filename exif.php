<?php
$exif = exif_read_data('IMG_20191220_142313.jpg', 0, TRUE);

if($exif) {
	//echo $exif['GPS']['GPSLatitude'][0];
	foreach ($exif as $key => $section) {
    foreach ($section as $name => $val) {
        echo "$key.$name: $val<br />\n";
    }
	}
}
?>
