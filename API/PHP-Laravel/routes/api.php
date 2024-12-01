<?php

use App\Http\Requests\CreateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

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

Route::group([], function(){
    Route::post("/user/create", function(CreateUserRequest $request){
        return response()->json([
            'message' => 'User created successfully',
            "user" => $request->all()
        ]);
        // return response()->json(['message' => 'User created successfully'], 201);
        // return response()->json([
        //     $validatedData["name"],
        //     $validatedData["email"],
        //     $validatedData["password"]
        // ]);
        // $user = new User($request->all());
        // $user->createToken('user_access_token_'.$request->get('name'));
    });

    // Route::get("/login", function(Request $request){

    // });
});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
