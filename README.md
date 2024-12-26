# Restaurant Management Server-Side  

This is the server-side application for the Restaurant Management System. It provides robust APIs for handling restaurant operations like managing branches, menu items, orders, and customer data.  

## Live Project  
- **Frontend:** [Restaurant Management Frontend](https://restaurant-management-caeb2.web.app/)  
- **Backend:** [Restaurant Management Backend](https://restaurant-management-server-side-wheat.vercel.app/)  

## Features  
- **Branch Management:** Add, update, and remove branches dynamically.  
- **Menu Management:** CRUD operations for menu items and categories.  
- **Order Management:** APIs to manage orders and track their statuses.  
- **Customer Management:** Handle customer data securely.  
- **Authentication:** Secure login and role-based access control (admin, staff, customer).  

## Technologies Used  
- **Backend Framework:** Node.js with Express.js  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JSON Web Tokens (JWT) and bcrypt  
- **Hosting:** Vercel  

## API Endpoints  
### Branch Management  
- `GET /branches`: Get all branches  


### Menu Management  
- `GET /menu`: Get all menu items  
- `POST /menu`: Add a menu item  
- `PUT /menu/:id`: Update a menu item  
- `DELETE /menu/:id`: Delete a menu item  

### Order Management  
- `GET /orders`: Fetch all orders  
- `POST /orders`: Place a new order  





