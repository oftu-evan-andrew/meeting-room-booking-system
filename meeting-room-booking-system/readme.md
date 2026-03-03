# Connection String from SSMS 
- The server name is system name (DESKTOP-3JM0T8C) and SQL server (/SQLEXPRESS)
- `Database=`(name of the database in the server)
- `IntegratedSecurity=True`: so the application won't ask for username or password, and 
    just use the credentials of the person who is currently logged into this computer.
- `TrustServerCertificate=True`: makes it so that the application will trust the 
    encryption certificate of the local development server

```
"ConnectionStrings": {
		"DefaultConnection": "Server=DESKTOP-3JM0T8C/SQLEXPRESS; Database=ProductivityTracker; IntegratedSecurity=True; TrustServerCertificate=True;"
```

# Db Contexts 
   - is the translator between your application's code and the actual
    database. Since databases usually use query languages such as SQL, postgreSQL
    we have to have a Db Contexts. 

# Data Extension 
- is essentially a table that contains your data. 
- uses Extension Methods to add functionality to the DbContext or your data queries. 

# Providers 
- Database Providers is what translates your app's language to an SQL query.

# Service
- Is a self-contained, functional unit of software designed to perform specific
  business logic such as authentication, payment processing, or data management. 

# EF Core Migrations
- tolls that allows developers to manage database schema changes incrementally 
  using C# code, keeping the database in sync with the application's data model.

# Referencing routes through a variable
- in a means defining API endpoints (URLs) or handler functions using variables, constants, or configuration objects rather than hardcoding them directly into the application code. 

# Deserialization & Serialization
- ## Serialization 
  > turning an object (programming language object) into a 
  HTTP format that can be sent
  or stored.

- ## Deserialization 
  > Taking that HTTP format and turning it back to an object (or a programming language object)

# DTO
- Its job is to carry data between layers of your application (client -> controller -> 
  service -> database). 
- The body of the request is deserialized into a LoginUserDto.

# DTO vs Model: The differences
- Models are to represents real-world business entities and enforce business rules and 
  logic, to match SQL server tables exactly, mainly for data integrity and relationships.
  DTO on the other is a lightweight object designed for carrying data over the network
  between your API and a frontend or mobile app, mainly to define what is sent/received
  via an endpoint. 

# IActionResult
- Used in controller action methods to define a contract for various HTTP response types.
  Ideal to use when an action method might return multiple, distinct type of results
  depending on the outcome, such as OkResult (200), NotFoundResult (404),
  BadRequestPull(400).

# DI Lifetimes
- ## Transient
  >  A new instance is created every single time it is requested. Best for stateless services that don't need to remember anything. 

- ## Scoped
  >  Second longest lived, middle ground, one instance per request. From the request to the response that whole life cycle gets one instance of the service. New instance is created per web request. Best for database context, you want the same context to track all changes during a single user's request, but don't want different user's data mixing together.

- ## Transient
  >  Longest lived. One single instance is created when the app starts and is shared by everyone until the end of the app life-cycle. Best for configuration settings, caching services or logging tools that should be global. 

# TO DO LIST 2-17-2026
1. Implement a session ID (JWT).
2. Create log in controller.

# OnModelCreating 
- for "Race Condition" where two people register the same   name at the exact same
  millisecond. It enforces database-level rules that AnyAsync checks alone can't 
  guarantee (due to potential race conditions)

# Interface
- An Interface in C# is a contract that defines a set of 
  methods, properties, events or indexers that a class or
  struct must implement. It specifies what must be done
  but not how (no implementation). 

- ## DTO vs Interface
  > DTOs are data carriers; interfaces define behavior 
- ## Models vs Interface
  >Models encapsulate state and logicl interfaces are
    abstract contracts. 

# Claims
- Are a piece of information about the user (or object) that you want to embed inside the
  JWT. 
- Can come from your database or any other sources. 
- When the token is issued, those claims become part of the payload. 
- They are information about the user embedded in a JWT Token, and claims can be
  validated and correlated to the user that is embedded in the JWT token. 
- JWT carries claims (user information) inside it. 
- Signature is what makes it trustworthy, only the server can issue a valid signature.

# Signing Credentials
- Combinations of: 
  - **Security key:** secret key.
  - **Signing Algorithm:** like HMAC‑SHA512, RSA‑SHA256, etc

  Together they define how the token will be cryptographically signed. 
  
- They act as seals on token: it proves the contents haven't been tampered with and that they came from a trusted source (the server).
- When another service or client receives the token it validates the signature using the same key (or the corresponding key, in assymetric cases). If the signature checks out, the claims are trusted. 

# Cookie 
- A small piece of data that servers asks the browser to store, and then the browser automatically sends it back with future requests to that same server. It's like a "note" the server gives the browser to remember something between requests. 
  ## Cookie Option
  Controls how the cookie behaves. 

  ```
  HttpOnly = true
  ```
  - The cookie cannot be access via JavaScript.
  - This protects against cross-site scripting attacks because malicious scripts can't steal the token from the browser.
  
  ```
  Secure = true
  ```
  - The cookie will only be sent over HTTPS connections.
  - Prevents exposure of the token over insecure HTTP traffic.

  ```
  SameSite = SameSiteMode.Strict
  ```
  - Controls whether the cookie is sent with cross-site requests.
  - **Strict** means the cookie is only sent for the same site. 
  - This helps mitigate CSRF (Cross-Site Request Forgery) attacks.

  ```
  Expires = DateTime.UtcNow.AddHours()
  ```
  - Sets the cookie's expiration time.

# Backend Authentication
- Verifies user identity by validating credentials against a secure database, acting as the primary gatekeeper before database. 

# Backend Authorization 
- The security process of determining what an authenticated user is permitted to do or access, ensuring they only interacti with authorized resources. 

# To store JWT Key in the local device
dotnet user-secrets set "(put secret key here)".

# To see stored JWT Keys in the local device
dotnet user-secret list.

# Identity Service in ASP.NET Core
Is a complete membership system that handles user accounts, logic logic and security data for your
application. It focuses on management, storing users in a database, hashing passwords, managing roles
and handling two-factor authentication.