<p align="center">
<img src="res/WillCoreLogo.png" style="height:355px" />
<h1 align="center">WillCore Visual Studio Code Plugin</h1>
<h5 align="center">Intellisense Provider And Code Template Support For Visual Studio Code</h5>
</p>

___

<br/>

Provides intellisense for supported WillCore modules and project templates for web and API projects.

## Intellisense Support

Plugin adds support for the following intellisense code completion:

* Server-side assignable completion
* Client-side assignable completion
* HTML element ID completion
* CSS class names

<br/>

![Intellisense](/res/intellisense.png)

Intellisense support will be activated when plugin is installed and activated.

<br/>

## Project Templates

Project templates can be installed via VSCode commands. To activate the commands dropdown, press ___ctrl + shift + P___.

<br/>

![Intellisense](/res/commands.png)

<br/>

### Website

The command to setup the web environment is ___WillCore: Setup Web___.

The web command will add template files for a SPA and install the following packages:

* [willcore.server](https://github.com/PhilipCoder/willcore.server)
* [willcore.ui](https://github.com/PhilipCoder/WillCore.UI)
* [willcore.bootstrap](https://github.com/PhilipCoder/willcore.bootstrap)
* [willcore.session](https://github.com/PhilipCoder/willcore.session)

After the project is setup, it can be run by pressing F5.

### API

The command to set the web-service or web API environment is __WillCore: Setup Web API___.

The API command will add template files for a web-service and install the following packages:

* [willcore.server](https://github.com/PhilipCoder/willcore.server)