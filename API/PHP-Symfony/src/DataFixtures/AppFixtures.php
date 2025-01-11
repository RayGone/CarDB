<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

use App\Entity\CarsEntity;

class AppFixtures extends Fixture
{
    public $path;

    public function __construct(string $demo_json) {
        $this->path = $demo_json;
    }

    public function load(ObjectManager $manager ): void
    {
        // $product = new Product();
        // $manager->persist($product);
        $data = json_decode(file_get_contents($this->path));
        foreach($data as $row){
            $row = (array) $row;
            $car = new CarsEntity();
            $car->setName($row['name']);
            $car->setOrigin($row['origin']);

            $date = \DateTime::createFromFormat('Y-m-d', "19{$row['model_year']}-01-01");
            $car->setModelYear($date);

            if(isset($row['mpg']))
                $car->setMpg($row['mpg']);

            if(isset($row['acceleration']))
                $car->setAcceleration($row['acceleration']);

            if(isset($row['cylinders']))
                $car->setCylinders($row['cylinders']);

            if(isset($row['horsepower']))
                $car->setHorsepower($row['horsepower']);

            if(isset($row['weight']))
                $car->setWeight($row['weight']);

            if(isset($row['displacement']))
                $car->setDisplacement($row['displacement']);

            $car->setCreatedAt(); 
            $car->setUpdatedAt();

            $manager->persist($car);
        }
        $manager->flush();
    }
}
