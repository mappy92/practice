var a=1;
var b=2;
var c=3;
var d=4;
var e = 1000;
console.log(a);

setTimeout(function(){
   console.log(b); 
},0);

setTimeout(function(){
   console.log(c); 
},10);

while(e){
   console.log(e);
   e--;
}
console.log(d);



