<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$sql = "INSERT INTO `design_dep_orders` (agency, contact_name, contact_mail, contact_phone, work_type, description) VALUES('"
          .$request['agency']."','"
          .$request['contactName']."','"
          .$request['contactEmail']."','"
          .$request['contactPhone']."','"
          .$request['workType']."','"
          .mysqli_real_escape_string($conn,$request['body'])."')";

mysqli_free_result($result);

$result = mysqli_query($conn, $sql);
mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  (http_response_code(200));
} else  {
  echo http_response_code(401);
}

?>
