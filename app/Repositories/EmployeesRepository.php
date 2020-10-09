<?php


namespace App\Repositories;

use Exception;
use DateTime;
use App\Models\Employee;
use phpDocumentor\Reflection\Types\Static_;

class EmployeesRepository
{

    protected const validationMessages = [
        'required' => "Поле ':attribute' должно быть заполнено!",
        'name.min' => "Длина поля 'ФИО' должна быть больше чем 3 символа!",
        'name.max' => "Длина поля 'ФИО' не должна превышать 100 символов!",
        'email.email' => "Поле 'email' должно соответствовать формату!",
        'email.unique' => 'Введите другой уникальный email!',
        'salary.integer' => "Значение поля 'Зарплата' должно быть числом!",
        'salary.min' => "Значение поля 'Зарплата' должно быть в диапазоне от 0 до 1000000",
        'salary.max' => "Значение поля 'Зарплата' должно быть в диапазоне от 0 до 1000000",
        'birth_of_date.date_format' => "Поле 'Дата рождения' должна соответствовать формату 'ГГГГ-ММ-ДД'!",
        'position_id.integer' => "Значение поля 'Должность' должно быть числом!",
        'position_id.exists' => "Неправильный идентификатор должности!"
    ];

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

        $validation = $this->checkInputDataForCreate($data);

        if ($validation !== true) throw new Exception(json_encode($validation['error_data']->messages()) , 777);

        $new->fill($data);

        if (!$new->save()) throw new Exception("Ошибка при сохранении в БД!");

        return true;

    }

    public function updateEmployee($data) {

        if (!ctype_digit((string)$data['id'])) throw new Exception("Идентификатор пользователя должен быть числом!");

        $employee = Employee::find($data['id']);

        if (!$employee) throw new Exception("Пользователя с переданным идентификаторм нет в БД!");

        if (isset($data['birth_of_date'])) {
            $data['birth_of_date'] = (new DateTime($data['birth_of_date']))->format("Y-m-d");
        }

        $validation = $this->checkInputDataForUpdate($data);

        if ($validation !== true) throw new Exception(json_encode($validation['error_data']->messages()) , 777);

        $employee->fill($data);

        if (!$employee->save()) throw new Exception("Ошибка при записи в БД!");

        return true;

    }


    public function deleteEmployee($id) {

        if (!ctype_digit((string)$id)) throw new Exception("Идентификатор пользователя должен быть числом!");

        $employee = Employee::find($id);

        if (!$employee) throw new Exception("Пользователя с переданным идентификаторм нет в БД!");

        if (!$employee->delete()) throw new Exception("Ошибка при удалении из БД!");

        return true;

    }

    protected function checkInputDataForCreate($data) {

        $validation = \Illuminate\Support\Facades\Validator::make($data, [
            'name' => 'required|string|min:3|max:100',
            'email' => 'required|email|unique:employees',
            'salary' => 'required|integer|min:1|max:1000000',
            'birth_of_date' => 'date_format:Y-m-d',
            'position_id' => 'required|integer|exists:positions,id'
        ], static::validationMessages);

        if ($validation->fails()) {
            return [
                'error'      => 'Некорректные данные формы.',
                'error_data' => $validation->errors()
            ];
        }

        return true;

    }

    protected function checkInputDataForUpdate($data) {

        $validation = \Illuminate\Support\Facades\Validator::make($data, [
            'name' => 'required|string|min:3|max:100',
            'email' => 'required|email',
            'salary' => 'required|integer|min:1|max:1000000',
            'birth_of_date' => 'date_format:Y-m-d',
            'position_id' => 'required|integer|exists:positions,id'
        ], static::validationMessages);

        if ($validation->fails()) {
            return [
                'error'      => 'Некорректные данные формы.',
                'error_data' => $validation->errors()
            ];
        }

        return true;

    }

}
