# Dronify

<img src="./public/images/logo.png" align="right"
     alt="Dronify Logo" width="225" height="200">

**Team Members:**

- Candice Wei
- Spring Cheng
- Nolan Wai
- Melissa Shao
- Michael Lau

## Project Description

**Dronify** is a web application that deploys autonomous drones (on-demand) to offer package delivery and roadside assistance for autonomous car owners during accidents, thereby reducing delivery time and traffic congestion.

## Project Technologies
**Front-End**
* HTML, CSS 
* Tailwind
* Express.js
* EJS
* AJAX

**UI Component Library**
* Flowbite
* Cloudinary

**Back-End**
* JavaScript
* jQuery
* Turf.js
* MongoDB

**API**
* Mapbox API
* Geolocation API
* Open Weather API


For the **front-end** we used:
* **Flowbite** as our UI library

For the **back-end** we used:
* **Mapbox API** for the map interface and the foundation for the visual interface
* **Turf.js** for routing display on the map
* **Geolocation API** for getting the user’s current location
* **Open Weather API** for our Easter egg
Cloudinary for populating user’s profile image

For the **database** we used:
* **MongoDB** for hosting our data collection (user’s personal information, user’s session, battery station geo-coordinates)

## List of Files
```

 Top level of project folder: 
├── .gitignore                          # Git ignore file
├── .env                                # env file
├── package-lock.json                   # package-lock.json file
├── package.json                        # package.json file                        
├── server.js                           # 
├── users.js                            # 
├── battery_station.js                  # 
├── tailwind.config.js                  # 
└── README.md

It has the following subfolders and files:
├── .git                                # Folder for git repo
├── node_modules/                        # node_modules file
├── .vscode/                             # .vscode file
├── public/                              # Folder for all static files
    └── images/
        ├── battery_marker.svg
        ├── catmeme.png
        ├── chevrons-right.png
        ├── confirmation_1.png
        ├── confirmation_2.png
        ├── confirmation_3.png
        ├── confirmation_4.png
        ├── core_feature_icon1.svg
        ├── core_feature_icon2.svg
        ├── core_feature_icon3.svg
        ├── chevrons-right.png
        ├── chevrons-right.png
        ├── chevrons-right.png
        ├── chevrons-right.png
        ├── chevrons-right.png
        └── image1.png 
    └── scripts/
        ├── animation.js
        ├── battery_stations.js
        ├── calculate_distance_time.js
        ├── calculate_price.js
        ├── drone_share.js
        ├── get_cards_from_DB.js
        ├── location_picker.js
        └── session_storage.js
    └── styles/
        ├── animation.css
        └── battery_stations_map.css
    └── videos/
        └── landing_page_video.webm

    └── script.js/



├── views                            # Folder for all ejs files
    /authentication.js
    /firebaseAPI_DTC11.js
    /main.js
    /profile.js
    /script.js
    /skeleton.js
    /notes.js
    /timer.js
    /resource_main_page.js
    /resource_navbar_footer.js
    /resource_consultation_page.js
    /resource_fitness_course_page.js
    /resource_helping_group_page.js
    /helping_group_each.js
    /helping_group_review.js                         
├── styles                              # Folder for styles
    /style_notes.css    
    /style.css
    /style1.css                        
├── text                                # Folder for nav bar and footer
    /footer.html
    /nav_after_login.html
    /nav_before.login.html

```

## How to Run Our Project
To get started with Dronify, the hosted version of the product can be used. You can get started immediately [here](https://dronify-mbme.onrender.com/). After the login page, you will be greeted with our three core features to select from.

### What to Install

**Language(s):**
* EJS
* JavaScript
* CSS

**IDEs:**
* Visual Studio Code

**Database(s):**
* MongoDB

**Other software:**
* Cloudinary
* Express
* bcrypt
* mongoose
* Joi
* multer
* cors

**Third Party APIs:**
| API        | Usage & Description        |
| ------------- |:-------------:|
| Mapbox API      | Map interface and the foundation for UI |
| Geolocation API | Getting the user's current location    |
| Open Weather API | Our Easter Egg component    |

### Required API Keys
* Mapbox Acess Token
* Open Weather API

### Testing
Here is our [link](https://docs.google.com/spreadsheets/d/14Fitry6ACC5__D6XGdvO7034vG4NWeVpk5qbL6u0m30/edit?usp=sharing) to the testing done for this project, feel free to take a look and contribute to any bugfix!

### Additional Notes
Installation location and order does not matter for this project.

## Features
<img src="./public/images/Feature_cover.png"
     alt="Feature cover" width=full height=full>
<img src="./public/images/Feature_1.png"
     alt="Feature cover" width=full height=full>

### Core Feature 1: Direct Delivery
<img src="./public/images/Feature_2.png"
     alt="Feature cover" width=full height=full>
<img src="./public/images/Feature_3.png"
     alt="Feature cover" width=full height=full>
<img src="./public/images/Feature_4.png"
     alt="Feature cover" width=full height=full>

### Core Feature 2: Drone-share
<img src="./public/images/Feature_5.png"
     alt="Feature cover" width=full height=full>
<img src="./public/images/Feature_6.png"
     alt="Feature cover" width=full height=full>

### Core Feature 3: Roadside Assistance
<img src="./public/images/Feature_7.png"
     alt="Feature cover" width=full height=full>
<img src="./public/images/Feature_8.png"
     alt="Feature cover" width=full height=full>

### Account Feature: Profile Image Customization
<img src="./public/images/Feature_9.png"
     alt="Feature cover" width=full height=full>

## Credits
* City of Vancouver Open Data for plotting battery stations -
https://opendata.vancouver.ca/explore/dataset/electric-vehicle-charging-stations/api/
* Inspiration for 3-D route representation on a 2-D map interface - https://www.youtube.com/watch?v=VNVmlWv4gdQ
* Icons8 for in-app icons - https://icons8.com/icons/
* Tabler for in-app icons - https://tablericons.com/
* Gemini Advanced for mathematical logic implemented in map routing - https://gemini.google.com/advanced

## References
* 404 page animation design - https://www.silocreativo.com/en/creative-examples-404-error-css

## AI Usage
**Project Support:**
* Our App Logo is generated using ChatGPT 3.5
* Although we did not use AI directly integrated in our app, we used it for code analysis - the old “explain this to me”
* We used it to minimize the risk of human error when working with long and possibly redundant lines of code (e.g. copy-and-paste fail)

**Data Sets:**
* Non-applicable, the only data set utilized in this project is the geoJSON data set used to plot EV Battery Stations

**AI Integration:**
* Our app does not directly use AI

**Limitations Encountered:**
* Integration testing is hard for the current “free” models of AI to do well, when there are many components of the application coming together and working together in a somewhat delicate manner, it is hard for the current AI models to fully capture this well and provide accurate trouble-shooting

## Sources
* Default profile image from - Google Image
* Landing page video from - Freepik

## Contact Information

You can reach us via GitHub profiles:

[![GitHub](https://img.shields.io/badge/GitHub-CandiceWei-blue?logo=github)](https://github.com/candiceweily)
[![GitHub](https://img.shields.io/badge/GitHub-NolanWai-blue?logo=github)](https://github.com/nueiwai)
[![GitHub](https://img.shields.io/badge/GitHub-MelissaShao-blue?logo=github)](https://github.com/Melissa-Shao)
[![GitHub](https://img.shields.io/badge/GitHub-MichaelLau-blue?logo=github)](https://github.com/energized36)
[![GitHub](https://img.shields.io/badge/GitHub-SpringCheng-blue?logo=github)](https://github.com/spring-cheng)