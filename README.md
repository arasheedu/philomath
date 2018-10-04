# Philomath

![](https://github.com/arasheedu/philomath/blob/master/docs/utopia.gif)

Philomath helps you index your bookmarks on your machine such that they can be searched with keywords easily for later reference and recollection. In the fast changing search results on the web how often have you looked for the same web page again and had no luck. With philomath it becomes easier to index and reference the web articles that you care most.

This has been developed on Windows 10 and Docker for Windows is a pre-requisite to run the solution

### Running from source

```sh
c:\> cd philomath
c:\philomath> docker build -t philomath --file Dockerfile.philomath .
c:\philomath> docker-compose up
```

```sh
c:\> cd philomathclient
c:\philomathclient> npm install
c:\philomathclient> npm start .
```

The rest is self explanatory ;-)

License
-------

MIT
