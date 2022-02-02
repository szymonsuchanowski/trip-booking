# TRIP BOOKING APP

![Trip Booking App client mockup](/assets/trip-booking-mockup-client.png "Trip Booking App client mockup")
![Trip Booking App admin mockup](/assets/trip-booking-mockup-admin.png "Trip Booking App admin mockup")

&nbsp;

## 🔍 Overview

### What is Trip Booking App?

In short, Trip Booking App is a tool that allows both **users to order trips** and **manage the offer of available trips by the administrator**.

### Trip Booking App features

#### Client site

-   **add trips** to the basket
-   **preview of the basket** (**updated** cost and list of added trips)
-   **remove trips** from the basket (after confirmation - **modal window**)
-   **place an order** - after completing the form (the order is added to the database - API launched using JSON Server)
-   data entered by client are **validated**

#### Admin site

-   **panel for managing trips** saved in the database (API launched using JSON Server)
    -   **adding** new trip
    -   **removing** trip
    -   **editing** saved trips
-   data entered by admin are **validated**

&nbsp;

## 👨‍💻 Built with

![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=Webpack&logoColor=white)
![Babel](https://img.shields.io/badge/Babel-F9DC3E?style=for-the-badge&logo=babel&logoColor=white)

&nbsp;

## ⚙️ Run Locally

The project uses [node](https://nodejs.org/en/), [npm](https://www.npmjs.com/) and [JSON server](https://www.npmjs.com/package/json-server), follow the steps below to run it locally.

-   Clone the project using

```bash
  git clone
```

-   Go to the project directory and install dependencies

```bash
  npm i
```

-   Start the JSON server

```bash
  npm run api
```

-   Start developers mode

```bash
  npm start
```

-   Trip Booking App is ready to go: - client site

        ```bash
        http://localhost:8080/index.html
        ```

        - admin site

        ```bash
        http://localhost:8080/admin.html
        ```

        - data (database)
            - existing trips

            ```bash
            http://localhost:3000/excursions
            ```

            - orders placed

            ```bash
            http://localhost:3000/orders
            ```

    &nbsp;

## 🤔 Solutions provided in the project

-   **local API** launched using JSON Server
-   **CRUD** functionality
-   API operations in a separate `ExcursionsAPI.js` file - functions for **creating**, **reading**, **updating** and **deleting** data using fetch()

```javascript
    _fetch(additionalPath, options) {
        const path = this.url + additionalPath;
        return fetch(path, options)
            .then(resp => {
                if (resp.ok) { return resp.json() }
                return Promise.reject(resp);
            });
    }
```

-   **slider** that allows to change displayed trip (in a separate `Slider.js` file)
-   all **form fields are validated** according to the rules saved in the `DataValidator.js` file (e.g. using **regular expresions**)
-   error information is displayed to the user (e.g. about invalid e-mail address), separate `InfoHandler.js` file
-   **JS modlues** and ES6 Syntax (arrow functions, classes)
-   Trip Booking App styling
    -   **RWD**
    -   **pure CSS** with the use of variables (the ability to quickly change, for example, colors)

&nbsp;

## 🔗 Useful resources

-   [json-server](https://www.npmjs.com/package/json-server)
-   [The Modern JavaScript Tutorial](https://javascript.info)

&nbsp;

## 🙏 Special thanks

Special thanks to my [Mentor - devmentor.pl](https://devmentor.pl/) for providing me with the task and code review.
