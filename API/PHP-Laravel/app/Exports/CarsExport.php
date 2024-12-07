<?php

namespace App\Exports;

use App\Models\Cars;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
class CarsExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Cars::all();
    }

    public function headings(): array
    {
        return [
            "ID", "Name", "Origin", "Model Year", "Acceleration", "Horsepower", "MPG", "Weight", "Cylinders", "Displacement"
        ];
    }

    public function map($cars): array
    {
        return [
            $cars->id,
            strtoupper($cars->name), // Example: Convert name to uppercase
            strtoupper($cars->origin),
            $cars->model_year,
            $cars->acceleration,
            $cars->horsepower,
            $cars->mpg,
            $cars->weight,
            $cars->cylinders,
            $cars->displacement
        ];
    }
}
