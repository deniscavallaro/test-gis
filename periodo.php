<?php

echo 'Data calcolata [' . getPeriodo(12) . ']';

function getPeriodo($idPeriodo) {
	$mydata = date("d/m/Y");
	//$mydata = "03/01/2020";
	$vdata = explode('/', $mydata);
	if(isBisestile($vdata[2]))
		$ultimi = array(0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	else
		$ultimi = array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	switch($idPeriodo) {
	case 0:
		return('');
		break;
	case 1:
		if(number_format($vdata[1], 0, "", "") == 1) {
			$mese = 12;
			$anno = number_format($vdata[2], 0, "", "") - 1;
		} else {
			$mese = number_format($vdata[1], 0, "", "") - 1;
			$anno = $vdata[2];
		}
		if(strlen($mese) > 1)
			$mydata = $ultimi[$mese] . '/' . $mese . '/' . $anno;
		else
			$mydata = $ultimi[$mese] . '/0' . $mese . '/' . $anno;
		return($mydata);
		break;
	case 2:
		switch(number_format($vdata[1], 0, "", "")) {
		case 1:
		case 2:
			$mese = 12;
			$anno = number_format($vdata[2], 0, "", "") - 1;
			break;
		case 3:
		case 4:
			$mese = 2;
			$anno = $vdata[2];
			break;
		case 5:
		case 6:
			$mese = 4;
			$anno = $vdata[2];
			break;
		case 7:
		case 8:
			$mese = 6;
			$anno = $vdata[2];
			break;
		case 9:
		case 10:
			$mese = 8;
			$anno = $vdata[2];
			break;
		case 11:
		case 12:
			$mese = 10;
			$anno = $vdata[2];
			break;
		}
		if(strlen($mese) > 1)
			$mydata = $ultimi[$mese] . '/' . $mese . '/' . $anno;
		else
			$mydata = $ultimi[$mese] . '/0' . $mese . '/' . $anno;
		return($mydata);
		break;
	case 3:
		switch(number_format($vdata[1], 0, "", "")) {
		case 1:
		case 2:
		case 3:
			$mese = 12;
			$anno = number_format($vdata[2], 0, "", "") - 1;
			break;
		case 4:
		case 5:
		case 6:
			$mese = 3;
			$anno = $vdata[2];
			break;
		case 7:
		case 8:
		case 9:
			$mese = 6;
			$anno = $vdata[2];
			break;
		case 10:
		case 11:
		case 12:
			$mese = 9;
			$anno = $vdata[2];
			break;
		}
		if(strlen($mese) > 1)
			$mydata = $ultimi[$mese] . '/' . $mese . '/' . $anno;
		else
			$mydata = $ultimi[$mese] . '/0' . $mese . '/' . $anno;
		return($mydata);
		break;
	case 6:
		switch(number_format($vdata[1], 0, "", "")) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
			$mese = 12;
			$anno = number_format($vdata[2], 0, "", "") - 1;
			break;
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
		case 12:
			$mese = 6;
			$anno = $vdata[2];
			break;
		}
		if(strlen($mese) > 1)
			$mydata = $ultimi[$mese] . '/' . $mese . '/' . $anno;
		else
			$mydata = $ultimi[$mese] . '/0' . $mese . '/' . $anno;
		return($mydata);
		break;
	case 12:
		$anno = number_format($vdata[2], 0, "", "") - 1;
		$mydata = '31/12/' . $anno;
		return($mydata);
		break;
	}
}
function isBisestile($anno) {
	if (($anno % 4 == 0 && $anno % 100 != 0) || $anno % 400 == 0){
		return(true);
	} else {
		return(false);
	}
}
?>
