# myAdam

This repo represents the solution for the task requested by MyAdam.

It includes Server and Client directories.

## functionalities:

### Painter:
  - Can view their bookings
  - Can view all of their submitted slots filtered by date and status
  - Can submit available slots:
      - Slots are predefined to avoid complex logic in handling intersections and overlapping intervals
      - Multiple slots can be submitted in the same day in one request
      - No slot with the same date and time can be submitted twice by the same painter
### Home owner:
  - Can View the nearest upcoming booking
  - Can view all their bookings
  - Can request paint job in a specific date time
  - If there are no available painters within the same city, the nearest available slot will be proposed to the Home owner as an alternative option.


## Technical specs:

1. JWT is used for authentication
2. Authentication is presented in middleware layer
3. Request source validator is presented in a middleware layer (to avoid painter to submit home owner requests and vice versa since they are the same schema)
4. The backend server is containerized using docker
5. Sample of unit tests were added for Engineering excellence
6. Managed instance of MongoDb is used as the persistent storage of the system.
7. N-tier architecture is used
8. Client is created with the help of cursor

## Future addition:
1. Return more than one slot to the Home owner to choose from
2. Filter option to the Home owner based on the painter reviews and ratings, proximity and number of successful bookings.
3. Validation layer in the backend server to validate the request input separately from the controller layer
4. middleware to handle failed requests instead of repeated try/catch statement in every function


## To run the application:
### Backend
  - Add .env file to the root of the server directory
  - CD to the server directory
  - run `docker build -t adam-backend .`
  - run `docker run -p 5000:5000 adam-backend`

### Frontend
  - Add .env file to the root of the cliet directory
  - CD to the client directory
  - run `npm run dev`


Note: .env file should be provided by the repo owner.


  




