# Node.js exercise

This project is a Node.js application that provides an API for managing packages and their prices. It uses Express for the web framework and Sequelize for ORM with a SQLite database.

### Technical Overview

- **Database Model**: The data model comprises three core entities: `Municipality`, `Package`, and `Price`. The `Price` entity is central to implementing both municipality-based pricing and pricing history features.
- **Core Tests**: Given the `Price` entity's central role, the base tests were refactored and relocated to `price.service`, specifically within the `getHistory` and `createOrUpdatePrice` methods. These tests focus on the essential business logic of the requested features.
- **Active Price Logic**: To maintain a single active price per package, the code automatically inactivates the previous price when a new one is added. This approach simplifies price management and ensures data consistency.
- **MVC Structure**: The project uses an MVC-like pattern, which I preserved without introducing a dependency injection pattern, optimizing development time while maintaining a straightforward structure.
- **Error Handling**: Error handling has been centralized through an error middleware. While effective for a small project, this approach may pose challenges as the application grows in complexity.
- **Validation**: Payload validation was implemented using regular expressions. Although libraries like Zod or Joi would provide stronger validation and would be my preferred choice, they were omitted to adhere to the rule of not adding external packages.
- **Authentication**: The `njwt` dependency was removed, as implementing an authentication layer was not feasible within the time limit and would require additional entities in the data model.
- **Migrations**: Sequelize migrations were not included but would be the next logical step for enabling production deployment.
- **@types/cors** was added since `cors` dependency was already present.

### Testing

- **Test Coverage**: Full test coverage was not achieved within the time constraints. However, the primary business logic within the service layer is adequately tested.

### Additional Resources

- In the `extraResources` folder:
  - An Insomnia collection with all API endpoints is available for easy testing.
  - An image depicting the database model illustrates the relationship between the core entities.

### Project Structure

The proposed project structure was largely preserved, but the main code is nested within a `src` folder:

```
.
├── db
│   └── DB Sqlite file and seed file.
├── extraResources
│   └── Holds auxiliary resources, including an Insomnia collection with API endpoints and a database model diagram.
└── src
    ├── controllers
    │   └── Manages incoming requests, separating core logic from Express-specific objects, orchestrating payload validation and business execution.
    ├── db
    │   ├── models
    │   │   └── Sequelize models that handle the database structure and interactions.
    │   └── Database configuration for the application.
    ├── helpers
    │   ├── errors
    │   │   └── Custom error classes for consistent error handling.
    │   └──  Contains utility functions for standardized error handling.
    ├── middlewares
    │   └── Contains Express middlewares used in the application.
    ├── routes
    │   └── Defines API endpoints and links routes to controllers.
    ├── service
    │   └── Contains core business logic, such as pricing management and history retrieval.
    └── validators
        └── Validation layer for inbound payloads, ensuring correct data formatting and structure.
```

### Future Enhancements

Given more time, I would implement the following improvements to enhance the application's functionality, maintainability, and scalability:

1. **Enhanced Validation**: Integrate **Zod** for more robust inbound data validation, replacing regular expressions for improved type safety and validation consistency.
2. **Sequelize Migrations**: Introduce **Sequelize migrations** to better manage database changes and make the application ready for production deployment.
3. **Dependency Injection**: Add a **dependency injection pattern** to improve testability and scalability, enabling more flexible configuration and enhanced modularity.
4. **Logging and Observability**: Implement a **logger transporter** to improve visibility into business operations. Enhanced logging would facilitate easier debugging and provide detailed logs for business exceptions.
5. **Expanded Testing**:
   - Increase **unit test coverage** to ensure comprehensive testing of core business logic.
   - Add **integration tests** for API endpoints to verify end-to-end functionality and ensure that different components work cohesively.
6. **Database Connection Management**: Review the **SQLite connection** settings and introduce a **connection pool** for optimized database handling, improving efficiency and performance in concurrent operations.
7. **User Entity & JWT Authentication**:
   - Add a `User` entity to support **JWT-based authentication** for enhanced API security.
   - Track the **creator and modifier** of records by associating entities with the respective `User` entity, enhancing accountability and auditability.
