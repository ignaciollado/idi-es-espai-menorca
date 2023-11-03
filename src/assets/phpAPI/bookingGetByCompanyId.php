<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];
$aspectId = $_GET['aspectId'];

$sql = "SELECT ils_consumption.consumptionId, ils_consumption.companyId, 
ils_consumption.aspectId, ils_consumption.energyId as energy, ils_consumption.quantity, ils_consumption.objective, 
ils_consumption.residueId, ils_consumption.reuse, ils_consumption.recycling, ils_consumption.incineration, 
ils_consumption.dump, ils_consumption.compost,
ils_consumption.scopeOne, ils_consumption.scopeTwo,
ils_consumption.created_at, ils_consumption.updated_at,
ils_consumption.year, 
ils_consumption.01 as 'jan', ils_consumption.02 as 'feb', ils_consumption.03 as 'mar', ils_consumption.04 as 'apr',
ils_consumption.05 as 'may', ils_consumption.06 as 'jun', ils_consumption.07 as 'jul', ils_consumption.08 as 'aug', 
ils_consumption.09 as 'sep', ils_consumption.10 as 'oct', ils_consumption.11 as 'nov', ils_consumption.12 as 'dec',
ils_energy.nameES as energyES, ils_energy.nameCA, ils_energy.pci as pci,
ils_company_delegation.name as delegation, ils_company_delegation.address,
ils_aspect.nameES as aspectES, ils_aspect.nameCA,
ils_residue.nameES as residueES, ils_residue.nameCA

FROM ils_consumption
LEFT JOIN ils_energy ON ils_consumption.energyId=ils_energy.energyId
LEFT JOIN ils_company_delegation ON ils_consumption.companyDelegationId=ils_company_delegation.companyDelegationId
LEFT JOIN ils_aspect ON ils_consumption.aspectId = ils_aspect.aspectId
LEFT JOIN ils_residue ON ils_consumption.residueId = ils_residue.residueId

WHERE ils_consumption.companyId =".$companyId;

if (isset($aspectId)) {
  $sql .= " AND ils_consumption.aspectId=".$aspectId;
}

$sql .= " ORDER BY ils_consumption.year, ils_company_delegation.name, ils_energy.nameES ";

$result = mysqli_query($conn, $sql);

while($consumptions = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $consumptions;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>
