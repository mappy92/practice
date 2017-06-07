import React from 'react';

class App extends React.Component {
   render() {
      
       var myStyle = {
         fontSize: 100,
         color: 'green'
      }
       
      return (
         <div>
            <h1 style={myStyle}>Header</h1>
            <h2>Content</h2>
            <p>Hello World!!!</p>
         </div>
      );
   }
}

export default App;