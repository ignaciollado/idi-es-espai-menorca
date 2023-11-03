<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");

$sql = "SELECT ils_consumption.consumptionId, ils_consumption.companyId, ils_consumption.aspectId, ils_consumption.energyId,
ils_consumption.quantity, ils_consumption.fromDate, ils_consumption.toDate, ils_consumption.residueId,
ils_consumption.reuse, ils_consumption.recycling, ils_consumption.incineration,  ils_consumption.dump, ils_consumption.compost,
ils_consumption.scopeOne, ils_consumption.scopeTwo,
ils_consumption.created_at, ils_consumption.updated_at,
ils_consumption.year, ils_consumption.month,
ils_energy.nameES as energyES, ils_energy.nameCA,
ils_company_delegation.name, ils_company_delegation.address,
ils_aspect.nameES as aspectES, ils_aspect.nameCA,
ils_residue.nameES as residueES, ils_residue.nameCA

FROM ils_consumption
LEFT JOIN ils_energy ON ils_consumption.energyId=ils_energy.energyId
LEFT JOIN ils_residue ON ils_consumption.residueId=ils_residue.residueId
LEFT JOIN ils_aspect ON ils_consumption.aspectId=ils_aspect.aspectId
LEFT JOIN ils_company_delegation ON ils_consumption.companyDelegationId=ils_company_delegation.companyDelegationId";

$result = mysqli_query($conn, $sql);

while($consumptions = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $consumptions;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>
