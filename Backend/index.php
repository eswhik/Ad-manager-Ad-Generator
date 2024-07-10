<?php
// Obtener URL solicitada
$request_uri = $_SERVER['REQUEST_URI'];

// Eliminar la parte inicial del script si está en una subcarpeta
$base_path = str_replace('/index.php', '', $_SERVER['SCRIPT_NAME']);
$request_uri = str_replace($base_path, '', $request_uri);

// Eliminar cualquier query string para obtener la ruta limpia
$url_parts = explode('?', $request_uri);
$url = trim($url_parts[0], '/');

$routes = [
    'api/v1' => 'api.php',
    'ad/sizes/beta' => 'AdSizes.php',
];

// Manejar la solicitud según la ruta
if (array_key_exists($url, $routes)) {
    require $routes[$url];
} else {
    http_response_code(404);
    include("error.php");
}
?>
