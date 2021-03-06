<?php

$path = str_replace('scripts','',dirname(__FILE__));
$dir = $path . $_POST['dir'];

// recursive file search
$rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
$files = array();
foreach ($rii as $file) {
    foreach ($rii as $file) {
        //$dat = null;
        if (!$file->isDir() && strpos($file->getPathname(), 'json') !== -1)
            $files[] = $file->getPathname();
    }
}
sort($files);


$file_dat = [];
for ($i = 0; $i < count($files); $i++) {
    $dat = json_decode(file_get_contents($files[$i]), true); // download data from server

    $file = str_replace($path, '', $files[$i]); // make file name

    is_array($dat) ? $dat['file'] = $file : null; 

    $file_dat[$file] = $dat;

}

echo json_encode($file_dat);


?>
