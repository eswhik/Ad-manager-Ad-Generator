<?php
function generarCodigoAnuncio($nombreTag, $codigoEditor, $nombreAnuncio, $medidas)
{
    $codigo = '<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>' . PHP_EOL;
    $codigo .= '<div id="' . $nombreTag . '">' . PHP_EOL;
    $codigo .= '    <script>' . PHP_EOL;
    $codigo .= '        window.googletag = window.googletag || {cmd: []};' . PHP_EOL;
    $codigo .= '        googletag.cmd.push(function() {' . PHP_EOL;

    $nombreSlot = $nombreTag;
    $codigo .= '            googletag.defineSlot(\'' . $codigoEditor . '/' . $nombreAnuncio . '\', ' . formatMedidas($medidas) . ', \'' . $nombreSlot . '\').addService(googletag.pubads());' . PHP_EOL;
    $codigo .= '            googletag.enableServices();' . PHP_EOL;
    $codigo .= '            googletag.display(\'' . $nombreSlot . '\');' . PHP_EOL;

    $codigo .= '        });' . PHP_EOL;
    $codigo .= '    </script>' . PHP_EOL;
    $codigo .= '</div>';

    return $codigo;
}

function formatMedidas($medidas)
{
    $formattedMedidas = '[';

    foreach ($medidas as $medida) {
        $formattedMedidas .= '[' . implode(', ', $medida) . '], ';
    }

    $formattedMedidas = rtrim($formattedMedidas, ', ');
    $formattedMedidas .= ']';

    return $formattedMedidas;
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $nombreTag = $input['nombre_tag'];
    $codigoEditor = '/' . $input['codigo_editor'];
    $nombreAnuncio = $input['nombre_anuncio'];
    $medidas = $input['medidas'];

    $codigoGenerado = generarCodigoAnuncio($nombreTag, $codigoEditor, $nombreAnuncio, $medidas);

    if ($codigoGenerado) {
        $nombreArchivo = $nombreAnuncio . '.txt';
        $rutaArchivo = 'tags/' . $nombreArchivo;
        file_put_contents($rutaArchivo, $codigoGenerado);
        $response = [
            'codigo' => $codigoGenerado,
            'archivo' => $rutaArchivo
        ];
        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'No se pudo generar el código']);
    }
}
