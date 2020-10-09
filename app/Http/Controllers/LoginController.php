<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;

class LoginController extends Controller
{
    public function login(Request $request) {


        try {

            $login = $request->input('login');
            $password = $request->input('password');

            if (!$login) throw new Exception("Поле 'Login' пусто!");
            if (!$password) throw new Exception("Поле 'Password' пусто!");
            if ($login !== env('CRUD_USERNAME')) throw new Exception("Неверный логин!");
            if ($password !== env('CRUD_PASSWORD')) throw new Exception("Неверный пароль!");

            $result['success'] = 1;

        }
        catch (Exception $e) {
            $result['error'] = $e->getMessage();
        }

        return response()->json($result);
    }
}
