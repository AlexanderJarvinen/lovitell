<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Log;
use App\Http\Requests;
use App\Components\Menu\Menu;
use App\Report;
use Storage;
use App\Models\Files;

/**
 * Class FileController for work with files
 * of different objects (builds, tickets, etc)
 * @package App\Http\Controllers
 */

class FileController extends Controller
{
    //
	public function __construct(Menu $menu)
	{
		$this->middleware('auth'); //TODO try remove middleware in constructor
		parent::__construct($menu);
	}

    /**
     * This function put file for the object in objects load directory
     * Access to this function by ajax
     * @type AJAX
     *
     * @param Request $request
     * @param $type - object type (build, ticket etc)
     * @param $id - object identifier
     * TODO Using file model class
     * TODO vvv
     * @return error
     *
     */
	public function putFileForObject(Request $request, $type, $id) {
		if ($request->file()) {
			$file = $request->file('file');
			$path = storage_path('/app/upload/'.$type.'/');
			$filename = $id . '_' . $file->getClientOriginalName();
		}
	}

    /**
     * This function return selected file by the link
     * @type AJAX
     *
     * @param Request $request
     * @param $href - base64 encoded link
     * @return file or error page if file not found / access restricted
     * TODO check permissions by the billing database
     * TODO use file model class
     */
	public function getFile(Request $request, $href)
	{
		$href = 'upload/'.base64_decode(str_replace(" ", "+", $href));
		if (true ) { //!strstr($href, "../") && (strstr($href, "$docroot/task/upload"))) {
			if ($file = Storage::get($href)) {
				$filename = explode('/', $href);
				return response()->file(storage_path('app/'.$href), [
					'Content-Disposition' => "inline; filename=\"".$filename[2]."\"; filename*=utf-8''%name",
					'Content-Type'        => Storage::getMimeType($href),
				]);
			} else {
				return response(404);
			}
		} else {
			return response(403);
		}
	}

    /**
     * This function return files list for object by id
     * @type AJAX
     *
     * @param Requset $request - Laravel request
     * @param $type - object type (build, ticket etc)
     * @param $id - object identifier
     * @return JSON with files list
     */
	public function getFileList(Request $request, $type, $id) {
		$model = new Files();
		return response()->json($model->getFilesForObject($type, $id));
	}

    /**
     * Delete file by link
     * @type AJAX
     *
     * @param Request $request
     * @param $href - base64 encoded link
     * @return error. If error = 0 -OK
     */
	public function deleteFile(Request $request, $href) {
		$href = 'upload/'.base64_decode(str_replace(" ", "+", $href));
		try {
			if (Storage::delete($href)) {
				return response()->json(['error' => 0]);
			} else {
				return response()->json(['error' => 1]);
			}
		} catch (\ErrorException $e) {
			return response()->json(['error' => 1]);
		}
	}
}
