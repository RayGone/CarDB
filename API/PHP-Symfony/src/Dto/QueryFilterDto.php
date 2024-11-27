<?php
namespace App\Dto;

use App\Dto\FilterDto;

class QueryFilterDto
{
    /**
     * @var FilterModel[]
     */
    private array $filter;

    private int $limit;
    private string $order;
    private string $orderBy;
    private string $search;
    private int $page;

    public function __construct(array $param)
    {
        $this->fromArray($param);
    }

    public function getFilter(): array
    {
        return $this->filter;
    }

    public function setFilter(array $filter): self
    {
        $this->filter = $filter;
        return $this;
    }

    public function getLimit(): int
    {
        return $this->limit;
    }

    public function setLimit(int $limit): self
    {
        $this->limit = $limit;
        return $this;
    }

    public function getOrder(): string
    {
        return $this->order;
    }

    public function setOrder(string $order): self
    {
        $this->order = $order;
        return $this;
    }

    public function getOrderBy(): string
    {
        return $this->orderBy;
    }

    public function setOrderBy(string $orderBy): self
    {
        $this->orderBy = $orderBy;
        return $this;
    }

    public function getSearch(): string
    {
        return strtolower($this->search);
    }

    public function setSearch(string $search): self
    {
        $this->search = $search;
        return $this;
    }

    public function getPage(): int
    {
        return $this->page;
    }

    public function setPage(int $page): self
    {
        $this->page = $page;
        return $this;
    }

    public function isConditions(): bool{
        return !!strlen($this->search) || !!count($this->filter);
    }

    public function fromArray(array $data): self
    {
        $filters = [];
        if (isset($data['filter'])) {
            foreach ($data['filter'] as $filterData) {
                $filter = new FilterDto($filterData);
                $filters[] = $filter;
            }
        }
        $this->setFilter($filters);

        if (isset($data['limit'])) {
            $this->setLimit($data['limit']);
        }
        else $this->setLimit(5);

        if (isset($data['order'])) {
            $this->setOrder($data['order']);
        }
        else $this->setOrder("asc");

        if (isset($data['orderBy'])) {
            $this->setOrderBy($data['orderBy']);
        }
        else $this->setOrderBy("id");

        if (isset($data['search'])) {
            $this->setSearch($data['search']);
        }
        else $this->setSearch("");

        if (isset($data['page'])) {
            $this->setPage($data['page']);
        }
        else $this->setPage(0);

        return $this;
    }
}