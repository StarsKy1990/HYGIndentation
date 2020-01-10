
# hygindentation README
Some of us (i hope nearly no one actually) have to code using programming languages
from the dark ages (sometime in the 80s i guess). In my case that means that every 
line of code has to start with :C: (for calculation lines) or :T: (for printing 
something to the "tape", yes this language is that old). Since those statements are
required at the start of a line the usual indenting and outdenting doesn't work.
So I built this extension to save myself about 2 minutes of work each day. Of 
course thats not a lot but it also helps to keep my sanity ...

## Features
You can specify which String-patterns have to hold their ground (i also was 
considering calling it "not one step back extension") at the beginning of the line.
You can add multiple patterns using a delimiter (also set in the settings). A 
boolean variable allows you to choose if leading spaces should be ignored or 
refactured.

## Requirements
You are using a stupid dark-age-programming-language (or have another usecase for 
this)

## Extension Settings
Include if your extension adds any VS Code settings through the 
`contributes.configuration` extension point.
For example:
This extension contributes the following settings:
* `HYGIndent.LeadingSpaces`: Refactoring a line if it starts with leading zeros 
before the 'search pattern'
* `HYGIndent.Pattern`: Pattern that 'holds its ground' --> This patterns stay at 
the beginning of the line while indenting
* `HYGIndent.Delimiter`: Delimiter to use to differenciate between the 
HoldYourGround Patterns
I also added KeyBoard Shortcuts, you can change them in the settings of course
* `extension.HYGIndent`     : Indenting
                            "key": "ctrl+tab",
                            "when": "editorTextFocus"
* `extension.HYGOutdent`    : Outdenting
                            "key": "ctrl+shift+tab",
                            "when": "editorTextFocus"
                            
## Known Issues
I know of three people using this extension and they told me it works like a charm

## Release Notes
The VSCode Extention Generator told me that Users appreciate release notes

### 1.0.0
Initial release of HoldYourGround Indentation
