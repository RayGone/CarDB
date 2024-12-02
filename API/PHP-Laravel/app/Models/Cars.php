<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasTimestamps;

class Cars extends Model
{
    use HasFactory, HasTimestamps;

    /**
     * @var array<int", "string>
     */
    protected $fillable = [
        "name", "origin", "model_year", "acceleration", "horsepower", "mpg", "weight", "cylinders", "displacement"
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [

    ];

    public function getNameAttribute($name){
        return ucwords($name);
    }

    public function setNameAttribute($name)
    {
        $this->attributes['name'] = mb_strtolower($name);
    }

    public function getOriginAttribute($origin){
        return strtoupper($origin);
    }

    public function setOriginAttribute($origin)
    {
        $this->attributes['name'] = mb_strtolower($origin);
    }
}
