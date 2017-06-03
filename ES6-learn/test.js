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




