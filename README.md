# WEB Mixer
## Video Demo:  [Youtube Video]()
## Description:
### Introduction

Web Mixer is a web aplication that **mimics**, _in a very basic form_, an audio **mixing console**.

**_What's mixing?_**

Mixing, at its most basic level, is a process in audio production where all elements of the audio are balanced so that each sound—whether it's an instrument in a song or the sound effects of footsteps in a movie—is distinguishable and contributes to the overall main idea of the final product

**_How is it made?_**

This is achieved in many cases through a console, which is a device that controls the overall volume and placement of each sound by sending it to a specific "channel." The combined output of all these sounds is then sent to a final channel (usually the last stereo channel).

**_This application_**

The **main goal** of this application is to **replicate the functionality** of a basic **audio mixing console**.

### How to start the app

**_Home page_**

If the user has **not logged in** and the web page is accessed for the **first time**, they will be greeted with a page displaying a _welcome message_ in white letters. A **navigation bar**, _shared across all pages_, will also be visible on the screen.  In this case, the user is presented with two options: to **register** or to **log in**.  

The server handles this by using the **Flask** API in **Python**. The code checks whether the user **is logged in**. If the user **is not logged in**, the _"home.html"_ page is rendered.

**_Register_**

If the user has **not registered** yet, clicking the corresponding option in the **navigation bar** will redirect them to the **registration page**. In this case, the navigation bar provides the user with two options: to navigate to the _"log in"_ page (labeled as **Log In**) or to return back to the _"home"_ page (labeled as **Home**).

In the main body of the page, the user will find a **form** to fill out. The first field requires the user to input an **email address**. The second field requires a **password**, and the third and final field requires the user to **re-enter the password** from the previous field.

If the user clicks the **submit button** without completing any of the fields, if the email already exists in the database, or if the passwords do not match, the server will redirect the user to an **apology page**. This page handles **each case** with a specific message explaining the issue.

To achieve this, the server first checks if an email was entered. If so, it then checks the **SQL database**, specifically the **users** table, to see if the email address already exists. If the email is found, the server redirects the user to the _"apology.html"_ page with the corresponding message.

Next, the server checks if both passwords were entered and if they match. If they don't match or if either password was not entered, the server redirects the user to the _"apology.html"_ page again. If both passwords are correct, the password is hashed using **werkzeug.security** and then stored in the same SQL table, along with the email address and a unique user ID and the user is then redirected to the _"index.html"_ page.

**_Log In_**

The navigation bar on the Log In page provides the user with two options: to return to the Home page or to navigate to the Register page. Inside the Log In page, there is a form with two fields: one for the **email** and one for the **password**.

If the user clicks the submit button without filling in either of these fields, or if the information provided is incorrect, the server redirects the user to the _"apology.html"_ page with a corresponding message. If both fields are correctly filled, the user is redirected to the _"index.html"_ page.

The server handles this by first ensuring the corresponding session is cleared. It then verifies whether the email was submitted, followed by checking if the password was provided. If both were correctly submitted, the server queries the **users** table in the SQL database to validate the email and password. If any of these checks fail, the user is redirected to the _"apology.html"_ page with an appropriate message.

If the provided credentials match the data in the table, the server stores the user's ID (retrieved from the users table) in the Flask session. Finally, it redirects the user to the _"index.html"_ page.

### How to use the console

**_"index.html"_**

Both the redirection to the _"home.html"_ and the _"index.html"_ pages are managed by a single route in Python named **('/')**. Depending on whether the user is logged in, the server loads a different page. When the user has successfully registered and logged in, this route redirects them to the _"index.html"_ page, which contains the console.

The navigation bar at the top of the _"index.html"_ page provides the user with two options: to navigate to Home or to Log Out. If the user clicks on the **Home** link, the page reloads. If the user clicks on the **Log Out** link, the user session is cleared, and they are redirected to the _"home.html"_ page. This is handled through a form containing a submit button labeled "Log Out" and a corresponding route in Python.

**_How to start the console_**

Below the navigation bar, when the page is first loaded, the only visible element is a red button labeled **"On."** When this button is clicked, a message appears next to it that says, **"Starting console."** Once the process is complete, this message is replaced with **"Ready."**

At the same time, two new buttons appear: one is a round button with a **play/pause** symbol, and the other is a square button with rounded edges and a **stop symbol**. Below these buttons, five **channels** become visible, each with two sliders and labeled with the names of the different instruments from the track **previously loaded** onto the server.

When the **play/pause** button is pressed for the first time, the **"Ready"** message disappears, and the song begins to play. This button also functions as a pause button, momentarily halting the playback until pressed again.

The **stop** button completely stops the audio. If the play button is pressed after stopping, the song restarts from the beginning. If the song reaches the end without the stop button being pressed, it **automatically restarts** from the beginning.

**_How to use the console_**

The sliders can be adjusted as soon as they appear on the screen. The top slider controls the **pan**, which moves the audio from left to right.  It changes in increments of **0.2** and has a range from **-1** (fully left) to **1** (fully right). The current value of the slider is displayed below it, and all sliders always start at **0** (center).

The other slider in each channel is the vertical one, which represents the **fader** of a console and controls the output gain or _"volume"_ of each instrument (or sound). This slider has a range from **0** to **1**, with increments of **0.01**, and its starting value is **0.6**.

