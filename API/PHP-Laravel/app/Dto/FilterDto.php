<?php

namespace App\Dto;

class FilterDto
{
    private string $field;
    private string $ops;
    private string $value;

    public function __construct(array $param)
    {
        $this->fromArray($param);
    }

    public function getField(): string
    {
        return $this->field;
    }

    public function setField(string $field): self
    {
        $this->field = $field;
        return $this;
    }

    public function getOps(): string
    {
        return $this->ops;
    }

    public function setOps(string $ops): self
    {
        $this->ops = $ops;
        return $this;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function setValue(string $value): self
    {
        $this->value = $value;
        return $this;
    }

    public function fromArray(array $data): self
    {
        if (isset($data['field'])) {
            $this->setField($data['field']);
        }
        if (isset($data['ops'])) {
            if($data['ops'] == "==")  $this->setOps("=");
            else $this->setOps($data['ops']);
        }
        if (isset($data['value'])) {
            $this->setValue($data['value']);
        }

        return $this;
    }
}
