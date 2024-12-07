<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(false);
            $table->string('origin')->nullable(false);
            $table->integer('model_year')->nullable(false);
            $table->double('acceleration')->nullable(true);
            $table->double('horsepower')->nullable(true);
            $table->double('mpg')->nullable(true);
            $table->double('weight')->nullable(true);
            $table->double('cylinders')->nullable(true);
            $table->double('displacement')->nullable(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
