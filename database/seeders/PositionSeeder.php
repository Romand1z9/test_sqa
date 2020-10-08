<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try {

            $time = function () {
                return (new \DateTime());
            };

            DB::table('positions')->insert([
                ['name' => 'Технический директор', 'created_at' => $time() ],
                ['name' => 'Web-Программист', 'created_at' => $time() ],
                ['name' => 'Дизайнер', 'created_at' => $time() ],
                ['name' => 'Тестировщик', 'created_at' => $time() ],
                ['name' => 'Менеджер по продажам', 'created_at' => $time() ],
                ['name' => 'Аккаунт-менеджер', 'created_at' => $time() ],
                ['name' => 'HR-менеджер', 'created_at' => $time() ]
            ]);
        }
        catch (Error $e) {

        }

    }
}
