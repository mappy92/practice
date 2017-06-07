var mesaage ="hello es6";
console.log(mesaage);

var no = 10; 
var no = 20; 
console.log(no);

//let no = 10; 
//let no = 20; 
console.log(no); // error no has already been declared

/*function add(a, b = 1) { 
   return a+b; 
} 
console.log(add(4))

function add(a, b = 1) { 
   return a + b; 
} 
console.log(add(4,2))


*/

// default parameters

function add(a, b = 1) { 
   return a+b; 
} 
console.log(add(4));
 
console.log(add(4,2));

// reset parameters
function fun1(...params) {
   console.log(params.length);
}

fun1();
fun1(5);
fun1(5, 6, 7);

//lambda expresion

//([param1, parma2,…param n] )=>statement;

var foo = (x)=>10+x;
console.log(foo(10));
// 20 will be output


var msg = ()=> { 
   console.log("function invoked") 
} 
msg();


//hoist_function(); // TypeError: hoist_function() is not a function  
/*var hoist_function() = function() { 
   console.log("bar"); 
};*/


//IIFE - 2 examples

var main = function() { 
   var loop = function() { 
      for(var x = 0;x<5;x++) {
         console.log(x); 
      } 
   }(); 
  // console.log("x can not be accessed outside the block scope x value is :"+x); 
} 
main();



var main = function() { 
   (function() { 
      for(var x = 0;x<5;x++) { 
         console.log(x); 
      } 
   })(); 
  // console.log("x can not be accessed outside the block scope x value is :"+x); 
} 
main();


// generator funcitons

"use strict" 
function* rainbow() { 
   // the asterisk marks this as a generator 
   yield 'red'; 
   yield 'orange'; 
   yield 'yellow'; 
   yield 'green'; 
   yield 'blue'; 
   yield 'indigo'; 
   yield 'violet'; 
} 
for(let color of rainbow()) { 
   console.log(color); 
} 


function* ask() {
   const name = yield "What is your name?";
   const sport = yield "What is your favorite sport?";
   return `${name}'s favorite sport is ${sport}`;
}  
const it = ask(); 
console.log(it.next()); 
console.log(it.next('Ethan'));  
console.log(it.next('Cricket')); 

//ES6

var foo = 'bar' 
var baz = { foo } 
console.log(baz.foo)

// equivalent ES5 

var foo = 'bar' 
var baz = { foo:foo } 
console.log(baz.foo)



// object create

var roles = { 
   type: "Admin", // Default value of properties 
   displayType : function() {  
      // Method which will display type of role 
      console.log(this.type); 
   } 
}  
// Create new role type called super_role 
var super_role = Object.create(roles); 
super_role.displayType(); // Output:Admin  

// Create new role type called Guest 
var guest_role = Object.create(roles); 
guest_role.type = "Guest"; 
guest_role.displayType(); // Output:Guest

// Object.assign()


"use strict"
var det = { name:"Tom", ID:"E1001" };
var copy = Object.assign({}, det);
console.log(copy);  
for (let val in copy) {
   console.log(copy[val]);
}

// merging objects


var o1 = { a: 10 };
var o2 = { b: 20 };
var o3 = { c: 30 };
var obj = Object.assign(o1, o2, o3);
console.log(obj);
console.log(o1);


// new object will hold only references

var o1 = { a: 10 };
var obj = Object.assign(o1);
obj.a++;
console.log("Value of 'a' in the Merged object after increment  ")
console.log(obj.a);
console.log("value of 'a' in the Original Object after increment ")
console.log(o1.a);

//Example 1 − Different Object References

var val1 = {name: "Tom"};
var val2 = {name: "Tom"};
console.log(val1 == val2)  // return false 
console.log(val1 === val2)  // return false


//Example 2 − Single Object Reference

var val1 = {name: "Tom"};
var val2 = val1;

console.log(val1 == val2) // return true 
console.log(val1 === val2) // return true

// Object De-structuring
var emp = { name: 'John', Id: 3 };
var {name, Id} = emp;
console.log(name);
console.log(Id);
// John
//3



//Example 1

var name = "Brendan"; 
console.log('Hello, ${name}!');
//The following output is displayed on successful execution of the above code.

//Hello, Brendan!
//Example 2: Template literals and expressions

var a = 10; 
var b = 10; 
console.log(`The sum of ${a} and ${b} is  ${a+b} `);
//The following output is displayed on successful execution of the above code.

//The sum of 10 and 10 is 20 
//Example 3: Template literals and function expression

function fn() { return "Hello World"; } 
console.log(`Message: ${fn()} !!`);
///The following output is displayed on successful execution of the above code.

//Message: Hello World !!

/*var multiLine ='This is 
   a string 
   with multiple 
   lines'; 
console.log(multiLine);*/

// raw


var text =`Hello \n World` 
console.log(text)  

var raw_text = String.raw`Hello \n World ` 
console.log(raw_text)

// Hello 
//World 
//Hello \n World


var map = new Map(); 
map.set('name','Tutorial Point'); 
map.get('name'); // Tutorial point

// 1 is different from "1"
var map = new Map(); 
map.set(1,true); 
console.log(map.has("1")); //false 

map.set("1",true); 
console.log(map.has("1")); //true
// chainable
var roles = new Map(); 
roles.set('r1', 'User') 
.set('r2', 'Guest') 
.set('r3', 'Admin'); 
console.log(roles.has('r1'))

