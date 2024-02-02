# gdlaxr-release

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.
- `preload.js` - A content script that runs before the renderer process loads.

You can learn more about each of these components in depth within the [Tutorial](https://electronjs.org/docs/latest/tutorial/tutorial-prerequisites).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/xinbiao666/gdlaxr-release.git
# Go into the repository
cd gdlaxr-release
# Install dependencies
npm install
# Run the app
npm start
# Package the app as an installation program
npm run dist
# Used to generate an application directory for easy testing and debugging, rather than creating an installation package for distribution.
npm run pack
```

Select the outermost folder where your project is located. For example:Publish pc-web project using the project folder address as: 'D:\your-folder\pc-web'

