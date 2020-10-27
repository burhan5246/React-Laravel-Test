<?php

use Illuminate\Http\Request;
use App\item_left;
use App\item_right;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('items', function() {    
    return array("left" => item_left::all(), "right" => item_right::all());
}); 

Route::middleware('cors')->post('add', function(Request $request) {	
	$left = item_left::where('left_item_name', $request->new_item)->first();
	$right = item_right::where('right_item_name', $request->new_item)->first();
	
	if(!empty($left) || !empty($right)){
		
		return response()->json(array("success"=>false, "message"=>"Duplicate item not allowed"), 403);
	}

    item_left::create(["left_item_name" => $request->new_item]);
    return array("left" => item_left::all(), "right" => item_right::all());
    //return 200;
});

Route::post('move_to_right', function(Request $request) {
	$deleted = item_left::where('left_item_name', $request->item_value)->delete();
	if(!$deleted){
		return response()->json(array("success"=>false), 404);	
	}
    item_right::create(["right_item_name" => $request->item_value]);
    return array("left" => item_left::all(), "right" => item_right::all());    
});

Route::post('move_to_left', function(Request $request) {
	$deleted = item_right::where('right_item_name', $request->item_value)->delete();
	if(!$deleted){
		return response()->json(array("success"=>false), 404);	
	}
    item_left::create(["left_item_name" => $request->item_value]);
    return array("left" => item_left::all(), "right" => item_right::all());    
});
