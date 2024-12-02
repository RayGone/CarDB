<?php

use App\Http\Controllers\CarsController;
use App\Http\Requests\CreateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

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

Route::match(['GET',"POST"], "/", function(){
    return response()->json(["message"=>"CarDB Laravel API"]);
});

Route::group(['prefix'=>"user"], function(){
    Route::post("/create", function(CreateUserRequest $request){
        $valid_data = $request->validated();
        $user = User::create([
            "name" => $valid_data['name'],
            'email' => $valid_data['email'],
            'password' => Hash::make($valid_data['password'])
        ]);
        $token = $user->createToken('User API Access Token')->plainTextToken;
        return response()->json([
            'message' => 'User created successfully',
            "user"=>$user, "auth_token"=>$token],
        201);
    });

    Route::post("/login", function(Request $request){
        $login = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        // Attempt to find the user by email
        $user = User::where('email', $login['email'])->first();

        // Check if user exists and if the password is correct
        if (!$user || !Hash::check($login['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials', "error" => "Incorrect Password!"], 401);
        }
        $user->tokens()->delete();

        $token = $user->createToken('Access Token')->plainTextToken;

        return response()->json(["user"=> $user, "auth_token"=>$token]);
    });

    Route::middleware("auth_sanctun")->get('/', function (Request $request) {
        // Some how $request->user() && Auth::user() are returning empty;
        $pas = PersonalAccessToken::findToken($request->bearerToken());
        $user = $pas->tokenable;
        return response()->json($user->toArray());
    });
});

Route::group(['prefix'=>"cars", "middleware"=>['auth:sanctum']], function(){
    Route::get("/", [CarsController::class, "index"]);
    Route::post("/filterSearch", [CarsController::class, "index"]);
});
