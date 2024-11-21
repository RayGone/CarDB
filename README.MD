# CarDB

Welcome to CarDB, a simple web application project featuring modern UI frameworks and a work-in-progress API backend.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Setup](#setup)

## Introduction

CarDB is a web application designed to demonstrate the integration of popular frontend frameworks and a backend API. The project is structured to include a React and Angular UI with an ExpressJS and a C# API backend.

## Features

- **[React](./UI/CarDB-React) UI:** A dynamic user interface built with React with Material Design.
- **[Angular](./UI/CarDB-Angular) UI:** Another robust user interface built with Angular with Material Design.
- **[ExpressJS](./API/CarDB-Express) API:** A backend API using ExpressJS.
- **[C#.NET](./API/CarDB-CSharp) API:** A backend API using C#.NET.

## Setup

To run this project locally, follow these steps:

### Prerequisites

- Node.js
- npm or yarn
- .NET SDK (for the C# API)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/rayGone/cardb.git
2. **Choose one Backend** [ExpressJS](./API/CarDB-Express) or [C#.NET](./API/CarDB-CSharp)
    ```sh
    dotnet run #if C#
    #----
    npm start #if Express
3. **Choose UI** [Angular](./UI/CarDB-Angular) or [React](./UI/CarDB-React)
    ```sh
    npm start
