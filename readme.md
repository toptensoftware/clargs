# clargs

Tools for processing command line arguments,

## Features

* Positional arguments eg: `file.txt`
* Long name switches eg: `--switch`
* Short name switches eg: `-abc` => `--a --b --c`
* Long named values eg: `--name=value` or `--name:value`
* Short named valued eg: `-aVALUE` => `--a:VALUE`
* Delimter argument `"--"`
* Tail arguments (all remaining argument)
* Helper for displaying version info from `package.json`
* Helper for formatting argument help into two aligned and wrapped
  columns.

## Installation

```
npm install --save toptensoftware/clargs
```

*Note: installs from GitHub, not NPM hence no `@` on the package name
when installing*

## Parsing Arguments

Import `clargs` function.

```js
import { clargs } from "@toptensoftware/clargs";
```

Create an instance, by calling clargs.  With no arguments
it uses the `process.argv`

```js
// Uses process.argv.slice(2)
let args = clargs();     
```

or, supply your own args

```js
let args = clargs(["arg1", "arg2"]);
```

Then process args:

```js
let port = 3000;
let verbose = false;
let theRest;
while (args.next())
{
    switch (args.name)
    {
        case "h": 
        case "help":
            // -h or --help
            showHelp();
            process.exit(0);
            break;

        case "verbose": 
            // --verbose (same as yes)
            // --verbose:yes 
            // --verbose:no
            verbose = args.boolValue;
            break;

        case "port":    
            // eg: --port:4000
            port = args.intValue;
            break;

        case "--":
            // eg: -- tail1 tail2
            // tail = [ "tail1", "tail2" ]
            theRest = args.tail;
            break;

        case null:
            // unnamed arg eg: file.txt
            file = args.value;
            break;

        default:
            throw new Error(`unknown arg: ${args.Name}`);
    }
}
```

The `args` object supports the following:

* `next()` - moves to the next argument, returning `true` if one is available
  otherwise `false`.

* `name` - the name of the current argument or `null` for unnamed (aka positional) arguments, or `"--"` if the argument is `"--"`.

* `value` - the value of the argument.

  For unnamed arguments this is the value as specified.

  For named values these are separated with `:` or `=`.  
  eg: `--switch:value`

  For short named values these are either separated, or the rest of 
  the short value string.  eg: -dVALUE gives name "d" and value "VALUE"

* `hasValue` - `true` if the current argument has a value

* `tail` - returns all arguments after the current one as an array and
  causes the next call to `next()` to return `false`.

* `boolValue` - the boolean value of the current arguments.  

  For switches
  with no value this returns `true`.  Otherwise the value must be one of
  `yes`, `true`, `on` or `no`, `false`, `off`.

* `intValue` - the current value parsed with `parseInt`.  Throws an error
  if `parseInt` return `NaN`

* `floatValue` - the current value parsed with `parseFloat`.  Throws an 
  error if `parseFloat` return `NaN`

* `oneOfValue(value)` - returns one of the specified values, or throws an
  error.  
  
  `value` can be an array of strings, or a string with values
  separated by commas `,` or vertical bars (`|`).  eg: `"apples|pears|bananas`.



## Displaying Version Info

The `showPackageVersion` function can be used to show a version banner using information from a `package.json` file.

eg: 

```js
import { showPackageVersion } from "@toptensoftware/clargs";

showPackageVersion(path.join(__dirname, "package.json"));
```

writes to console a message similar to:

```
${pkg.name} ${pkg.version} - ${pkg.description}
#{pkg.copyright}
```

If the package doesn't contain a `copyright` field it instead displays `author` and `license`.


## Displaying Argument Help

The `showArgs` function displays aligned and wrapped
text help for command arguments:

```js
import { showArgs } from "@toptensoftware/clargs";

showArgs({
    "--arg2": "arg 1 description"
    "--arg2": "arg 2 description"
});
```

The `showArgs` function aligns the arguments and descriptions into two columns, wrapping the right description column at the terminal width (if output is being sent to a console terminal).

## License

See LICENSE file
