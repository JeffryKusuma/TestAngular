# TestAngular

## Project Overview

This is a full-stack web application that demonstrates a complete CRUD (Create, Read, Update, Delete) workflow. The project is built with an Angular frontend and an ASP.NET Core 7 Web API backend, providing a robust foundation for modern web development.

## Features

- **User Authentication**: Secure login and registration with JWT (JSON Web Tokens).
- **Product Management**: Complete CRUD functionality for managing a list of products.
- **Client-Side Search**: A search feature on the frontend to filter the product list by name or description.
- **Modular Architecture**: A clean and scalable project structure for both the Angular and ASP.NET Core applications.
- **Centralized Error Handling**: Global HTTP interceptors for managing errors and JWT token expiration.

## Prerequisites

Before you begin, ensure you have the following software installed on your machine:

- **Angular CLI**: Version 12 or higher
- **.NET Core SDK**: Version 7.0 or higher

## Getting Started

Follow these steps to set up and run the application.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/CRUDAngular.git](https://github.com/your-username/CRUDAngular.git)
    cd CRUDAngular
    ```

2.  **Run the `Install.bat` script:**
    This script will automatically navigate to the correct directories (`Frontend/` and `BackendAPI/`) and install all required dependencies for both the frontend and backend.
    ```sh
    Install.bat
    ```

### Running the Application

To run the complete application, you must start both the backend API and the frontend web server.

1.  **Start the Backend API:**
    Run the `Backend.bat` script from the project's root directory.
    ```sh
    Backend.bat
    ```
    The API will be available at `http://localhost:5000`.

2.  **Start the Frontend App:**
    Run the `Web.bat` script from the project's root directory.
    ```sh
    Web.bat
    ```
    The Angular application will be available at `http://localhost:4200`.

## Project Structure

-   `BackendAPI/`: Contains the ASP.NET Core Web API project.
-   `Frontend/`: Contains the Angular application.

## Technologies Used

### Frontend
-   **Angular**: A platform and framework for building single-page client applications.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **Bootstrap**: A popular framework for building responsive, mobile-first websites.

### Backend
-   **ASP.NET Core 7**: A cross-platform framework for building modern, cloud-based, internet-connected applications.
-   **C#**: The programming language used for the backend logic.
-   **Entity Framework Core**: An object-relational mapper (ORM) that enables .NET developers to work with a database using .NET objects.
-   **SQL Server**: The database system used for data storage.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.
