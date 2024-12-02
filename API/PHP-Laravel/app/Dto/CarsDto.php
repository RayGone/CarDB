<?php

namespace App\Dto;

use Doctrine\DBAL\Exception\NotNullConstraintViolationException;
use RuntimeException;

class CarsDto
{
    private ?int $id = null;
    private string $name;
    private string $origin;
    private int $model_year;
    private ?float $acceleration = null;
    private ?float $horsepower = null;
    private ?float $mpg = null;
    private ?float $weight = null;
    private ?int $cylinders = null;
    private ?float $displacement = null;

    public function __construct(array $param)
    {
        $this->fromArray($param);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = strtolower(trim($name));
        return $this;
    }

    public function getOrigin(): string
    {
        return $this->origin;
    }

    public function setOrigin(string $origin): self
    {
        $this->origin = strtolower(trim($origin));
        return $this;
    }

    public function getModel_year(): int
    {
        return $this->model_year;
    }

    public function setModel_year(int $model_year): self
    {
        $this->model_year = $model_year <0 ? 0 : $model_year;
        return $this;
    }

    public function getAcceleration(): ?float
    {
        return $this->acceleration;
    }

    public function setAcceleration(?float $acceleration): self
    {
        $this->acceleration = $acceleration;
        return $this;
    }

    public function getHorsepower(): ?float
    {
        return $this->horsepower;
    }

    public function setHorsepower(?float $horsepower): self
    {
        $this->horsepower = $horsepower;
        return $this;
    }

    public function getMpg(): ?float
    {
        return $this->mpg;
    }

    public function setMpg(?float $mpg): self
    {
        $this->mpg = $mpg;
        return $this;
    }

    public function getWeight(): ?float
    {
        return $this->weight;
    }

    public function setWeight(?float $weight): self
    {
        $this->weight = $weight;
        return $this;
    }

    public function getCylinders(): ?int
    {
        return $this->cylinders;
    }

    public function setCylinders(?int $cylinders): self
    {
        $this->cylinders = $cylinders;
        return $this;
    }

    public function getDisplacement(): ?float
    {
        return $this->displacement;
    }

    public function setDisplacement(?float $displacement): self
    {
        $this->displacement = $displacement;
        return $this;
    }

    public function fromArray(array $data): self
    {
        if (isset($data['id'])) {
            $this->setId($data['id']);
        }
        if (isset($data['name']) && trim($data['name'])!="") {
            $this->setName($data['name']);
        } else throw new RuntimeException("Required Field Missing / Empty. name is missing.");
        if (isset($data['origin']) && trim($data['origin'])!="") {
            $this->setOrigin($data['origin']);
        } else throw new RuntimeException("Required Field Missing / Empty. origin is missing.");
        if (isset($data['model_year']) && is_numeric($data['model_year']) && $data['model_year']>=0) {
            $this->setModel_year($data['model_year']);
        } else throw new RuntimeException("Required Field Missing / Invalid. model_year is missing / invalid.");
        if (isset($data['acceleration'])) {
            $this->setAcceleration($data['acceleration']);
        }
        if (isset($data['horsepower'])) {
            $this->setHorsepower($data['horsepower']);
        }
        if (isset($data['mpg'])) {
            $this->setMpg($data['mpg']);
        }
        if (isset($data['weight'])) {
            $this->setWeight($data['weight']);
        }
        if (isset($data['cylinders'])) {
            $this->setCylinders($data['cylinders']);
        }
        if (isset($data['displacement'])) {
            $this->setDisplacement($data['displacement']);
        }

        return $this;
    }

    public function toArray(): array
    {
        return [ 
            'id' => $this->getId(),
            'name' => $this->getName(),
            'origin' => $this->getOrigin(),
            'model_year' => $this->getModel_year(), 
            'acceleration' => $this->getAcceleration(), 
            'horsepower' => $this->getHorsepower(), 
            'mpg' => $this->getMpg(), 
            'weight' => $this->getWeight(), 
            'cylinders' => $this->getCylinders(), 
            'displacement' => $this->getDisplacement()
        ];
    }

    public function carAttributes(array $exclude=[]): array
    {
        $array = $this->toArray();

        return array_diff(
            array_keys($array), $exclude
        );
    }

    public function carAttributeValues(): array
    {
        $array = $this->toArray();

        return array_diff(
            array_values($array)
        );
    }
}
