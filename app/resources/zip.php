<?php
	$error = "";
	if(isset($_POST['action']))
	{
		$post = $_POST;
		//$file_folder = "files/"; // папка с файлами
		if(extension_loaded('zip'))
		{
			if(isset($post['files']) and count($post['files']) > 0)
			{
				// проверяем выбранные файлы
				$zip = new ZipArchive(); // подгружаем библиотеку zip
				$zip_name = "TMK2014_files_".time().".zip"; // имя файла
				if($zip->open($zip_name, ZIPARCHIVE::CREATE)!==TRUE)
				{
					$error .= "* Sorry ZIP creation failed at this time";
				}
				foreach($post['files'] as $file)
				{
					$new_filename = substr($file,strrpos($file,'/') + 1); // https://stackoverflow.com/questions/3993105/php-creating-zips-without-path-to-files-inside-the-zip?answertab=votes#tab-top
					$zip->addFile($file,$new_filename); // добавляем файлы в zip архив
				}
				$zip->close();
				if(file_exists($zip_name))
				{
					// отдаём файл на скачивание
					header('Content-type: application/zip');
					header('Content-Disposition: attachment; filename="'.$zip_name.'"');
					readfile($zip_name);
					// удаляем zip файл если он существует
					unlink($zip_name);
				}

			}
			else
			$error .= "* Please select file to zip ";
		}
		else
		$error .= "* You dont have ZIP extension";
	}
?>
