<?php

namespace App\Entity;

use App\Repository\CarsEntityRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;

#[ORM\Entity(repositoryClass: CarsEntityRepository::class)]
#[ORM\Table(name: 'cars')]
class CarsEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id;

    #[ORM\Column(type: Types::STRING, length: 100)]
    private string $name;

    #[ORM\Column(type: Types::STRING, length: 50)]
    private string $origin;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private int $modelYear;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $acceleration;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $horsepower;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $mpg;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $weight;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $cylinders;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $displacement;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private $createdAt; 
    
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private $updatedAt;

    // Getters and setters...

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getOrigin(): ?string
    {
        return $this->origin;
    }

    public function setOrigin(string $origin): self
    {
        $this->origin = $origin;

        return $this;
    }

    public function getModelYear(): ?int
    {
        return $this->modelYear;
    }

    public function setModelYear(int $modelYear): self
    {
        $this->modelYear = $modelYear;

        return $this;
    }

    public function getAcceleration(): ?float
    {
        return $this->acceleration;
    }

    public function setAcceleration(float $acceleration): self
    {
        $this->acceleration = $acceleration;

        return $this;
    }

    public function getHorsepower(): ?int
    {
        return $this->horsepower;
    }

    public function setHorsepower(int $horsepower): self
    {
        $this->horsepower = $horsepower;

        return $this;
    }

    public function getMpg(): ?float
    {
        return $this->mpg;
    }

    public function setMpg(float $mpg): self
    {
        $this->mpg = $mpg;

        return $this;
    }

    public function getWeight(): ?int
    {
        return $this->weight;
    }

    public function setWeight(int $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    public function getCylinders(): ?int
    {
        return $this->cylinders;
    }

    public function setCylinders(int $cylinders): self
    {
        $this->cylinders = $cylinders;

        return $this;
    }

    public function getDisplacement(): ?float
    {
        return $this->displacement;
    }

    public function setDisplacement(float $displacement): self
    {
        $this->displacement = $displacement;

        return $this;
    }
    
    public function getCreatedAt(): ?\DateTimeInterface 
    { 
        return $this->createdAt; 
    } 
    
    public function getUpdatedAt(): ?\DateTimeInterface 
    { 
        return $this->updatedAt; 
    } 
    
    #[ORM\PrePersist]
    public function setCreatedAtValue(): void {
        $this->createdAt = new \DateTime(); 
    } 

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void 
    { 
        $this->updatedAt = new \DateTime();
    }
}

