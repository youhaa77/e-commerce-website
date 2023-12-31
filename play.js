let footballer={
name:'barella',
goals:25,
assists:55,
hello(){
	console.log("hello "+this.name)
}


}

const fofa =(name) =>{
	console.log(name)
  //return ('my name is '+name+' age is '+age)
}
const list=[1,2,3,4,5];
let temp=0;
/*list.forEach(lolo=(fofa)=>{
   temp=temp+fofa
	console.log(temp)

})*/

let newList =list.filter((index)=>{
return (index>2)
})
//console.log(newList);

const fetchData = (callback) => {
  setTimeout(()=>callback('done'),2000)
};
setTimeout(()=>{
	console.log("timer")
	fetchData(fofa)
} ,1000)

