<?php


namespace App\Repositories;

use Exception;
use DateTime;
use App\Models\Employee;

class EmployeesRepository
{
    public function getList() {

        $employeesList = \Illuminate\Support\Facades\DB::table('employees as e')
            ->select("e.*", "p.name as position")
            ->join("positions as p", "e.position_id", "=", "p.id", "inner")
            ->get();

        if (!$employeesList) return [];

        foreach ($employeesList as &$e) {
            $e->birth_of_date = (new DateTime($e->birth_of_date))->format("d.m.Y");
        }

        return $employeesList;

    }

    public function addNew($data) {

        $new = new Employee();

        if ($data['birth_of_date']) {
            $data['birth_of_date'] = (new DateTime($data['birth_of_date']))->format("Y-m-d");
        }

        $new->fill($data);

        if (!$new->save()) {
            throw new Exception("Ошибка при сохранении в БД!");
        }

        return true;

    }

    public function updateEmployee($data) {

        $employee = Employee::find($data['id']);

        if (!$employee) throw new Exception("Пользователя с переданным идентификаторм нет в БД!");

        if ($data['birth_of_date']) {
            $data['birth_of_date'] = (new DateTime($data['birth_of_date']))->format("Y-m-d");
        }

        $employee->fill($data);

        if (!$employee->save()) {
            throw new Exception("Ошибка при записи в БД!");
        }

        return true;

    }


    public function deleteEmployee($id) {

        $employee = Employee::find($id);

        if (!$employee) throw new Exception("Пользователя с переданным идентификаторм нет в БД!");

        if (!$employee->delete()) throw new Exception("Ошибка при удалении из БД!");

        return true;

    }

}
