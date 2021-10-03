# couchfun - Author Couchdb Views in Typescript

MapReduce functions in CouchDB must be a specific version of ECMAScript to be run in its default Spidermonkey javascript engine.

With `couchfun` these functions can be implemented in modular Typescript files. 

Operations are provided to... 
* transpile your Typescript mapreduce functions to ECMAScript
* synchronize the result into Views in a CouchDB database