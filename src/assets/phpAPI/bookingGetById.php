<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$consumptionId = $_GET['consumptionId'];
$sql = "SELECT * FROM consumption WHERE consumptionId = '" .$consumptionId. "' Order by consumptionId";
$result = mysqli_query($conn, $sql);

if ( $result ) {
    while( $consumption = mysqli_fetch_row($result) )
    {
        $vec = $consumption;
    }
    $cad = json_encode($vec);
}

mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>