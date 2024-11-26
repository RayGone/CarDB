<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\DBAL\Connection;
use App\Entity\CarsEntity;
use Doctrine\ORM\EntityManagerInterface;


class IndexController extends AbstractController
{
    #[Route('/', name: 'API index')]
    public function index(){
        return $this->json([
            "message"=>"Symfony API",
            "endpoints" => [
                "cars" => [
                    "/" => ["get"],
                    "/filterSearch" => ["post"],
                    "/add" => ["post"],
                    "/edit/{id}" => ["patch"],
                    "/delete/{id}" => ["delete"]
                ]
            ]
        ]);
    }
}