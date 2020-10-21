<?php

namespace App\Models;

use DB;
use Log;
use Storage;

/**
 * Class Files work with filesystem (put, read, delete files)
 * @package App\Models
 */

class Files
{
    protected $isinit = false;
    public $upload_path;

    public function __construct() {
        $this->init();
    }

    /**
     * Try initialise file model. Check if directory is exist.
     * Is is not, try to create it
     *
     * @return void
     */
    private function init() {
        $this->upload_path = config('filesystems.upload_path.files');
        if (!is_dir($this->upload_path)) {
            if (mkdir($this->upload_path, 0777 )) {
                $this->isinit = true;
            } else {
                $this->isinit = false;
            }
        } else {
            $this->isinit = true;
        }
    }

    /**
     * Return status of the model. Is is not init, try initialise once
     * @return bool
     */

    public function isInit() {
        if (!$this->isinit) {
            Log::error("File model is not initialized.");
            $this->init();
        }
        return $this->isinit;
    }

    /**
     * Check directory for object for containing files.
     *
     * @param $type - object type
     * @param $id - object identifier
     * @return array, that contains name and href for each files
     */

    public function getFilesForObject($type, $id) {
        if (!$this->isinit) return [];
        $dir_name = 'upload/'.$type;
        $storage_path = storage_path('upload/'.$type);
        $files_for_id = [];
        if (is_dir($storage_path)) {
            $files_for_type = Storage::files($dir_name);
            foreach ($files_for_type as $k => $filename) {
                if (strripos($filename, $id . '_') !== false) {
                    $files_for_id[] = [
                        'href'=>'/file/'.base64_encode($type.'/'.basename($filename)),
                        'name'=>basename($filename)
                    ];
                }
            }
        }
        return $files_for_id;
    }
}
