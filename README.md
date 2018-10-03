# hci-password

A 3D password system demo for an HCI research study of password memorability. Built using [ThreeJS](https://threejs.org/) and [jQuery](https://jquery.com/).

Users interact with the password system through a training phase where they are introduced to three randomly generated passwords and then a practice phase where they are given 3 attempts for a total of 9 maximum attempts to enter each password correctly.

Accompanying this project is a paper using data collected from usage of `N = 20` users in order to determine whether or not the password system was an effective replacement for regular password systems. Users remained anonymous and signed basic data-privacy agreements.

Note that logging is optional, but requires that a saving endpoint be available on the user's machine. This can be configured simply in in the `js/script.js` file by changing `config.dump_url`. During the study I collected data using a server configured running apache2 over HTTPS.

# Screenshot

![](https://raw.githubusercontent.com/qubard/hci-password/master/screenshot.png)

# Usage

Run or open `.index.html` locally, alternatively serve it on a server.

The `save.php` file is an example of how to write sample data received from a `GET` request using the `log` parameter to produce log data. Obviously this is not very secure but a basic example of how data can be collected.

# Example login session output

The detailed log format is somewhat arbitrary and was given by project specifications, but includes a tuple of the relevant information for the different password events. The tuple structure is `(date, username, name, username, "", method, method_status, data)`.

An example of the arbitrary format the log file hard to file was that the 5th element of the tuple always had to be an empty string, for whatever reason, as given by the project specification. Similarly, a `login` success was always followed by `method_data` equal to `failure` or `success` and an `enter` followed by a `start`.

```
"2018-04-04 19:23:15","3DPass40698","Carleton","Test3DPass","","create","start",""
"2018-04-04 19:23:29","3DPass40698","Carleton","Test3DPass","","create","success","podiumchairtablebooklaptoptabletablebook"
"2018-04-04 19:23:29","3DPass40698","Travel","Test3DPass","","create","start",""
"2018-04-04 19:23:40","3DPass40698","Travel","Test3DPass","","create","success","suitcasecameraplanestopsigncamerasunglassesstopsignbinoculars"
"2018-04-04 19:23:40","3DPass40698","Store","Test3DPass","","create","start",""
"2018-04-04 19:23:53","3DPass40698","Store","Test3DPass","","create","success","bootshopping_cartshopping_bagshopping_bagcartonshopping_cartbootbox"
"2018-04-04 19:23:53","3DPass40698","Store","3DPass","","enter","start",""
"2018-04-04 19:24:39","3DPass40698","Store","3DPass","","login","failure","boxboxboxbananacartoncartonboxshopping_bag"
"2018-04-04 19:24:39","3DPass40698","Store","3DPass","","enter","start",""
"2018-04-04 19:24:45","3DPass40698","Store","3DPass","","login","failure","boxbananashopping_bagshopping_bagshopping_bagboxcartonbox"
"2018-04-04 19:24:45","3DPass40698","Store","3DPass","","enter","start",""
"2018-04-04 19:24:50","3DPass40698","Store","3DPass","","login","failure","bananabootshopping_bagcartonboxshopping_bagboxboot"
"2018-04-04 19:24:50","3DPass40698","Travel","3DPass","","enter","start",""
"2018-04-04 19:24:58","3DPass40698","Travel","3DPass","","login","failure","cameraplanebottlestopsignstopsignsunglassescameracamera"
"2018-04-04 19:24:58","3DPass40698","Travel","3DPass","","enter","start",""
"2018-04-04 19:25:05","3DPass40698","Travel","3DPass","","login","failure","bottlemapbinocularsmapstopsignbinocularsbinocularsmap"
"2018-04-04 19:25:05","3DPass40698","Travel","3DPass","","enter","start",""
"2018-04-04 19:25:13","3DPass40698","Travel","3DPass","","login","failure","binocularsstopsignplanesuitcasecameraplanemapbottle"
"2018-04-04 19:25:13","3DPass40698","Carleton","3DPass","","enter","start",""
"2018-04-04 19:25:19","3DPass40698","Carleton","3DPass","","login","failure","tablechairearthbookshelfblackboardbookpodiumpodium"
"2018-04-04 19:25:19","3DPass40698","Carleton","3DPass","","enter","start",""
"2018-04-04 19:25:25","3DPass40698","Carleton","3DPass","","login","failure","booktablechairearthearthchairchairbook"
"2018-04-04 19:25:25","3DPass40698","Carleton","3DPass","","enter","start",""
"2018-04-04 19:26:09","3DPass40698","Carleton","3DPass","","login","failure","bookshelfbookshelftablebookshelfblackboardchairearthlaptop"
```