The current value is displayed next to the fader. However, a JavaScript function adjusts this value to approximate a **dBFS (decibels relative to full scale)** scale, which is the standard way of measuring volume in digital devices. On this scale, the maximum value of **1** corresponds to **0 dBFS**.

### Audio Web API

The console operates using an **API** that is natively available in JavaScript, called the **Web Audio API**. This API provides more advanced features for controlling audio compared to the standard `<audio>` tag in HTML.

The **Web Audio API** works by creating an **audio context**, which serves as the environment where audio processing and management occur. Audio is handled using a **modular** design. Within the audio context, basic audio operations are performed using **audio nodes**, which are connected to form an **audio routing graph**. The API supports different types of audio sources, each of which can be controlled independently. This modular approach provides the flexibility needed to create complex audio functionalities with dynamic effects.

The first type of node that should be created after the **audio context** is initialized is a **source node**. There are various types of source nodes, but this project utilizes **buffer nodes**, which store the audio files located on the server. These nodes enable the server to play the stored sounds.

Following the source nodes, additional nodes are typically added to control and modify the audio. These nodes can manage properties like volume, pan, filters, and effects. For this project, only **pan** and **gain** nodes were used.

At the end of the chain, to enable sound playback, the final node must be connected to the **audio destination node**, which represents the output source. This allows the user to experience the audio.

**_JavaScript Code_**

Due to the way some web browsers handle autoplay, it is recommended that no audio begins without user interaction. This is why, when the page is first loaded, only the **"On"** button is displayed. Even though the rest of the console could be visible and the user could adjust the sliders, no actions would take effect, and interacting with the other buttons would simply generate an error.

When the **"On"** button is clicked, an **audio context** is created and stored in a variable. Then, **pan** nodes and **gain** nodes are created for each channel, although they are not connected at this stage. After this, another API, called **fetch**, is used to retrieve the MP3 files stored on the server and to assign the corresponding instrument name to each channel. 

When the **fetch** process is completed, a function called **setupSamples** is invoked on the data retrieved from the server. This function accomplishes two tasks: first, it displays the message indicating that the console is being prepared, and second, it stores each sound in an **array buffer** by using another function, **getFile**, which creates an audio buffer for each sound.

Once this is done, and still within the **setupSamples** function, the _"Ready"_ message is displayed, along with all the other buttons and sliders. Finally, the array containing all the buffers is returned.

Next, the function for the **play/pause** button is created. When the button is clicked, all messages are hidden, and a variable marking the end of a loop is updated to match the length of an audio sample (in this case, all samples are of the same length).

If the **stop** button has been pressed or the song hasn’t been played yet, a function named **playSample** is invoked within a loop corresponding to the number of sounds. This function creates a **source node** for each sound, connects it to the pan and gain nodes, and sets up an audio loop so that when the song reaches its end, it automatically starts over. Finally, the last node is connected to the audio destination node, and the audio begins playing.

Still within the **play/pause** button function, two **if **statements are implemented. The first pauses the audio context if the song is currently playing, and the second restarts the audio context if it has been paused.

Next, the function for the **stop** button is implemented. When the button is clicked, it calls a function named **stopSong**, which iterates through a loop to stop each audio source.

Finally, two loops are implemented to give the user control. Each time the user adjusts the **pan** or **fader** sliders, these changes are applied to the corresponding pan or gain nodes, updating the values accordingly.

### Recomendations

Although this project is in a state that can be considered **complete** since it fulfills its purpose of functioning as a basic audio console, there is still much room for improvement.

The first, and simplest, enhancement would be to add a new slider that controls where the song starts and where the loop ends. This would allow the user to select a specific section of the song to work on. This feature can be achieved by creating a slider with two movable points that adjust the values of the variables controlling the start and end points of the loop.

The second change I attempted to implement was creating a save and load function that allows the user to save the values they have adjusted. These values should be stored in an SQL database in a table related to the user's ID. I created the table and tried to save the values, but I was unable to make it work.

I approached this idea in two ways: first, using an array in JavaScript and the fetch API. However, when I attempted to store the values in SQL, I encountered an error stating that there were more values than the information being stored in the table, which was not the case. I tried to debug this issue in various ways, but I was never able to resolve the error, which indicated that there were more values than the `?` placeholders in the SQL query.

I tried a different approach by wrapping all the channels in a `<form>` and assigning each slider a unique name. However, when I attempted this, I encountered a problem with the server, which prevented me from loading the channels.

A third improvement that can be made is to enhance the console’s capabilities by adding **audio effects**, as most modern consoles operate this way. The first effect I would add is a **compressor**, which can be implemented using a simple node in the **Audio Web API**. The next effect I would add is a basic **equalizer**. While this can be achieved through a combination of **filter nodes**, it is more complex because there isn’t a single EQ node —multiple filters need to be used. Lastly, other effects like **delay** or **reverb**, which are very useful in a mix context, can also be added with nodes. However, since these nodes should only be accessed if the user chooses to send audio to them, the implementation becomes a bit more complex. Additionally, **mute** and **solo** buttons could also be useful.

A fourth and final improvement that could transform this application into a real-world, useful tool would be to allow the user to load their own audio sources.

### Miscellaneous

**_The song_**

For demonstration purposes and to make the console functional with some audio, the song was composed and played by me. It doesn't have a name and is quite simple and short (less than 3 minutes in length). Feel free to modify it, but if you decide to use it as your own, please at least credit me (even though it's not a very good song).

