## Setup guide for Laravel

Install all the dependencies using composer

    composer install

Copy the example env file and make the required configuration changes in the .env file

    cp .env.example .env

Run the database migrations (*Set the database connection in .env before migrating*)

    php artisan migrate
    
Start the local development server

    php artisan serve

You can now access the server at http://localhost:8000


## Setup guide for React

Go to Client folder and install all the dependencies
    
    npm install
   
After installation
    
    npm start

You can now access the Frontend at http://localhost:3000
