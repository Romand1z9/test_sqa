<?php

namespace App\Http\Controllers;

use Exception;
use App\Repositories\EmployeesRepository;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    protected $e_rep = null;

    public function __construct()
    {
        $this->e_rep = new EmployeesRepository();
    }

    public function getEmployees() {

        $result = [];

        try {
            $result['data'] = $this->e_rep->getList();
            $result['success'] = 1;
        }
        catch (Exception $e) {
            $result['error'] = $e->getMessage();
        }

        return response()->json($result);

    }

    public function createEmployee(Request $request) {

        $result = [];

        try {
            $this->e_rep->addNew($request->all());
            $result['success'] = 1;
        }
        catch (Exception $e) {

            if ($e->getCode() === 777) {
                $result['error'] = 'Некорректные данные!';
                $result['error_data'] = json_decode($e->getMessage());
            } else {
                $result['error'] = $e->getMessage();
            }

        }

        return response()->json($result);

    }

    public function updateEmployee(Request $request) {

        $result = [];

        try {
            $this->e_rep->updateEmployee($request->all());
            $result['success'] = 1;
        }
        catch (Exception $e) {
            $result['error'] = $e->getMessage();
        }

        return response()->json($result);

    }

    public function deleteEmployee($id) {

        $result = [];

        try {
            $this->e_rep->deleteEmployee($id);
            $result['success'] = 1;
        }
        catch (Exception $e) {
            $result['error'] = $e->getMessage();
        }

        return response()->json($result);
    }

}
