<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PositionController extends Controller
{
    public function getPositions() {

        $result = [];

        try {
            $result['data'] = DB::table('positions')->select(['id', 'name'])->get();
            $result['success'] = 1;
        }
        catch (\Exception $e) {
            $result['error'] = $e->getMessage();
        }

        return response()->json($result);

    }
}