// overwrite the exsting value
var roles = new Map([ 
   ['r1', 'User'], 
   ['r2', 'Guest'], 
   ['r3', 'Admin'], 
]);  
console.log(`value of key r1 before set(): ${roles.get('r1')}`) 
roles.set('r1','superUser') 
console.log(`value of key r1 after set(): ${roles.get('r1')}`)

//Example : Weak Map
'use strict' 
/*let weakMap = new WeakMap(); 
let obj = {}; 
console.log(weakMap.set(obj,"hello"));  
console.log(weakMap.has(obj));// true*/

// SET
//Example 1: Set and Iterator
var  set = new Set(['a','b','c','d','e']);  
var iterator = set.entries(); 
console.log(iterator.next())
//The following output is displayed on successful execution of the above code.

//{ value: [ 'a', 'a' ], done: false } 
//Since, the set does not store key/value, the value array contains similar key and value. done will be false as there are more elements to be read.

//Example 2: Set and Iterator
var  set = new Set(['a','b','c','d','e']);  
var iterator = set.values(); 
console.log(iterator.next());
//The following output is displayed on successful execution of the above code.

//{ value: 'a', done: false }  
//Example 3: Set and Iterator
var  set = new Set(['a','b','c','d','e']);  
var iterator = set.keys(); 
console.log(iterator.next()); 
//The following output is displayed on successful execution of the above code.

//{ value: 'a', done: false }


//MAP
//Example 4: Map and Iterator
var map = new Map([[1,'one'],[2,'two'],[3,'three']]); 
var iterator = map.entries(); 
console.log(iterator.next()); 
//The following output is displayed on successful execution of the above code.

//{ value: [ 1, 'one' ], done: false }  
//Example 5: Map and Iterator
var map = new Map([[1,'one'],[2,'two'],[3,'three']]); 
var iterator = map.values(); 
console.log(iterator.next());  
//The following output is displayed on successful execution of the above code.

//{value: "one", done: false} 
//Example 6: Map and Iterator
var map = new Map([[1,'one'],[2,'two'],[3,'three']]); 
var iterator = map.keys(); 
console.log(iterator.next());  
//The following output is displayed on successful execution of the above code.

//{value: 1, done: false}



// CLASSES


'use strict' 
class Polygon { 
   constructor(height, width) { 
      this.h = height; 
      this.w = width;
   } 
   test() { 
      console.log("The height of the polygon: ", this.h) 
      console.log("The width of the polygon: ",this. w) 
   } 
} 

//creating an instance  
var polyObj = new Polygon(10,20); 
polyObj.test();


//The Static Keyword
//The static keyword can be applied to functions in a class. Static members are referenced by the class name.


'use strict' 
class StaticMem { 
   static disp() { 
      console.log("Static Function called") 
   } 
} 
StaticMem.disp() //invoke the static method


'use strict' 
class Person{ } 
var obj = new Person() 
var isPerson = obj instanceof Person; 
console.log(" obj is an instance of Person " + isPerson); 


/ inheritance 
'use strict' 
class Shape { 
   constructor(a) { 
      this.Area = a
   } 
} 
class Circle extends Shape { 
   disp() { 
      console.log("Area of the circle:  "+this.Area) 
   } 
} 
var obj = new Circle(223); 
obj.disp() 



// multi level 

'use strict' 
class Root { 
   test() { 
      console.log("call from parent class") 
   } 
} 
class Child extends Root {} 
class Leaf extends Child   

//indirectly inherits from Root by virtue of inheritance {} 
var obj = new Leaf();
obj.test();

// method overloading

'use strict' 
class PrinterClass { 
   doPrint() { 
      console.log("doPrint() from Parent called… 
   }  
   class StringPrinter extends PrinterClass { 
      doPrint() { 
         console.log("doPrint() is printing a string…") 
      } 
   } 
   var obj = new StringPrinter() 
   obj.doPrint()
}

// super keyword

'use strict' 
class PrinterClass { 
   doPrint() {
      console.log("doPrint() from Parent called…") 
   } 
}  
class StringPrinter extends PrinterClass { 
   doPrint() { 
      super.doPrint() 
      console.log("doPrint() is printing a string…") 
   } 
} 
var obj = new StringPrinter() 
obj.doPrint()

// Promises Async programming Callbacks

function notifyAll(fnSms, fnEmail) {   
      console.log('starting notification process');   
      fnSms();   
      fnEmail();   
   }   
   notifyAll(function() {   
      console.log("Sms send ..");   
   }, 
   function() {   
      console.log("email send ..");   
   });   
   console.log("End of script"); 
   //executes last or blocked by other methods 


// promise

function getSum(n1, n2) {   
   varisAnyNegative = function() {   
      return n1 < 0 || n2 < 0;   
   }   
   var promise = new Promise(function(resolve, reject) {   
      if (isAnyNegative()) {   
         reject(Error("Negatives not supported"));   
      }   
      resolve(n1 + n2)
   });   
   return promise;   
}


getSum(5, 6)   
.then(function (result) {   
   console.log(result);   
},   
function (error) {   
   console.log(error);   
});



//Example 1: Custom Error with default message
function MyError(message) { 
   this.name = 'CustomError'; 
   this.message = message || 'Error raised with default message'; 
} 
try { 
   //throw new MyError();
    throw new MyError('Printing Custom Error message'); // EX 2
} catch (e) {  
   console.log(e.name);      
   console.log(e.message);  // 'Default Message' 
}