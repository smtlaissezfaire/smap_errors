
# smap_errors:

## Why?

  You have source maps in production, but get stack traces back like this:

    TypeError: Cannot read property 'value' of undefined
        at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:15163
        at a (https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:14478
        at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:14548
        at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:15197
        at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:18301
        at Object.e.showTraining (https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:22:6381
        at Object.r [as showTraining] (https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:17:11134
        at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:22:4695
        at n (https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:18574
        at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:17717

  What you'd really like is a stack trace back to your unminfied code.


## Install

  $ npm install smap_errors

## Example

    smtlaissezfaire$ cat errors.txt

    ["TypeError: Cannot read property 'value' of undefined",
     "    at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:15163",
     "    at a (https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:14478)",
     "    at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:14548",
     "    at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:15197",
     "    at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:18301",
     "    at Object.e.showTraining (https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:22:6381)",
     "    at Object.r [as showTraining] (https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:17:11134)",
     "    at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:22:4695",
     "    at n (https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:18574)",
     "    at https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js:1:17717"],

    smtlaissezfaire$ cat errors.txt | smap_errors

    Fetching url: https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js
    Fetching url: https://www.learnup.com/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.js.map

          995:17  at:              `value` (/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.orig.js)
          926:6   at:           `iterator` (/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.orig.js)
          935:12  at:            `iterate` (/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.orig.js)
          997:8   at:           `callback` (/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.orig.js)
         1276:21  at:               `call` (/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.orig.js)
        34183:4   at:                 `cb` (/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.orig.js)
        26375:25  at:              `apply` (/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.orig.js)
        34086:11  at:       `showTraining` (/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.orig.js)
         1300:23  at:              `apply` (/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.orig.js)
         1229:21  at:              `apply` (/assets/front_end-5c61818c6e14fa865d9c7a59080878a1.orig.js)

Just pipe in your error report on STDIN.


## License

(The MIT License)

Copyright (c) 2011 Scott Taylor <scott@railsnewbie.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
